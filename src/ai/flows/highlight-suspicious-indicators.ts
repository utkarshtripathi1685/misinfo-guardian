'use server';
/**
 * @fileOverview Highlights suspicious indicators within user-submitted text or URLs.
 *
 * - highlightSuspiciousIndicators - A function that highlights suspicious indicators in content.
 * - HighlightSuspiciousIndicatorsInput - The input type for the highlightSuspiciousIndicators function.
 * - HighlightSuspiciousIndicatorsOutput - The return type for the highlightSuspiciousIndicators function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HighlightSuspiciousIndicatorsInputSchema = z.object({
  content: z.string().describe('The text content or URL to analyze for suspicious indicators.'),
});
export type HighlightSuspiciousIndicatorsInput = z.infer<typeof HighlightSuspiciousIndicatorsInputSchema>;

const HighlightSuspiciousIndicatorsOutputSchema = z.object({
  highlightedContent: z
    .string()
    .describe(
      'The content with suspicious indicators highlighted, using markdown for emphasis (e.g., **suspicious phrase**).' /* markdown */
    ),
  indicators: z.array(z.string()).describe('A list of the specific indicators found in the content.'),
});
export type HighlightSuspiciousIndicatorsOutput = z.infer<typeof HighlightSuspiciousIndicatorsOutputSchema>;

export async function highlightSuspiciousIndicators(
  input: HighlightSuspiciousIndicatorsInput
): Promise<HighlightSuspiciousIndicatorsOutput> {
  return highlightSuspiciousIndicatorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'highlightSuspiciousIndicatorsPrompt',
  input: {schema: HighlightSuspiciousIndicatorsInputSchema},
  output: {schema: HighlightSuspiciousIndicatorsOutputSchema},
  prompt: `You are an AI assistant designed to identify and highlight potential misinformation in text content.

  Analyze the following content and identify any phrases or links that are indicators of misinformation. These indicators can include:

  - Exaggerated claims or sensationalism
  - Use of emotionally charged language
  - Claims that contradict established facts
  - Suspicious links or sources
  - Information that lacks credible evidence

  Highlight the suspicious indicators in the content by surrounding them with markdown bold markers, like this: **suspicious phrase**.
  Also extract a list of the indicators found.

  Content to analyze: {{{content}}}

  Ensure that the outputted highlightedContent contains the original content with indicators highlighted in markdown. Output the indicators to the indicators output field.
  If the content is free from suspicious indicators, return the content as is and return an empty list of indicators.
  `,
});

const highlightSuspiciousIndicatorsFlow = ai.defineFlow(
  {
    name: 'highlightSuspiciousIndicatorsFlow',
    inputSchema: HighlightSuspiciousIndicatorsInputSchema,
    outputSchema: HighlightSuspiciousIndicatorsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
