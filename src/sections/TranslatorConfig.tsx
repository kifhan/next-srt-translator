import Select from '@/components/Select';
import Slider from '@/components/Slider';
import Switch from '@/components/Switch';
import InputNumber from '@/components/InputNumber';

import React, { ChangeEvent, useState } from 'react';
import { gptModelChoice } from '@/types';

const LANGUAGE_CHOICES = [
    // 'Spanish',
    // 'French',
    // 'German'
    'Traditional Chinese',
    'Korean',
    'English',
    'Chinese',
    'Japanese',
];

interface TranslatorProps {
    language: string;
    setLanguage: (lang: string) => void;
    temperature: number;
    setTemperature: (temp: number) => void;
    useModerator: boolean;
    setUseModerator: (value: boolean) => void;
    rateLimit: number;
    setRateLimit: (value: number) => void;

    gptModel: gptModelChoice;
    setGptModel: (model: gptModelChoice) => void;

    onGenerate: () => void;
}

const TranslatorConfig: React.FC<TranslatorProps> = ({
    language,
    setLanguage,
    temperature,
    setTemperature,
    useModerator,
    setUseModerator,
    rateLimit,
    setRateLimit,
    gptModel,
    setGptModel,
    onGenerate
}: TranslatorProps) => {
    const generate = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Generating...');
        onGenerate();
    }

    const gptModelChoices = [
        'openai', 'gemini'
    ];

    return (
        <div className="flex flex-col w-full">
            <form id="translator-config-form" onSubmit={generate} className="p-4 flex flex-wrap justify-between w-full gap-4">
                <div className="z-10 w-full rounded-lg">
                    <div className="flex gap-3 pb-0 p-4 border-b">
                        <div className="flex flex-col">
                            <p className="text-lg font-semibold">Configuration</p>
                        </div>
                    </div>
                    <div className="p-4">
                        <div className='flex justify-between w-full' style={{ gap: "12px" }}>

                            <div className='flex w-full'>
                                <Select
                                    label="Language"
                                    options={LANGUAGE_CHOICES}
                                    value={language}
                                    onChange={(value: string) => setLanguage(value)}
                                />
                            </div>

                            <div className='flex w-full'>
                                <Select
                                    label="GPT Model"
                                    options={gptModelChoices}
                                    value={gptModel}
                                    onChange={(value: string) => setGptModel(value as gptModelChoice)}
                                />
                            </div>

                            {/* <div className='w-full md:w-3/12'>
                                <Slider
                                    label="Temperature"
                                    max={2}
                                    min={0}
                                    step={0.1}
                                    value={temperature}
                                    onChange={(e) => setTemperature(Number(e))}
                                />
                            </div>

                            <div className='w-full md:w-1/2 flex'>
                                <Switch
                                    label="Use Moderator"
                                    value={useModerator}
                                    onChange={setUseModerator}
                                />
                            </div>

                            <InputNumber
                                label="Rate Limit"
                                value={rateLimit}
                                onChange={(value) => setRateLimit(value)}
                                endContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-gray-400 text-small">RPM</span>
                                    </div>
                                }
                            /> */}
                        </div>
                    </div>
                </div>
            </form >
        </div>
    );
};

export default TranslatorConfig;
