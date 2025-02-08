"use client";

import { useEffect, useRef, useState } from "react";
import TranslatorConfig from "@/sections/TranslatorConfig";
import FileUploadButton from "@/components/FileUploadButton";
import FileDownloadButton from "@/components/ControlButton";
import SRTTable, { SRT } from "@/components/srt/SRTTable";
import { splitText, translateText } from "@/utils/srt_process";
import ControlButton from "@/components/ControlButton";

import TranslationController, { TranslationEvent } from "@/utils/TranslationController";
import ProgressBar from "@/components/ProgressBar";

import githubLogo from "@/assets/github-mark.png";
import Image from "next/image";

export default function Home() {
  const [language, setLanguage] = useState("Traditional Chinese");
  const [temperature, setTemperature] = useState(0.5);
  const [useModerator, setUseModerator] = useState(false);
  const [rateLimit, setRateLimit] = useState(50);
  const [gptModel, setGptModel] = useState<"openai" | "gemini">("openai");

  const translationControllerRef = useRef<TranslationController>(undefined);

  // const [file, setFile] = useState<File | null>(null);
  // const [resultUrl, setResultUrl] = useState<string | undefined>();

  const [originalSRTText, setOriginalSRTText] = useState<string>();
  const [translatedSRTText, setTranslatedSRTText] = useState<string>();

  const [originalSRT, setOriginalSRT] = useState<Array<SRT>>();
  const [translatedSRT, setTranslatedSRT] = useState<Array<SRT>>();

  const [translateProgress, setTranslateProgress] = useState<number>(0);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const onGenerate = async () => {
    if (!originalSRTText) return;
    if (translationControllerRef.current) {
      translationControllerRef.current.off('progress');
      translationControllerRef.current.off('complete');
      translationControllerRef.current.off('start');
      translationControllerRef.current.off('stop');
      translationControllerRef.current.off('pause');
      translationControllerRef.current.off('resume');
      translationControllerRef.current.stop();
      // destroy the controller
      translationControllerRef.current = undefined;
    }

    const controller = new TranslationController(originalSRTText, language, gptModel);
    translationControllerRef.current = controller;

    controller.on('progress', (event: TranslationEvent) => {
      console.log('progress', event.data.progress);
      setTranslateProgress(event.data.progress);
      setTranslatedSRTText(event.data.translatedSRTText);
    });
    controller.on('complete', (event: TranslationEvent) => {
      setTranslateProgress(event.data.progress);
      setTranslatedSRTText(event.data.translatedSRTText);
      setIsTranslating(false);
    });
    controller.on('stop', () => {
      setIsTranslating(false);
      setIsPaused(false);
    });
    controller.on('pause', () => {
      setIsTranslating(false);
      setIsPaused(true);
    });
    controller.on('resume', () => {
      setIsTranslating(true);
      setIsPaused(false);
    });
    controller.on('start', () => {
      setIsTranslating(true);
      setIsPaused(false);
    });
    controller.start();
  };

  const onFileSelect = (file: File) => {
    // Read the file
    const reader = new FileReader();
    // turn file into SRT[]
    reader.onload = (e) => {
      let content = e.target?.result as string;
      // /r/n -> /n
      content = content.replace(/\r\n/g, '\n');
      setOriginalSRTText(content);
    };
    reader.readAsText(file);
  }

  const onDownload = () => {
    if (!translatedSRT) return;

    let _translatedSRTText = translatedSRT.reduce((acc, srt) => {
      return acc + `${srt.id}\n${srt.start} --> ${srt.end}\n${srt.text}\n\n`;
    }, '');

    const blob = new Blob([_translatedSRTText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    // setResultUrl(url);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'translated.srt';
    a.click();
  }

  const onStopTranslate = () => {
    if (translationControllerRef.current) {
      translationControllerRef.current.stop();
      translationControllerRef.current.off('progress');
      translationControllerRef.current.off('complete');
      translationControllerRef.current.off('start');
      translationControllerRef.current.off('stop');
      translationControllerRef.current.off('pause');
      translationControllerRef.current.off('resume');
      translationControllerRef.current = undefined;
      setIsTranslating(false);
      setIsPaused(false);
      setTranslateProgress(0);
    }
  }

  useEffect(() => {
    if (!originalSRTText) return;

    const srt = originalSRTText.split('\n\n').map((block, index) => {
      const lines = block.split('\n');
      // console.log(lines);
      if (lines.length < 3) return { id: 0, start: '', end: '', text: '' };
      const id = parseInt(lines[0]);
      const [start, end] = lines[1].split(' --> ').map((time) => {
        return time;
      });
      const text = lines.slice(2).join('\n');

      return { id, start, end, text };
    });

    setOriginalSRT(srt);
  }, [originalSRTText]);

  useEffect(() => {
    if (!translatedSRTText) return;

    console.log("translatedSRTText", translatedSRTText);

    const srt = translatedSRTText.split('\n\n').map((block, index) => {
      const lines = block.split('\n');
      // console.log(lines);
      if (lines.length < 3) return { id: 0, start: '', end: '', text: '' };
      let id = parseInt(lines[0]);
      if (Number.isNaN(id)) id = index + 1;
      const [start, end] = lines[1].split(' --> ').map((time) => {
        return time;
      });
      const text = lines.slice(2).join('\n');

      return { id, start, end, text };
    });

    setTranslatedSRT(srt);
  }, [translatedSRTText]);

  return (
    <main className="flex min-h-screen flex-col p-6 gap-2">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-2xl font-bold">TakeCaption</h1>
        <a href="https://github.com/kifhan/next-srt-translator" target="_blank" rel="noopener noreferrer">
          <Image src={githubLogo.src} alt="GitHub" className="w-8 h-8" width={32} height={32} />
        </a>
      </div>
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex  grow-0">
        <TranslatorConfig
          language={language}
          setLanguage={setLanguage}
          temperature={temperature}
          setTemperature={setTemperature}
          useModerator={useModerator}
          setUseModerator={setUseModerator}
          rateLimit={rateLimit}
          setRateLimit={setRateLimit}
          gptModel={gptModel}
          setGptModel={setGptModel}
          onGenerate={onGenerate}
        />
      </div>
      <section className="flex flex-col w-full px-12 gap-4 grow-0">
        <div className="flex items-end justify-between w-full">
          <FileUploadButton label="upload original SRT" onFileSelect={onFileSelect} />
          <div className="flex gap-4">
            {translationControllerRef.current ? <ProgressBar value={translateProgress} max={100} /> : null}
            
            {!translationControllerRef.current ? <ControlButton label="Start" color="bg-blue-500" onClick={onGenerate} /> : null}

            {isTranslating ? <ControlButton label="Pause" color="bg-yellow-500" onClick={() => translationControllerRef.current?.pause()} /> : null}
            {isPaused ? <ControlButton label="Resume" color="bg-green-500" onClick={() => translationControllerRef.current?.resume()} /> : null}

            {translationControllerRef.current ? <ControlButton label="Stop" color="bg-red-500" onClick={onStopTranslate} /> : null}

          </div>
          <FileDownloadButton label="Download" onClick={onDownload} disabled={!translatedSRT} />
        </div>
      </section>

      <section className="flex flex-row w-full px-2 py-2 gap-4 grow">
        <div className="flex flex-col items-start justify-between w-1/2">
          <SRTTable srt={originalSRT} onChange={setOriginalSRT} readonly={true} />
        </div>
        <div className="flex flex-col items-start justify-between w-1/2">
          <SRTTable srt={translatedSRT} onChange={setTranslatedSRT} />
        </div>
      </section>
    </main>
  );
}
