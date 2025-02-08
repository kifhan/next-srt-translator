import { gptModelChoice } from "@/types";
import { splitText, translateText } from "./srt_process";

export interface TranslationEventListeners {
    [key: string]: any;
}

export interface TranslationEvent {
    type: string;
    data: {
        progress: number;
        translatedSRTText: string;
    };
}

class TranslationController {
    _isTranslating: boolean = false;
    _isPaused: boolean = false;
    _currentIndex: number = 0;
    _progress: number = 0;
    _translatedSRTText: string = '';
    _originalChunks: string[] = [];
    _translatedChunks: string[] = [];
    _generator: any;
    _language: string;
    _listeners: TranslationEventListeners;
    _model: gptModelChoice;

    _verbose: boolean = true;

    get isTranslating(): boolean {
        return this._isTranslating;
    }

    get isPaused(): boolean {
        return this._isPaused;
    }

    get progress(): number {
        return this._progress;
    }

    get translatedSRTText(): string {
        return this._translatedSRTText;
    }

    get language(): string {
        return this._language;
    }

    constructor(originalText: string, language: string, model: gptModelChoice) {
        this._language = language;
        this._model = model;

        const data = splitText(originalText);

        this._originalChunks = data;           // Array of data to be processed
        this._generator = null;      // Will hold the generator function
        this._isTranslating = false;    // Flag to control the flow
        this._isPaused = false;
        this._currentIndex = 0;          // Current index of the processing
        this._progress = 0;             // Progress percentage
        this._translatedSRTText = '';   // Final translated text
        this._translatedChunks = [];    // Array of translated chunks
        this._listeners = {          // Event listeners storage
            start: [],
            pause: [],
            resume: [],
            complete: [],
            stop: [],
            progress: []
        };
        if (this._verbose) console.log('TranslationController created');
    }

    *processGenerator() {
        for (let item of this._originalChunks) {
            yield this.translateProcess(item); // Yield each item processing promise
        }
    }

    on(event: string, callback: any) {
        if (this._listeners[event]) {
            this._listeners[event].push(callback);
        }
    }

    off(event: string) {
        if (this._listeners[event]) {
            this._listeners[event] = [];
        }
    }

    emit(event: string, data: TranslationEvent) {
        if (this._listeners[event]) {
            this._listeners[event].forEach((callback: any) => callback(data));
        }
    }

    async translateProcess(chunk: string) {
        try {
            if (this._verbose) console.log('Translating chunk...', this._currentIndex)

            const translated = await translateText(chunk, this._language, false, 3, this._model);
            let _translated = translated.endsWith('\n') ? translated.replace(/\n$/, '') : translated;
            _translated = _translated.startsWith('\n') ? _translated.replace(/^\n/, '') : _translated;
            this._translatedChunks.push(_translated);
            // this._translatedSRTText = this._translatedChunks.join('\n'); // when using gemini
            this._translatedSRTText = this._translatedChunks.join('\n\n'); // when using openai
            this._progress = (this._currentIndex / this._originalChunks.length) * 100;
            this._currentIndex++;

            this.emit('progress', {
                type: 'progress',
                data: {
                    progress: this._progress,
                    translatedSRTText: this._translatedSRTText
                }
            });

            return translated;
        } catch (error) {
            this.pause();
            console.error(error);
            alert('An error occurred while translating the text. Resume to continue.');
        }
    }

    start() {
        if (!this._isTranslating) {
            if (this._verbose) console.log('Processing started')
            this.emit('start', {
                type: 'start',
                data: {
                    progress: this._progress,
                    translatedSRTText: this._translatedSRTText
                }
            });

            this._isTranslating = true;
            this._isPaused = false;
            this._currentIndex = 0;
            this._progress = 0;
            this._translatedSRTText = '';
            this._translatedChunks = [];

            this._generator = this.processGenerator();

            this.next();
        }
    }

    async next() {
        if (!this._isTranslating) return;
        const { value, done } = this._generator.next();
        if (done) {
            this._isTranslating = false;
            this._isPaused = false;
            this._progress = 100;

            if (this._verbose) console.log('Processing complete');
            this.emit('complete', {
                type: 'complete',
                data: {
                    progress: this._progress,
                    translatedSRTText: this._translatedSRTText
                }
            });
            return;
        }
        await value;
        this.next(); // Continue to the next item
    }

    pause() {
        if (this._isTranslating) {
            if (this._verbose) console.log('Processing paused');

            this._isTranslating = false;
            this._isPaused = true;
            this.emit('pause', {
                type: 'pause',
                data: {
                    progress: this._progress,
                    translatedSRTText: this._translatedSRTText
                }
            });
        }
    }

    resume() {
        if (!this._isTranslating) {
            if (this._verbose) console.log('Processing resumed');
            this._isTranslating = true;
            this._isPaused = false;
            this.emit('resume', {
                type: 'resume',
                data: {
                    progress: this._progress,
                    translatedSRTText: this._translatedSRTText
                }
            });
            this.next();
        }
    }

    stop() {
        if (this._verbose) console.log('Processing stopped');
        this._isTranslating = false;
        this._isPaused = false;
        this._currentIndex = 0;
        this._progress = 0;
        this._translatedSRTText = '';
        this._translatedChunks = [];
        this._generator = null;
    }

}

export default TranslationController;