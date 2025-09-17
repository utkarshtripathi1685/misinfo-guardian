'use server';

/**
 * @fileOverview Verifies a given claim using a simulated web search.
 *
 * - factCheck - A function that takes a claim and returns verification status and evidence.
 * - FactCheckInput - The input type for the factCheck function.
 * - FactCheckOutput - The return type for the factCheck function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { liveWebSearch } from './live-search-flow';
import type { LiveSearchInput, LiveSearchOutput } from './live-search-flow';

const FactCheckInputSchema = z.object({
  claim: z.string().describe('The claim to be fact-checked.'),
});
export type FactCheckInput = z.infer<typeof FactCheckInputSchema>;

const SourceSchema = z.object({
    title: z.string().describe('The title of the source article.'),
    url: z.string().url().describe('The URL of the source.'),
    snippet: z.string().describe('A relevant snippet from the source.'),
});

const FactCheckOutputSchema = z.object({
    status: z.enum(['Confirmed', 'Denied', 'No Consensus']).describe('The verification status of the claim.'),
    summary: z.string().describe('A brief summary of the findings.'),
    sources: z.array(SourceSchema).describe('A list of credible sources found.'),
});
export type FactCheckOutput = z.infer<typeof FactCheckOutputSchema>;

export async function factCheck(input: FactCheckInput): Promise<FactCheckOutput> {
  return factCheckFlow(input);
}

const factCheckPrompt = ai.definePrompt({
    name: 'factCheckPrompt',
    input: { schema: FactCheckInputSchema },
    output: { schema: FactCheckOutputSchema },
    tools: [liveWebSearch],
    prompt: `You are a meticulous fact-checker. Your task is to verify the following claim using the provided web search tool.

    Claim: "{{claim}}"

    1. Use the liveWebSearch tool to find at least 3 credible, neutral sources (like fact-checking organizations, major news outlets, or scientific journals).
    2. Analyze the search results to determine if the claim is Confirmed, Denied, or if there is No Consensus.
    3. Provide a concise summary of your findings.
    4. List the sources you used for verification.

    Do not use your own knowledge; rely only on the information provided by the search tool. You must use the tool.
    `,
});

const factCheckFlow = ai.defineFlow(
  {
    name: 'factCheckFlow',
    inputSchema: FactCheckInputSchema,
    outputSchema: FactCheckOutputSchema,
  },
  async (input) => {
    const { output } = await factCheckPrompt(input);
    return output!;
  }
);
