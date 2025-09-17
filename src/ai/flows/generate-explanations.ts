'use server';

/**
 * @fileOverview Explains why certain content might be misleading, educating users on manipulation tactics.
 *
 * - generateExplanations - A function that generates explanations for potentially misleading content.
 * - GenerateExplanationsInput - The input type for the generateExplanations function.
 * - GenerateExplanationsOutput - The return type for the generateExplanations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateExplanationsInputSchema = z.object({
  content: z.string().describe('The content to analyze for potential misinformation.'),
});
export type GenerateExplanationsInput = z.infer<typeof GenerateExplanationsInputSchema>;

const GenerateExplanationsOutputSchema = z.object({
  explanations: z.array(
    z.string().describe('Explanations detailing why certain content might be misleading.')
  ),
});
export type GenerateExplanationsOutput = z.infer<typeof GenerateExplanationsOutputSchema>;

export async function generateExplanations(input: GenerateExplanationsInput): Promise<GenerateExplanationsOutput> {
  return generateExplanationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateExplanationsPrompt',
  input: {schema: GenerateExplanationsInputSchema},
  output: {schema: GenerateExplanationsOutputSchema},
  prompt: `Analyze the following content and provide explanations detailing why it might be misleading. Educate users on manipulation tactics used in the content.

Content: {{{content}}}

Provide at least three distinct explanations.
`,
});

const generateExplanationsFlow = ai.defineFlow(
  {
    name: 'generateExplanationsFlow',
    inputSchema: GenerateExplanationsInputSchema,
    outputSchema: GenerateExplanationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
