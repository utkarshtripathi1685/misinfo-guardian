'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { factCheckAction } from '@/app/actions';
import type { FactCheckResult } from '@/types';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Loader2, ExternalLink, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface FactCheckPanelProps {
  claims: string[];
}

export function FactCheckPanel({ claims }: FactCheckPanelProps) {
  const [selectedClaim, setSelectedClaim] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FactCheckResult | null>(null);

  const handleFactCheck = async (claim: string) => {
    setSelectedClaim(claim);
    setIsLoading(true);
    setError(null);
    setResult(null);

    const response = await factCheckAction(claim);
    if (response.error) {
      setError(response.error);
    } else {
      setResult(response.data || null);
    }
    setIsLoading(false);
  };
  
  if (claims.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-4">
        <p>No specific claims were identified in the text to fact-check.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-2">Select a claim to verify:</h4>
        <div className="flex flex-col gap-2">
          {claims.map((claim, index) => (
            <Button
              key={index}
              variant="outline"
              className="text-left h-auto whitespace-normal"
              onClick={() => handleFactCheck(claim)}
              disabled={isLoading}
            >
              {claim}
            </Button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4 text-muted-foreground">Searching for evidence...</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Fact-Check Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && selectedClaim && (
         <Card className="animate-in fade-in-0 duration-500">
            <CardHeader>
                <CardTitle className="text-xl">Fact-Check Result for: "{selectedClaim}"</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <VerificationStatus status={result.status} summary={result.summary} />

                <div>
                    <h5 className="font-semibold mb-2">Sources Found:</h5>
                    <div className="space-y-3">
                    {result.sources.length > 0 ? (
                        result.sources.map((source, index) => (
                        <div key={index} className="border p-3 rounded-md bg-secondary/30">
                            <a href={source.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline flex items-center">
                            {source.title}
                            <ExternalLink className="h-4 w-4 ml-2" />
                            </a>
                            <p className="text-sm text-muted-foreground mt-1 italic">"{source.snippet}"</p>
                        </div>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground">No credible sources were found by the AI.</p>
                    )}
                    </div>
                </div>
            </CardContent>
         </Card>
      )}
    </div>
  );
}


function VerificationStatus({ status, summary }: { status: FactCheckResult['status'], summary: string }) {
    const getStatusInfo = () => {
        switch (status) {
            case 'Confirmed':
                return {
                    icon: <CheckCircle className="h-5 w-5 text-green-500" />,
                    title: 'Claim Confirmed',
                    color: 'text-green-600 dark:text-green-400',
                };
            case 'Denied':
                return {
                    icon: <XCircle className="h-5 w-5 text-red-500" />,
                    title: 'Claim Denied',
                    color: 'text-red-600 dark:text-red-400',
                };
            case 'No Consensus':
                return {
                    icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
                    title: 'No Consensus',
                    color: 'text-amber-600 dark:text-amber-400',
                };
            default:
                return {
                    icon: <AlertCircle className="h-5 w-5 text-muted-foreground" />,
                    title: 'Unknown Status',
                    color: 'text-muted-foreground',
                };
        }
    };

    const { icon, title, color } = getStatusInfo();

    return (
        <Alert>
            <div className="flex items-center">
                {icon}
                <AlertTitle className={`ml-2 text-lg ${color}`}>{title}</AlertTitle>
            </div>
            <AlertDescription className="mt-2 text-base">
                {summary}
            </AlertDescription>
        </Alert>
    );
}
