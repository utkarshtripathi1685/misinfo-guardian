'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ContentAnalysisForm } from '@/components/content-analysis-form';
import { AnalysisResult } from '@/components/analysis-result';
import { analyzeContentAction, analyzeImageAction } from '@/app/actions';
import type { AnalysisState } from '@/types';

export default function Home() {
  const { toast } = useToast();
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    data: null,
    error: null,
    isLoading: false,
  });
  const [content, setContent] = useState('');

  const handleAnalyzeText = async (newContent: string) => {
    if (!newContent.trim()) {
      toast({
        variant: 'destructive',
        title: 'Input Required',
        description: 'Please enter text or a URL to analyze.',
      });
      return;
    }

    setContent(newContent);
    setAnalysisState({ data: null, error: null, isLoading: true });

    try {
      const result = await analyzeContentAction(newContent);
      if (result.error) {
        setAnalysisState({ data: null, error: result.error, isLoading: false });
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: result.error,
        });
      } else if (result.data) {
        setAnalysisState({ data: result.data, error: null, isLoading: false });
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setAnalysisState({ data: null, error: errorMessage, isLoading: false });
      toast({
        variant: 'destructive',
        title: 'An Unexpected Error Occurred',
        description: 'Please try again later.',
      });
    }
  };
  
  const handleAnalyzeImage = async (photoDataUri: string) => {
    if (!photoDataUri) {
      toast({
        variant: 'destructive',
        title: 'Input Required',
        description: 'Please upload an image to analyze.',
      });
      return;
    }
    
    setContent(''); // Clear text content when analyzing an image
    setAnalysisState({ data: null, error: null, isLoading: true });
    
    try {
      const result = await analyzeImageAction(photoDataUri);
      if (result.error) {
        setAnalysisState({ data: null, error: result.error, isLoading: false });
        toast({
          variant: 'destructive',
          title: 'Image Analysis Failed',
          description: result.error,
        });
      } else if (result.data) {
        // The originalContent will be updated with the extracted text from the action
        setAnalysisState({ data: result.data, error: null, isLoading: false });
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setAnalysisState({ data: null, error: errorMessage, isLoading: false });
      toast({
        variant: 'destructive',
        title: 'An Unexpected Error Occurred',
        description: 'Please try again later.',
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
              <div className="max-w-3xl mx-auto text-left">
                <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-foreground">
                  Verity AI
                </h1>
                <p className="mt-4 text-lg md:text-xl text-muted-foreground">
                  Analyze content to uncover potential misinformation and understand manipulation tactics.
                </p>
              </div>
              <div className="mt-8">
                <ContentAnalysisForm 
                  onTextSubmit={handleAnalyzeText} 
                  onImageSubmit={handleAnalyzeImage}
                  isLoading={analysisState.isLoading} 
                  initialContent={content} 
                />
              </div>
            </div>
            <div className="lg:col-span-8">
               <AnalysisResult state={analysisState} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
