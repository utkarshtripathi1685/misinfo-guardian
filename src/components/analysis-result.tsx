'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, BookOpen, FileCheck2, Lightbulb, ThumbsDown } from 'lucide-react';
import { CircularProgress } from './circular-progress';
import { LearnContent } from './learn-content';
import { FactCheckPanel } from './fact-check-panel';
import type { AnalysisState } from '@/types';

interface AnalysisResultProps {
  state: AnalysisState;
}

function highlightText(originalText: string, indicators: string[]) {
  if (!indicators || indicators.length === 0) {
    return originalText;
  }
  let highlighted = originalText;
  const uniqueIndicators = [...new Set(indicators)];
  
  uniqueIndicators.forEach(indicator => {
    const escapedIndicator = indicator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedIndicator})`, 'gi');
    highlighted = highlighted.replace(regex, `<strong class="bg-primary/20 dark:bg-primary/30 px-1 py-0.5 rounded-md">\$1</strong>`);
  });
  return highlighted;
}

export function AnalysisResult({ state }: AnalysisResultProps) {
  const { isLoading, error, data } = state;

  return (
    <Tabs defaultValue="assessment" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="assessment">
          <FileCheck2 className="mr-2 h-4 w-4" /> Assessment
        </TabsTrigger>
        <TabsTrigger value="evidence" disabled={!data}>
          <Lightbulb className="mr-2 h-4 w-4" /> Evidence
        </TabsTrigger>
        <TabsTrigger value="learn">
          <BookOpen className="mr-2 h-4 w-4" /> Learn
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="assessment">
        <AssessmentPanel state={state} />
      </TabsContent>

      <TabsContent value="evidence">
        {data && <EvidencePanel data={data} />}
      </TabsContent>
      
      <TabsContent value="learn">
        <LearnPanel />
      </TabsContent>
    </Tabs>
  );
}

function AssessmentPanel({ state }: { state: AnalysisState }) {
  if (state.isLoading) {
    return <AssessmentPanelSkeleton />;
  }

  if (state.error) {
    return (
      <Card className="mt-4 shadow-lg">
        <CardHeader>
          <CardTitle>Analysis Error</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!state.data) {
    return (
      <Card className="mt-4 shadow-lg text-center">
        <CardHeader>
          <CardTitle>Ready to Analyze</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Submit some content on the left to see the analysis report here.</p>
        </CardContent>
      </Card>
    );
  }

  const { credibilityScore } = state.data;
  const score = Math.round(credibilityScore * 100);

  const getScoreDescription = (s: number) => {
    if (s >= 80) return { text: 'High Credibility', color: 'text-green-600 dark:text-green-400' };
    if (s >= 60) return { text: 'Likely Credible', color: 'text-sky-600 dark:text-sky-400' };
    if (s >= 40) return { text: 'Potentially Misleading', color: 'text-amber-600 dark:text-amber-400' };
    return { text: 'Low Credibility', color: 'text-red-600 dark:text-red-400' };
  };
  
  const scoreInfo = getScoreDescription(score);

  return (
    <Card className="mt-4 shadow-lg animate-in fade-in-0 duration-500">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Assessment Report</CardTitle>
        <CardDescription>An AI-powered analysis of the submitted content.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center bg-secondary/50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Credibility Score</h3>
          <CircularProgress value={score} />
          <p className={`mt-4 text-xl font-bold ${scoreInfo.color}`}>{scoreInfo.text}</p>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button variant="outline">
          <ThumbsDown className="mr-2 h-4 w-4" />
          Report Incorrect Analysis
        </Button>
      </CardFooter>
    </Card>
  );
}

function EvidencePanel({ data }: { data: AnalysisResult['data'] }) {
  const { suspiciousIndicators, explanation, originalContent } = data;
  const highlightedContent = highlightText(originalContent, suspiciousIndicators);

  return (
    <Card className="mt-4 shadow-lg animate-in fade-in-0 duration-500">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Evidence Breakdown</CardTitle>
        <CardDescription>See what the AI found in the content.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="highlighted" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="highlighted">Highlighted Content</TabsTrigger>
              <TabsTrigger value="findings">Key Findings</TabsTrigger>
              <TabsTrigger value="fact-check">Fact Check</TabsTrigger>
            </TabsList>
            <TabsContent value="highlighted" className="mt-4 border p-4 rounded-md min-h-[200px] bg-background">
               <div
                  className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: highlightedContent }}
                />
            </TabsContent>
            <TabsContent value="findings" className="mt-4">
              <Accordion type="single" collapsible defaultValue="indicators">
                <AccordionItem value="indicators">
                  <AccordionTrigger className="text-base font-semibold">
                    <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                    Suspicious Indicators
                  </AccordionTrigger>
                  <AccordionContent>
                    {suspiciousIndicators.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                        {suspiciousIndicators.map((item, index) => <li key={index}>{item}</li>)}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">No specific suspicious indicators were found.</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="explanation">
                  <AccordionTrigger className="text-base font-semibold">
                    <Lightbulb className="h-5 w-5 mr-2 text-sky-500" />
                    AI-Generated Explanation
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3">
                    <p>{explanation}</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
            <TabsContent value="fact-check" className="mt-4">
              <FactCheckPanel claims={suspiciousIndicators} />
            </TabsContent>
          </Tabs>
      </CardContent>
    </Card>
  );
}

function LearnPanel() {
  return (
    <Card className="mt-4 shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Learn About Misinformation</CardTitle>
        <CardDescription>Sharpen your skills to spot false information online.</CardDescription>
      </CardHeader>
      <CardContent>
        <LearnContent />
      </CardContent>
    </Card>
  );
}

function AssessmentPanelSkeleton() {
  return (
    <Card className="mt-4 shadow-lg">
      <CardHeader>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center bg-secondary/50 p-6 rounded-lg">
          <Skeleton className="h-6 w-36 mb-4" />
          <Skeleton className="h-36 w-36 rounded-full" />
          <Skeleton className="h-7 w-40 mt-4" />
        </div>
      </CardContent>
       <CardFooter className="justify-end">
        <Skeleton className="h-10 w-48" />
      </CardFooter>
    </Card>
  );
}

type AnalysisResult = NonNullable<AnalysisState['data']>;
