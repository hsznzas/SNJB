'use client';

import React from 'react';
import { Slider } from '@/components/shared/ui/slider';
import { getProgressStatus, formatProgress } from '@/lib/contract-utils';
import { cn } from '@/lib/utils';

interface ProgressSliderProps {
  progress: number;
  onChange: (value: number) => void;
  label?: string;
  disabled?: boolean;
  showPercentage?: boolean;
}

export function ProgressSlider({
  progress,
  onChange,
  label,
  disabled = false,
  showPercentage = true,
}: ProgressSliderProps) {
  const { status, color } = getProgressStatus(progress);

  const handleChange = (values: number[]) => {
    onChange(values[0]);
  };

  return (
    <div className="flex items-center gap-3">
      {label && (
        <span className="text-sm font-medium text-muted-foreground min-w-[80px]">
          {label}
        </span>
      )}
      
      <div className="flex-1 flex items-center gap-3">
        <Slider
          value={[progress]}
          onValueChange={handleChange}
          max={100}
          step={1}
          disabled={disabled}
          className={cn(
            'flex-1',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />
        
        {showPercentage && (
          <span
            className={cn(
              'text-sm font-semibold min-w-[45px] text-right',
              color
            )}
          >
            {formatProgress(progress)}
          </span>
        )}
      </div>
    </div>
  );
}
