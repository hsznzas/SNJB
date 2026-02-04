'use client';

import { useState } from 'react';
import { PasswordGuard } from '@/components/code-explorer/PasswordGuard';
import { ProtectionWrapper } from '@/components/code-explorer/ProtectionWrapper';
import { FileTree } from '@/components/code-explorer/FileTree';
import { CodeViewer } from '@/components/code-explorer/CodeViewer';
import { SearchBar } from '@/components/code-explorer/SearchBar';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/shared/ui/resizable';
import { Code2, Github } from 'lucide-react';

export default function CodeExplorerPage() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [sessionId] = useState(() => `viewer_${Date.now()}`);

  function handleFileSelect(path: string) {
    setSelectedFile(path);
  }

  return (
    <PasswordGuard>
      <ProtectionWrapper sessionId={sessionId}>
        <div className="h-screen flex flex-col bg-background">
          {/* Header */}
          <header className="border-b bg-card px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary-100 dark:bg-primary-900 p-2">
                  <Code2 className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Code Explorer</h1>
                  <p className="text-sm text-muted-foreground">
                    View-only repository browser
                  </p>
                </div>
              </div>
              <SearchBar onFileSelect={handleFileSelect} />
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            <ResizablePanelGroup direction="horizontal">
              {/* File Tree Sidebar */}
              <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
                <div className="h-full border-r bg-card">
                  <div className="border-b px-4 py-2 bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Github className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Files</span>
                    </div>
                  </div>
                  <FileTree
                    onFileSelect={handleFileSelect}
                    selectedPath={selectedFile}
                  />
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle />

              {/* Code Viewer */}
              <ResizablePanel defaultSize={75}>
                <div className="h-full bg-background">
                  <CodeViewer filePath={selectedFile} />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>

          {/* Footer */}
          <footer className="border-t bg-card px-6 py-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div>
                Protected repository viewer • All access is logged
              </div>
              <div>
                Session: <span className="font-mono">{sessionId}</span>
              </div>
            </div>
          </footer>
        </div>
      </ProtectionWrapper>
    </PasswordGuard>
  );
}
