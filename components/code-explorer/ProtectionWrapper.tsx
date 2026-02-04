'use client';

import { useEffect, useRef } from 'react';
import { Watermark } from './Watermark';

interface ProtectionWrapperProps {
  children: React.ReactNode;
  sessionId: string;
}

export function ProtectionWrapper({ children, sessionId }: ProtectionWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // Prevent right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Prevent keyboard shortcuts for copy/save/select
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + C (copy)
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        return false;
      }
      // Ctrl/Cmd + S (save)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        return false;
      }
      // Ctrl/Cmd + A (select all)
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        return false;
      }
      // Ctrl/Cmd + P (print)
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        return false;
      }
      // F12 (dev tools) - try to discourage
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
    };

    // Prevent text selection
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Prevent drag
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Add event listeners
    wrapper.addEventListener('contextmenu', handleContextMenu);
    wrapper.addEventListener('keydown', handleKeyDown);
    wrapper.addEventListener('selectstart', handleSelectStart);
    wrapper.addEventListener('dragstart', handleDragStart);

    // Cleanup
    return () => {
      wrapper.removeEventListener('contextmenu', handleContextMenu);
      wrapper.removeEventListener('keydown', handleKeyDown);
      wrapper.removeEventListener('selectstart', handleSelectStart);
      wrapper.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative"
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
      }}
    >
      {children}
      <Watermark sessionId={sessionId} />
    </div>
  );
}
