'use server';
/**
 * @fileOverview Provides a credibility score for the content.
 *
 * - displayCredibilityScore - A function that handles the credibility scoring process.
 * - DisplayCredibilityScoreInput - The input type for the displayCredibilityScore function.
 * - DisplayCredibilityScoreOutput - The return type for the displayCredibilityScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DisplayCredibilityScoreInputSchema = z.object({
  content: z.string().describe('The content to be analyzed for credibility.'),
});
export type DisplayCredibilityScoreInput = z.infer<typeof DisplayCredibilityScoreInputSchema>;

const DisplayCredibilityScoreOutputSchema = z.object({
  credibilityScore: z
    .number()
    .describe(
      'A score between 0 and 1 indicating the credibility of the content, where 0 is completely untrustworthy and 1 is highly trustworthy.'
    ),
  explanation: z.string().describe('An explanation of why the content received the given credibility score.'),
});
export type DisplayCredibilityScoreOutput = z.infer<typeof DisplayCredibilityScoreOutputSchema>;

export async function displayCredibilityScore(input: DisplayCredibilityScoreInput): Promise<DisplayCredibilityScoreOutput> {
  return displayCredibilityScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'displayCredibilityScorePrompt',
  input: {schema: DisplayCredibilityScoreInputSchema},
  output: {schema: DisplayCredibilityScoreOutputSchema},
  prompt: `You are an AI assistant designed to assess the credibility of user-provided content.

  Analyze the following content and provide a credibility score between 0 and 1, where 0 is completely untrustworthy and 1 is highly trustworthy. Also, provide a brief explanation of why you assigned that score.

  Content: {{{content}}}`,
});

const displayCredibilityScoreFlow = ai.defineFlow(
  {
    name: 'displayCredibilityScoreFlow',
    inputSchema: DisplayCredibilityScoreInputSchema,
    outputSchema: DisplayCredibilityScoreOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
