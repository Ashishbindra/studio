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
  texts: z.array(z.string()).describe('The text elements to translate.'),
  targetLanguage: z.enum(['en', 'hi']).describe('The target language for the translation (en for English, hi for Hindi).'),
});
export type TranslateUiInput = z.infer<typeof TranslateUiInputSchema>;

const TranslateUiOutputSchema = z.object({
  translatedTexts: z.array(z.string()).describe('The translated texts, in the same order as the input.'),
});
export type TranslateUiOutput = z.infer<typeof TranslateUiOutputSchema>;

export async function translateUi(input: TranslateUiInput): Promise<TranslateUiOutput> {
  return translateUiFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateUiPrompt',
  input: {schema: TranslateUiInputSchema},
  output: {schema: TranslateUiOutputSchema},
  prompt: `You are a translation expert. Translate the given JSON array of strings to the target language.
Return a JSON array of the translated strings, maintaining the same order.

Texts:
{{json texts}}

Target Language: {{{targetLanguage}}}

Translation (JSON array of strings):`,
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
