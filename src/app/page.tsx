"use client";

import { useEffect, useState } from "react";
import TranslatorConfig from "@/sections/TranslatorConfig";
import FileUploadButton from "@/components/FileUploadButton";
import FileDownloadButton from "@/components/ControlButton";
import SRTTable, { SRT } from "@/components/srt/SRTTable";
import { splitText, translateText } from "@/utils/srt_process";
import ControlButton from "@/components/ControlButton";

export default function Home() {
  const [language, setLanguage] = useState("en");
  const [temperature, setTemperature] = useState(0.5);
  const [useModerator, setUseModerator] = useState(false);
  const [rateLimit, setRateLimit] = useState(50);

  const [file, setFile] = useState<File | null>(null);

  const [resultUrl, setResultUrl] = useState<string | undefined>();

  const [originalSRTText, setOriginalSRTText] = useState<string>();
  const [translatedSRTText, setTranslatedSRTText] = useState<string>();

  const [originalSRTChunks, setOriginalSRTChunks] = useState<Array<string>>();
  const [translatedSRTChunks, setTranslatedSRTChunks] = useState<Array<string>>();

  const [originalSRT, setOriginalSRT] = useState<Array<SRT>>();
  const [translatedSRT, setTranslatedSRT] = useState<Array<SRT>>();

  const [translateProgress, setTranslateProgress] = useState<number>(0);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  const onGenerate = async () => {
    console.log("Generate");
    if (!originalSRTText) return;

    setTranslatedSRTText('');
    setTranslatedSRTChunks([]);
    setTranslatedSRT([]);
    setTranslateProgress(0);

    try {

      setIsTranslating(true);
      const _chunks = splitText(originalSRTText);
      setOriginalSRTChunks(_chunks);

      const _translatedChunks = [];
      for (let i = 0; i < _chunks.length; i++) {
        const chunk = _chunks[i];
        console.log(chunk);

        const translated = await translateText(chunk, language, false, 1);
        console.log(translated);
        _translatedChunks.push(translated);

        setTranslateProgress((i / _chunks.length) * 100);
        setTranslatedSRTText(_translatedChunks.join('\n\n'));
        // setTranslatedSRTText(_translatedChunks.join('\n\n'));
      }

      setTranslatedSRTChunks(_translatedChunks);
    } catch (error) {
      console.error(error);
      alert("Error translating text");
    } finally {
      setIsTranslating(false);
    }
  };

  const onFileSelect = (file: File) => {
    console.log(file);

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
    setResultUrl(url);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'translated.srt';
    a.click();
  }

  const onStopTranslate = () => {
    // setIsTranslating(false);
    // refresh the page
    window.location.reload();
  }

  useEffect(() => {
    if (!originalSRTText) return;

    const srt = originalSRTText.split('\n\n').map((block, index) => {
      const lines = block.split('\n');
      console.log(lines);
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

    const srt = translatedSRTText.split('\n\n').map((block, index) => {
      const lines = block.split('\n');
      console.log(lines);
      if (lines.length < 3) return { id: 0, start: '', end: '', text: '' };
      const id = parseInt(lines[0]);
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
        <h1 className="text-2xl font-bold">SRT Translator /w chatgpt</h1>
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
          onGenerate={onGenerate}
        />
      </div>
      <section className="flex flex-col w-full px-12 gap-4 grow-0">
        <div className="flex items-end justify-between w-full">
          <FileUploadButton label="upload original SRT" onFileSelect={onFileSelect} />
          <div className="flex gap-4">
            <ControlButton label={isTranslating ? `${translateProgress} %` : "Translate"} onClick={onGenerate} disabled={!originalSRTText || isTranslating} />
            {/* {isTranslating && <div>{translateProgress} %</div>} */}
            {isTranslating ? <ControlButton label="Stop" color="bg-red-500" onClick={onStopTranslate} /> : null}
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
