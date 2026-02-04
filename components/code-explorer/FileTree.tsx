'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Folder, File, Loader2, FolderOpen } from 'lucide-react';
import { ScrollArea } from '@/components/shared/ui/scroll-area';
import { Button } from '@/components/shared/ui/button';
import { cn } from '@/lib/utils';

interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size?: number;
}

interface FileTreeProps {
  onFileSelect: (path: string) => void;
  selectedPath: string | null;
}

interface TreeNodeProps {
  item: FileItem;
  level: number;
  onFileSelect: (path: string) => void;
  selectedPath: string | null;
}

function TreeNode({ item, level, onFileSelect, selectedPath }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [children, setChildren] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const isSelected = selectedPath === item.path;

  async function loadChildren() {
    if (item.type !== 'dir') return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/code-explorer/browse?path=${encodeURIComponent(item.path)}`);
      if (!response.ok) {
        throw new Error('Failed to load directory');
      }
      const data = await response.json();
      setChildren(data.items || []);
      setIsExpanded(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load directory';
      setError(errorMessage);
      console.error('Error loading children:', err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleClick() {
    if (item.type === 'dir') {
      if (isExpanded) {
        setIsExpanded(false);
      } else {
        loadChildren();
      }
    } else {
      onFileSelect(item.path);
    }
  }

  return (
    <div>
      <Button
        variant="ghost"
        className={cn(
          'w-full justify-start gap-1 px-2 py-1 h-auto font-normal hover:bg-accent',
          isSelected && 'bg-accent/50 font-medium',
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleClick}
      >
        {item.type === 'dir' && (
          <>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin shrink-0" />
            ) : isExpanded ? (
              <ChevronDown className="h-4 w-4 shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 shrink-0" />
            )}
            {isExpanded ? (
              <FolderOpen className="h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
            ) : (
              <Folder className="h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
            )}
          </>
        )}
        {item.type === 'file' && (
          <>
            <span className="w-4" /> {/* Spacer for alignment */}
            <File className="h-4 w-4 shrink-0 text-muted-foreground" />
          </>
        )}
        <span className="truncate text-sm">{item.name}</span>
      </Button>

      {error && (
        <div className="text-xs text-destructive px-2 py-1" style={{ paddingLeft: `${(level + 1) * 16 + 8}px` }}>
          {error}
        </div>
      )}

      {isExpanded && children.length > 0 && (
        <div>
          {children.map((child) => (
            <TreeNode
              key={child.path}
              item={child}
              level={level + 1}
              onFileSelect={onFileSelect}
              selectedPath={selectedPath}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileTree({ onFileSelect, selectedPath }: FileTreeProps) {
  const [rootItems, setRootItems] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadRootDirectory();
  }, []);

  async function loadRootDirectory() {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/code-explorer/browse?path=');
      if (!response.ok) {
        throw new Error('Failed to load root directory');
      }
      const data = await response.json();
      setRootItems(data.items || []);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load root directory';
      setError(errorMessage);
      console.error('Error loading root:', err);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
          <p className="text-sm text-muted-foreground">Loading repository...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <div className="text-center">
          <p className="text-sm text-destructive mb-2">Failed to load repository</p>
          <Button size="sm" onClick={loadRootDirectory}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-2">
        <div className="mb-2 px-2">
          <h3 className="text-sm font-semibold text-muted-foreground">Repository Files</h3>
        </div>
        {rootItems.map((item) => (
          <TreeNode
            key={item.path}
            item={item}
            level={0}
            onFileSelect={onFileSelect}
            selectedPath={selectedPath}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
