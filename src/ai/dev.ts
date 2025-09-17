import { config } from 'dotenv';
config();

import '@/ai/flows/highlight-suspicious-indicators.ts';
import '@/ai/flows/analyze-submitted-content.ts';
import '@/ai/flows/analyze-image-content.ts';
import '@/ai/flows/generate-explanations.ts';
import '@/ai/flows/display-credibility-score.ts';
import '@/ai/flows/fact-check-flow.ts';
// Note: live-search-flow is imported by fact-check-flow, so it's not needed here.
