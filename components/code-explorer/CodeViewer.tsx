'use client';

import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/shared/ui/scroll-area';
import { Skeleton } from '@/components/shared/ui/skeleton';
import { Alert, AlertDescription } from '@/components/shared/ui/alert';
import { Button } from '@/components/shared/ui/button';
import { FileCode, AlertCircle, Loader2 } from 'lucide-react';

interface CodeViewerProps {
  filePath: string | null;
}

export function CodeViewer({ filePath }: CodeViewerProps) {
  const [content, setContent] = useState<string>('');
  const [highlightedContent, setHighlightedContent] = useState<string>('');
  const [language, setLanguage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [truncated, setTruncated] = useState(false);
  const [isLoadingFull, setIsLoadingFull] = useState(false);

  useEffect(() => {
    if (filePath) {
      loadFile(filePath);
    } else {
      setContent('');
      setHighlightedContent('');
    }
  }, [filePath]);

  async function loadFile(path: string) {
    setIsLoading(true);
    setError('');
    setTruncated(false);

    try {
      const response = await fetch(`/api/code-explorer/view?path=${encodeURIComponent(path)}`);
      if (!response.ok) {
        throw new Error('Failed to load file');
      }
      const data = await response.json();
      setContent(data.content || '');
      setHighlightedContent(data.highlightedContent || data.content || '');
      setLanguage(data.language || 'plaintext');
      setTruncated(data.truncated || false);
    } catch (err: any) {
      setError(err.message);
      console.error('Error loading file:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadFullFile(path: string) {
    setIsLoadingFull(true);
    setError('');

    try {
      const response = await fetch(
        `/api/code-explorer/view?path=${encodeURIComponent(path)}&full=true`
      );
      if (!response.ok) {
        throw new Error('Failed to load full file');
      }
      const data = await response.json();
      setContent(data.content || '');
      setHighlightedContent(data.highlightedContent || data.content || '');
      setLanguage(data.language || 'plaintext');
      setTruncated(false); // Hide warning after loading full file
    } catch (err: any) {
      setError(err.message);
      console.error('Error loading full file:', err);
    } finally {
      setIsLoadingFull(false);
    }
  }

  // Empty state
  if (!filePath && !isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-muted p-4">
            <FileCode className="h-12 w-12 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">No File Selected</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Select a file from the tree on the left to view its contents
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Render code with line numbers
  const lines = highlightedContent.split('\n');

  return (
    <div className="h-full flex flex-col">
      {/* File header */}
      <div className="border-b bg-muted/50 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCode className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-mono">{filePath}</span>
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          {language.toUpperCase()}
        </span>
      </div>

      {truncated && (
        <div className="border-b bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              ⚠️ File truncated - Only first 50KB shown for performance
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => loadFullFile(filePath!)}
              disabled={isLoadingFull}
              className="ml-4"
            >
              {isLoadingFull ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load Full File'
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Code content */}
      <ScrollArea className="flex-1">
        <div className="font-mono text-sm">
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, index) => (
                <tr key={index} className="hover:bg-muted/50">
                  {/* Line number */}
                  <td className="select-none border-r bg-muted/30 px-4 py-0.5 text-right text-xs text-muted-foreground w-12">
                    {index + 1}
                  </td>
                  {/* Code content */}
                  <td className="px-4 py-0.5">
                    <pre className="whitespace-pre-wrap break-all">
                      <code dangerouslySetInnerHTML={{ __html: line || '\n' }} />
                    </pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ScrollArea>
    </div>
  );
}
