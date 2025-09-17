'use server';

/**
 * @fileOverview Analyzes user-submitted content for potential misinformation.
 *
 * - analyzeSubmittedContent - Analyzes the submitted text or URL for misinformation.
 * - AnalyzeSubmittedContentInput - The input type for the analyzeSubmittedContent function.
 * - AnalyzeSubmittedContentOutput - The return type for the analyzeSubmittedContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSubmittedContentInputSchema = z.object({
  content: z.string().describe('The text or URL content to analyze.'),
});
export type AnalyzeSubmittedContentInput = z.infer<typeof AnalyzeSubmittedContentInputSchema>;

const AnalyzeSubmittedContentOutputSchema = z.object({
  credibilityScore: z
    .number()
    .describe(
      'An overall credibility score for the content, indicating its likelihood of being misleading (0-1, 1 being highly credible).' /* @ts-ignore */
    ),
  suspiciousIndicators: z
    .array(z.string())
    .describe('Specific phrases or claims within the content that are indicators of misinformation or require fact-checking.'),
  explanation: z.string().describe('An explanation detailing why certain content might be misleading, and which parts are plausible.'),
});
export type AnalyzeSubmittedContentOutput = z.infer<typeof AnalyzeSubmittedContentOutputSchema>;

export async function analyzeSubmittedContent(
  input: AnalyzeSubmittedContentInput
): Promise<AnalyzeSubmittedContentOutput> {
  return analyzeSubmittedContentFlow(input);
}

const analyzeSubmittedContentPrompt = ai.definePrompt({
  name: 'analyzeSubmittedContentPrompt',
  input: {schema: AnalyzeSubmittedContentInputSchema},
  output: {schema: AnalyzeSubmittedContentOutputSchema},
  prompt: `You are an expert AI fact-checker. Your task is to analyze content for potential misinformation with nuance and precision.

  Analyze the following content. Your analysis should follow these steps:
  1.  **Assess General Plausibility:** Read the entire text and evaluate if the general claims are scientifically, logically, and internally consistent. For example, a description of a real-world phenomenon (like a lunar eclipse) should be treated as plausible if described correctly.
  2.  **Isolate Verifiable Claims:** Identify specific, concrete claims that can be fact-checked. These are usually dates, times, statistics, names, and specific event details.
  3.  **Assign a Credibility Score:** Base your score on the overall plausibility. A text that is well-written and scientifically accurate should receive a high score (e.g., above 0.75), even if specific details are unverified. A low score should be reserved for content that is logically inconsistent, uses sensationalist language, promotes conspiracy theories, or makes obviously false scientific claims.
  4.  **Identify Suspicious Indicators:** List the specific, verifiable claims you isolated in step 2. These are not necessarily "suspicious" in a negative sense, but rather points that require external verification. Also, list any genuinely suspicious language (e.g., "Big Pharma is hiding this!").
  5.  **Generate an Explanation:** Explain your reasoning. Start by acknowledging what is plausible or factually correct in the text. Then, explain which specific details require verification.

  Content to Analyze:
  {{{content}}}

  Apply this reasoning to generate the output. For a news-like article about a celestial event, if the science is sound, the score should be high, and the indicators should be the specific date/time claims.
  `,
});

const analyzeSubmittedContentFlow = ai.defineFlow(
  {
    name: 'analyzeSubmittedContentFlow',
    inputSchema: AnalyzeSubmittedContentInputSchema,
    outputSchema: AnalyzeSubmittedContentOutputSchema,
  },
  async input => {
    const {output} = await analyzeSubmittedContentPrompt(input);
    return output!;
  }
);
