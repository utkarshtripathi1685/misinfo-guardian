import type { AnalyzeSubmittedContentOutput } from "@/ai/flows/analyze-submitted-content";
import type { FactCheckOutput } from "@/ai/flows/fact-check-flow";

export type AnalysisResult = AnalyzeSubmittedContentOutput & {
  originalContent: string;
};

export type AnalysisState = {
  data: AnalysisResult | null;
  error: string | null;
  isLoading: boolean;
};

export type AnalysisInputType = 'text' | 'image';

export type FactCheckResult = FactCheckOutput;
