'use client';

import React, { useState } from 'react';
import { useContract } from '@/lib/contract-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shared/ui/card';
import { Button } from '@/components/shared/ui/button';
import { Badge } from '@/components/shared/ui/badge';
import { Progress } from '@/components/shared/ui/progress';
import { Alert, AlertDescription } from '@/components/shared/ui/alert';
import {
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { getCompletionStats, getOverdueTasks, getUpcomingDeadlines, downloadJSON, formatProgress } from '@/lib/contract-utils';
import { Separator } from '@/components/shared/ui/separator';

export function ContractHeader() {
  const { contractData, calculateWeightedProgress, exportData, importData, resetData } = useContract();
  const [isExporting, setIsExporting] = useState(false);

  const overallProgress = calculateWeightedProgress();
  const stats = getCompletionStats(contractData.phases);
  const overdueTasks = getOverdueTasks(contractData.phases);
  const upcomingDeadlines = getUpcomingDeadlines(contractData.phases);

  const handleExport = () => {
    setIsExporting(true);
    try {
      const data = exportData();
      const timestamp = new Date().toISOString().split('T')[0];
      downloadJSON(data, `muhannad-contract-${timestamp}.json`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = event.target?.result as string;
            importData(data);
            alert('Contract data imported successfully!');
          } catch (error) {
            alert('Failed to import data. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all contract data? This cannot be undone.')) {
      resetData();
    }
  };

  const lastUpdated = new Date(contractData.lastUpdated).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="space-y-6">
      {/* Main Contract Info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">{contractData.contractTitle}</CardTitle>
              </div>
              <CardDescription>
                <span className="font-semibold">{contractData.party1}</span>
                {' ↔ '}
                <span className="font-semibold">{contractData.party2}</span>
              </CardDescription>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={handleImport}>
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Contract Progress</span>
              <span className="text-2xl font-bold text-primary">{formatProgress(overallProgress)}</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
          </div>

          <Separator />

          {/* Phase Progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contractData.phases.map((phase) => (
              <div key={phase.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{phase.title}</span>
                  <Badge variant="outline">{phase.weight}% weight</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={phase.progress} className="flex-1" />
                  <span className="text-sm font-semibold min-w-[45px] text-right">
                    {formatProgress(phase.progress)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="text-2xl font-bold">{stats.completedTasks}</div>
              <div className="text-xs text-muted-foreground">Completed Tasks</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold">{stats.inProgressTasks}</div>
              <div className="text-xs text-muted-foreground">In Progress</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold">{stats.notStartedTasks}</div>
              <div className="text-xs text-muted-foreground">Not Started</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold">{stats.totalTasks}</div>
              <div className="text-xs text-muted-foreground">Total Tasks</div>
            </div>
          </div>

          {/* Alerts */}
          {overdueTasks.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>{overdueTasks.length} overdue task{overdueTasks.length !== 1 ? 's' : ''}</strong>
                {' - '}
                Updates required every 2 days per contract terms
              </AlertDescription>
            </Alert>
          )}

          {upcomingDeadlines.length > 0 && overdueTasks.length === 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>{upcomingDeadlines.length} deadline{upcomingDeadlines.length !== 1 ? 's' : ''} approaching</strong>
                {' - '}
                within the next 7 days
              </AlertDescription>
            </Alert>
          )}

          {overdueTasks.length === 0 && upcomingDeadlines.length === 0 && stats.completedTasks > 0 && (
            <Alert className="bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-300">
                All tasks are on track! No overdue or urgent deadlines.
              </AlertDescription>
            </Alert>
          )}

          {/* Last Updated */}
          <div className="text-xs text-muted-foreground text-right">
            Last updated: {lastUpdated}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
