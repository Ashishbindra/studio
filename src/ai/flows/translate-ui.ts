// src/ai/flows/translate-ui.ts
'use server';
/**
 * @fileOverview A UI translation AI agent.
 *
 * - translateUi - A function that handles the UI translation process.
 * - TranslateUiInput - The input type for the translateUi function.
 * - TranslateUiOutput - The return type for the translateUi function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateUiInputSchema = z.object({
  text: z.string().describe('The text to translate.'),
  targetLanguage: z.enum(['en', 'hi']).describe('The target language for the translation (en for English, hi for Hindi).'),
});
export type TranslateUiInput = z.infer<typeof TranslateUiInputSchema>;

const TranslateUiOutputSchema = z.object({
  translatedText: z.string().describe('The translated text.'),
});
export type TranslateUiOutput = z.infer<typeof TranslateUiOutputSchema>;

export async function translateUi(input: TranslateUiInput): Promise<TranslateUiOutput> {
  return translateUiFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateUiPrompt',
  input: {schema: TranslateUiInputSchema},
  output: {schema: TranslateUiOutputSchema},
  prompt: `You are a translation expert. Translate the given text to the target language.

Text: {{{text}}}
Target Language: {{{targetLanguage}}}

Translation:`,
});

const translateUiFlow = ai.defineFlow(
  {
    name: 'translateUiFlow',
    inputSchema: TranslateUiInputSchema,
    outputSchema: TranslateUiOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
