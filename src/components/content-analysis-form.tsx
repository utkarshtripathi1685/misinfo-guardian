'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload, X, FileImage } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';

interface ContentAnalysisFormProps {
  onTextSubmit: (content: string) => void;
  onImageSubmit: (photoDataUri: string) => void;
  isLoading: boolean;
  initialContent: string;
}

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function ContentAnalysisForm({ onTextSubmit, onImageSubmit, isLoading, initialContent }: ContentAnalysisFormProps) {
  const [activeTab, setActiveTab] = useState('text');
  const [textContent, setTextContent] = useState(initialContent);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setTextContent(initialContent);
  }, [initialContent]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast({
          variant: 'destructive',
          title: 'File Too Large',
          description: `Please select an image smaller than ${MAX_FILE_SIZE_MB}MB.`,
        });
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setImageDataUri(loadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const clearImage = () => {
    setImageFile(null);
    setImageDataUri(null);
    if(fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (activeTab === 'text') {
      onTextSubmit(textContent);
    } else if (activeTab === 'image' && imageDataUri) {
      onImageSubmit(imageDataUri);
    }
  };
  
  const canSubmit = !isLoading && (
    (activeTab === 'text' && textContent.trim()) || 
    (activeTab === 'image' && imageFile)
  );

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Start Your Analysis</CardTitle>
        <CardDescription>
          Enter content below. This can be text, a URL, or an image.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text" disabled={isLoading}>Paste Text</TabsTrigger>
            <TabsTrigger value="image" disabled={isLoading}>Upload Image</TabsTrigger>
          </TabsList>
          <form onSubmit={handleSubmit}>
            <TabsContent value="text" className="mt-4">
              <Textarea
                placeholder="Type or paste your content here..."
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={8}
                disabled={isLoading}
                className="text-base"
              />
            </TabsContent>
            <TabsContent value="image" className="mt-4">
              {imageFile && imageDataUri ? (
                <div className="relative w-full h-40 rounded-lg overflow-hidden border">
                  <img src={imageDataUri} alt={imageFile.name} className="w-full h-full object-contain" />
                  <div className="absolute top-2 right-2 flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                      <FileImage className="w-3 h-3"/>
                      <span>{(imageFile.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="h-7 w-7"
                      onClick={clearImage}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4"/>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="dropzone-file" className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-secondary/50 ${!isLoading ? 'hover:bg-secondary/80' : ''}`}>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG (MAX. 5MB)</p>
                      </div>
                      <Input ref={fileInputRef} id="dropzone-file" type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleFileChange} disabled={isLoading}/>
                  </label>
                </div> 
              )}
            </TabsContent>

            <Button type="submit" disabled={!canSubmit} size="lg" className="w-full mt-4">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Content'
              )}
            </Button>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  );
}
