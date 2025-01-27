import { generateMarkers } from "./marker_process";
import TranslationController from "./TranslationController";


class MarkerGenerator extends TranslationController {

    _generatedMarkers: any[] = [];

    constructor(originalSRTText: string, language: string) {
        super(originalSRTText, language);

        this._generatedMarkers = [];
    }

    // Override ========================================

    *processGenerator() {
        for (let item of this._originalChunks) {
            yield this.generateProcess(item); // Yield each item processing promise
        }
    }

    async generateProcess(chunk: string) {
        try {
            if (this._verbose) console.log('Translating chunk', chunk);

            const generated = await generateMarkers(chunk);
            const markers = JSON.parse(generated);
            if (markers.status !== 'Success') {
                throw new Error('Failed to generate markers');
            }
            this._generatedMarkers.concat(markers.results);

            this._translatedChunks.push(generated);

            this._progress = (this._currentIndex / this._originalChunks.length) * 100;
            this._currentIndex++;

            this.emit('progress', {
                type: 'progress',
                data: {
                    progress: this._progress,
                    generatedMarkers: this._generatedMarkers
                }
            });

            return generated;
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
                    generatedMarkers: this._generatedMarkers
                }
            });

            this._isTranslating = true;
            this._isPaused = false;
            this._currentIndex = 0;
            this._progress = 0;
            this._generatedMarkers = [];
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
                    generatedMarkers: this._generatedMarkers
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
                    generatedMarkers: this._generatedMarkers
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
                    generatedMarkers: this._generatedMarkers
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
        this._generatedMarkers = [];
        this._translatedChunks = [];
        this._generator = null;
    }
}

export default MarkerGenerator;