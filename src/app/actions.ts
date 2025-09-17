'use server';

import { analyzeSubmittedContent } from '@/ai/flows/analyze-submitted-content';
import { analyzeImageContent } from '@/ai/flows/analyze-image-content';
import { factCheck } from '@/ai/flows/fact-check-flow';
import type { AnalysisResult, FactCheckResult } from '@/types';

export async function analyzeContentAction(
  content: string
): Promise<{ data?: AnalysisResult; error?: string }> {
  try {
    const analysis = await analyzeSubmittedContent({ content });

    if (!analysis) {
      return { error: 'The AI analysis returned no result. Please try again.' };
    }
    
    // Ensure credibilityScore is within 0-1 range.
    analysis.credibilityScore = Math.max(0, Math.min(1, analysis.credibilityScore));

    const result: AnalysisResult = {
      ...analysis,
      originalContent: content,
    };

    return { data: result };
  } catch (error) {
    console.error('Error in analyzeContentAction:', error);
    // Return a generic error message to the user for security.
    return { error: 'An error occurred during analysis. The AI model may be unavailable.' };
  }
}

export async function analyzeImageAction(
  photoDataUri: string
): Promise<{ data?: AnalysisResult; error?: string }> {
  try {
    const analysis = await analyzeImageContent({ photoDataUri });

    if (!analysis) {
      return { error: 'The AI analysis returned no result. Please try again.' };
    }
    
    analysis.credibilityScore = Math.max(0, Math.min(1, analysis.credibilityScore));

    const result: AnalysisResult = {
      ...analysis,
      originalContent: `Image analysis results:\n\n${(analysis as any).text || ''}`, // The extracted text is now part of the result
    };

    return { data: result };
  } catch (error) {
    console.error('Error in analyzeImageAction:', error);
    return { error: 'An error occurred during image analysis. Please try again.' };
  }
}

export async function factCheckAction(
  claim: string
): Promise<{ data?: FactCheckResult; error?: string }> {
  try {
    const result = await factCheck({ claim });
    if (!result) {
      return { error: 'The fact-check returned no result. Please try again.' };
    }
    return { data: result };
  } catch (error) {
    console.error('Error in factCheckAction:', error);
    return { error: 'An error occurred during the fact-check.' };
  }
}
