'use client';

import React from 'react';
import { Badge } from '@/components/shared/ui/badge';
import { getDeadlineStatus, formatDate } from '@/lib/contract-utils';
import { Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeadlineTrackerProps {
  deadline?: string;
  compact?: boolean;
  showIcon?: boolean;
}

export function DeadlineTracker({
  deadline,
  compact = false,
  showIcon = true,
}: DeadlineTrackerProps) {
  const { status, color, text, bgColor } = getDeadlineStatus(deadline);

  if (status === 'none') {
    return (
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        {showIcon && <Calendar className="h-4 w-4" />}
        <span>No deadline</span>
      </div>
    );
  }

  const Icon = status === 'overdue' || status === 'danger' ? Clock : Calendar;

  if (compact) {
    return (
      <Badge variant="outline" className={cn(bgColor, color, 'font-medium')}>
        {showIcon && <Icon className="h-3 w-3 mr-1" />}
        {text}
      </Badge>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        {showIcon && <Icon className={cn('h-4 w-4', color)} />}
        <span className={cn('text-sm font-medium', color)}>{text}</span>
      </div>
      <div className="text-xs text-muted-foreground pl-6">
        Due: {formatDate(deadline)}
      </div>
    </div>
  );
}
