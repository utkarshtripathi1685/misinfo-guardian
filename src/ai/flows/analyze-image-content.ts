'use server';

/**
 * @fileOverview Extracts text from an image using OCR and then analyzes it.
 *
 * - analyzeImageContent - Extracts text from an image and then runs it through the content analyzer.
 * - AnalyzeImageContentInput - The input type for the analyzeImageContent function.
 * - AnalyzeImageContentOutput - The return type for the analyzeImageContent function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { analyzeSubmittedContent } from './analyze-submitted-content';
import type { AnalyzeSubmittedContentOutput } from './analyze-submitted-content';

const AnalyzeImageContentInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a document or text, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeImageContentInput = z.infer<typeof AnalyzeImageContentInputSchema>;

export type AnalyzeImageContentOutput = AnalyzeSubmittedContentOutput;


export async function analyzeImageContent(
  input: AnalyzeImageContentInput
): Promise<AnalyzeImageContentOutput> {
  return analyzeImageContentFlow(input);
}

const extractTextFromImagePrompt = ai.definePrompt({
    name: 'extractTextFromImagePrompt',
    input: { schema: AnalyzeImageContentInputSchema },
    output: { schema: z.object({ text: z.string().describe('The text extracted from the image.') }) },
    prompt: `You are an Optical Character Recognition (OCR) tool. Your task is to extract any and all text from the provided image.

    Return only the extracted text. If no text is found, return an empty string.
    
    Image: {{media url=photoDataUri}}`
});


const analyzeImageContentFlow = ai.defineFlow(
  {
    name: 'analyzeImageContentFlow',
    inputSchema: AnalyzeImageContentInputSchema,
    outputSchema: z.custom<AnalyzeImageContentOutput>(),
  },
  async (input) => {
    const { output } = await extractTextFromImagePrompt(input);
    if (!output || !output.text) {
        throw new Error("Could not extract text from the image.");
    }

    const analysisResult = await analyzeSubmittedContent({ content: output.text });
    
    return analysisResult;
  }
);
