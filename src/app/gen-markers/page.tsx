"use client";

import React, { useEffect, useRef, useState } from 'react'
import MpasView from '@/components/maps/MpasView'
import MarkerGenerator, { MarkerGenerationEventData } from '@/utils/MarkerGenerator';
import SRTTable, { SRT } from '@/components/srt/SRTTable';
import { TranslationEvent } from '@/utils/TranslationController';
import FileUploadButton from '@/components/FileUploadButton';
import ProgressBar from '@/components/ProgressBar';
import ControlButton from '@/components/ControlButton';
import { MarkerData } from '@/types';

export default function Page() {

    const generationControllerRef = useRef<MarkerGenerator>(undefined);

    const [originalSRTText, setOriginalSRTText] = useState<string>();
    const [originalSRT, setOriginalSRT] = useState<Array<SRT>>();

    const [generatedMarkers, setGeneratedMarkers] = useState<Array<MarkerData>>();

    const [translateProgress, setTranslateProgress] = useState<number>(0);
    const [isTranslating, setIsTranslating] = useState<boolean>(false);
    const [isPaused, setIsPaused] = useState<boolean>(false);

    const onGenerate = async () => {
        if (!originalSRTText) return;
        if (generationControllerRef.current) {
            generationControllerRef.current.off('progress');
            generationControllerRef.current.off('complete');
            generationControllerRef.current.off('start');
            generationControllerRef.current.off('stop');
            generationControllerRef.current.off('pause');
            generationControllerRef.current.off('resume');
            generationControllerRef.current.stop();
            // destroy the controller
            generationControllerRef.current = undefined;
        }

        const controller = new MarkerGenerator(originalSRTText, '');
        generationControllerRef.current = controller;

        controller.on('progress', (event: TranslationEvent<MarkerGenerationEventData>) => {
            console.log('progress', event.data.progress);
            setTranslateProgress(event.data.progress);
            setGeneratedMarkers(event.data.generatedMarkers);
        });
        controller.on('complete', (event: TranslationEvent<MarkerGenerationEventData>) => {
            setTranslateProgress(event.data.progress);
            setGeneratedMarkers(event.data.generatedMarkers);
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

    const onStopTranslate = () => {
        if (generationControllerRef.current) {
            generationControllerRef.current.stop();
            generationControllerRef.current.off('progress');
            generationControllerRef.current.off('complete');
            generationControllerRef.current.off('start');
            generationControllerRef.current.off('stop');
            generationControllerRef.current.off('pause');
            generationControllerRef.current.off('resume');
            generationControllerRef.current = undefined;
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

    return (
        <div className="w-full flex flex-col ">

            <section className="flex flex-col w-full px-12 gap-4 grow-0">
                <div className="flex items-end justify-between w-full">
                    <FileUploadButton label="upload original SRT" onFileSelect={onFileSelect} />
                    <div className="flex gap-4">
                        {generationControllerRef.current ? <ProgressBar value={translateProgress} max={100} /> : null}

                        {!generationControllerRef.current ? <ControlButton label="Start" color="bg-blue-500" onClick={onGenerate} /> : null}

                        {isTranslating ? <ControlButton label="Pause" color="bg-yellow-500" onClick={() => generationControllerRef.current?.pause()} /> : null}
                        {isPaused ? <ControlButton label="Resume" color="bg-green-500" onClick={() => generationControllerRef.current?.resume()} /> : null}

                        {generationControllerRef.current ? <ControlButton label="Stop" color="bg-red-500" onClick={onStopTranslate} /> : null}

                    </div>
                    {/* <FileDownloadButton label="Download" onClick={onDownload} disabled={!translatedSRT} /> */}
                </div>
            </section>

            <section className="flex flex-row w-full"
                style={{
                    height: 'calc(100vh - 160px)',
                }}>
                {/* px-2 py-2 gap-4 */}
                <div className="flex flex-col items-start justify-between w-1/2 h-full overflow-y-scroll">
                    <SRTTable srt={originalSRT} onChange={setOriginalSRT} readonly={true} />
                </div>
                <div className="flex flex-col items-start justify-between w-1/2 h-full">
                    <MpasView
                        // videoId={videoId}
                        // userId={authService.currentUser ? authService.currentUser.uid : ""}
                        // isUserOwner={authService.currentUser && authService.currentUser.uid === videodbData.uid ? true : false}
                        // mapCenter={locationCenter}
                        // width={`${clipWidth / 2}px`}
                        // height="100%"
                        // markers={mapmarkers} anchoring={anchoring} playTime={playTime}
                        // onMarkerPlayClick={onMarkerPlayClick}
                        // onPostNewMarker={onPostNewMarker}
                        // onEditMarker={onEditMarker}
                        // onEditVideoItem={onEditVideoItem}
                        // onRemoveVideoItem={onRemoveVideoItem}
                        // onRemoveMarker={onRemoveMarker}

                        videoId=''
                        userId=''
                        isUserOwner={false}
                        mapCenter={generatedMarkers ? generatedMarkers[0].location : { lat: 0, lng: 0 }}
                        width='100%'
                        height='100vh'
                        markers={generatedMarkers ? generatedMarkers : []}
                        anchoring={undefined}
                        playTime={0}
                        onMarkerPlayClick={undefined}
                        onPostNewMarker={(marker: any) => { }}
                        onEditMarker={(marker: any) => { }}
                        onEditVideoItem={(data: any) => { }}
                        onRemoveVideoItem={() => { }}
                        onRemoveMarker={(marker: any) => { }}
                    />
                    {/* {generatedMarkers ? generatedMarkers.map((marker, index) => {
                        return (
                            <div key={index} className="flex flex-col w-full gap-4">
                                <div className="flex flex-row w-full gap-4">
                                    <div className="flex flex-col w-1/2">
                                        <span>{marker.start}</span>
                                        <span>{marker.end}</span>
                                    </div>
                                    <div className="flex flex-col w-1/2">
                                        <span>{marker.text}</span>
                                    </div>
                                </div>
                                <div className="flex flex-row w-full gap-4">
                                    <div className="flex flex-col w-1/2">
                                        <span>{marker.lat}</span>
                                        <span>{marker.lng}</span>
                                    </div>
                                    <div className="flex flex-col w-1/2">
                                        <span>{marker.type}</span>
                                        <span>{marker.seekto}</span>
                                    </div>
                                </div>
                            </div>
                        )}) : null
                    } */}
                </div>
            </section>
        </div>
    )
}
