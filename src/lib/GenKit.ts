'use server';

import { gemini15Flash, gemini20Flash001, vertexAI } from '@genkit-ai/vertexai';
import { genkit, z } from 'genkit';

const ai = genkit({
  plugins: [vertexAI()],
  model: gemini20Flash001, // set default model
});

export const translateCaption = ai.defineFlow(
  {
    name: "translateCaption",
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (inputText) => {
    const { text } = await ai.generate({
      model: gemini20Flash001,
      prompt: inputText,
    });
    return text;
  }
);