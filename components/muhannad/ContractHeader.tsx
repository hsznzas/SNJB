'use client';

import React, { useState } from 'react';
import { useContract } from '@/lib/contract-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shared/ui/card';
import { Button } from '@/components/shared/ui/button';
import { Badge } from '@/components/shared/ui/badge';
import { Progress } from '@/components/shared/ui/progress';
import { Alert, AlertDescription } from '@/components/shared/ui/alert';
import { Switch } from '@/components/shared/ui/switch';
import { Label } from '@/components/shared/ui/label';
import {
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  FileText,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { getCompletionStats, getOverdueTasks, getUpcomingDeadlines, downloadJSON, formatProgress } from '@/lib/contract-utils';
import { Separator } from '@/components/shared/ui/separator';

export function ContractHeader() {
  const {
    contractData,
    calculateWeightedProgress,
    exportData,
    importData,
    resetData,
    toggleProgressBars,
    toggleDeadlines,
  } = useContract();
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
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <CardTitle className="text-2xl font-bold tracking-tight">{contractData.contractTitle}</CardTitle>
                </div>
                <CardDescription className="text-base">
                  <span className="font-bold text-foreground">{contractData.party1}</span>
                  <span className="mx-2 text-muted-foreground">↔</span>
                  <span className="font-bold text-foreground">{contractData.party2}</span>
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

            {/* Toggle Controls */}
            <div className="flex gap-6 p-3 bg-muted/50 rounded-lg border">
              <div className="flex items-center gap-3">
                <Switch
                  id="show-progress"
                  checked={contractData.showProgressBars}
                  onCheckedChange={toggleProgressBars}
                />
                <Label htmlFor="show-progress" className="flex items-center gap-2 cursor-pointer font-medium">
                  <BarChart3 className="h-4 w-4" />
                  Progress Bars
                </Label>
              </div>
              
              <Separator orientation="vertical" className="h-6" />
              
              <div className="flex items-center gap-3">
                <Switch
                  id="show-deadlines"
                  checked={contractData.showDeadlines}
                  onCheckedChange={toggleDeadlines}
                />
                <Label htmlFor="show-deadlines" className="flex items-center gap-2 cursor-pointer font-medium">
                  <Calendar className="h-4 w-4" />
                  Due Dates
                </Label>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold">Overall Contract Progress</span>
              <span className="text-2xl font-bold">{formatProgress(overallProgress)}</span>
            </div>
            <Progress value={overallProgress} className="h-3 bg-muted" />
          </div>

          <Separator />

          {/* Phase Progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contractData.phases.map((phase, idx) => (
              <div key={phase.id} className="space-y-2 p-3 rounded-lg border bg-card">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">{phase.title}</span>
                  <Badge variant="secondary" className="font-semibold">
                    {phase.weight}% weight
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={phase.progress} className="flex-1 bg-muted" />
                  <span className="text-sm font-bold min-w-[45px] text-right">
                    {formatProgress(phase.progress)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1 p-3 rounded-lg border bg-green-50 dark:bg-green-950/20">
              <div className="text-2xl font-bold text-green-700 dark:text-green-400">{stats.completedTasks}</div>
              <div className="text-xs font-semibold text-green-600 dark:text-green-500">Completed Tasks</div>
            </div>
            <div className="space-y-1 p-3 rounded-lg border bg-blue-50 dark:bg-blue-950/20">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{stats.inProgressTasks}</div>
              <div className="text-xs font-semibold text-blue-600 dark:text-blue-500">In Progress</div>
            </div>
            <div className="space-y-1 p-3 rounded-lg border bg-slate-50 dark:bg-slate-950/20">
              <div className="text-2xl font-bold text-slate-700 dark:text-slate-400">{stats.notStartedTasks}</div>
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-500">Not Started</div>
            </div>
            <div className="space-y-1 p-3 rounded-lg border bg-purple-50 dark:bg-purple-950/20">
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">{stats.totalTasks}</div>
              <div className="text-xs font-semibold text-purple-600 dark:text-purple-500">Total Tasks</div>
            </div>
          </div>

          {/* Alerts */}
          {overdueTasks.length > 0 && (
            <Alert variant="destructive" className="border-2">
              <AlertTriangle className="h-5 w-5" />
              <AlertDescription className="font-semibold">
                <span className="text-lg">{overdueTasks.length}</span> overdue task{overdueTasks.length !== 1 ? 's' : ''}
                {' • '}
                <span className="italic">Updates required every 2 days per contract terms</span>
              </AlertDescription>
            </Alert>
          )}

          {upcomingDeadlines.length > 0 && overdueTasks.length === 0 && (
            <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-900 border-2">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500" />
              <AlertDescription className="text-amber-900 dark:text-amber-200 font-semibold">
                <span className="text-lg">{upcomingDeadlines.length}</span> deadline{upcomingDeadlines.length !== 1 ? 's' : ''} approaching
                {' • '}
                <span className="italic">within the next 7 days</span>
              </AlertDescription>
            </Alert>
          )}

          {overdueTasks.length === 0 && upcomingDeadlines.length === 0 && stats.completedTasks > 0 && (
            <Alert className="bg-green-50 dark:bg-green-950/20 border-green-300 dark:border-green-900 border-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />
              <AlertDescription className="text-green-900 dark:text-green-200 font-semibold">
                ✨ All tasks are on track! No overdue or urgent deadlines.
              </AlertDescription>
            </Alert>
          )}

          {/* Last Updated */}
          <div className="text-xs text-muted-foreground text-right italic">
            Last updated: <span className="font-semibold">{lastUpdated}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
