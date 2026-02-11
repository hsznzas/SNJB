'use client';

import React, { useState } from 'react';
import { useContract, ContractPhase, Milestone, Task, Subtask } from '@/lib/contract-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shared/ui/card';
import { Badge } from '@/components/shared/ui/badge';
import { Button } from '@/components/shared/ui/button';
import { Separator } from '@/components/shared/ui/separator';
import { ProgressSlider } from './ProgressSlider';
import { DeadlineTracker } from './DeadlineTracker';
import { ChevronDown, ChevronRight, CheckCircle2, Circle, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatProgress, getProgressStatus } from '@/lib/contract-utils';

interface TaskTreeProps {
  phases: ContractPhase[];
}

export function TaskTree({ phases }: TaskTreeProps) {
  return (
    <div className="space-y-6">
      {phases.map((phase) => (
        <PhaseNode key={phase.id} phase={phase} />
      ))}
    </div>
  );
}

function PhaseNode({ phase }: { phase: ContractPhase }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { color } = getProgressStatus(phase.progress);

  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0 mt-1"
            >
              {isExpanded ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </Button>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <CardTitle className="text-xl">{phase.title}</CardTitle>
                <Badge variant="secondary" className="font-semibold">
                  {phase.weight}% weight
                </Badge>
                <Badge variant="outline" className={cn('font-semibold', color)}>
                  {formatProgress(phase.progress)}
                </Badge>
              </div>
              {phase.description && (
                <CardDescription>{phase.description}</CardDescription>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4 pt-0">
          {phase.milestones.map((milestone, index) => (
            <React.Fragment key={milestone.id}>
              {index > 0 && <Separator />}
              <MilestoneNode phaseId={phase.id} milestone={milestone} />
            </React.Fragment>
          ))}
        </CardContent>
      )}
    </Card>
  );
}

function MilestoneNode({ phaseId, milestone }: { phaseId: string; milestone: Milestone }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { color } = getProgressStatus(milestone.progress);

  return (
    <div className="pl-8 space-y-3">
      <div className="flex items-start gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-7 w-7 p-0 mt-0.5"
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">{milestone.title}</h3>
            <Badge variant="outline" className="text-xs">
              {milestone.weight}% weight
            </Badge>
            <Badge variant="outline" className={cn('text-xs font-semibold', color)}>
              {formatProgress(milestone.progress)}
            </Badge>
          </div>

          {milestone.description && (
            <p className="text-sm text-muted-foreground">{milestone.description}</p>
          )}

          {milestone.deadline && (
            <DeadlineTracker deadline={milestone.deadline} compact />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="pl-10 space-y-3">
          {milestone.tasks.map((task) => (
            <TaskNode
              key={task.id}
              phaseId={phaseId}
              milestoneId={milestone.id}
              task={task}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TaskNode({
  phaseId,
  milestoneId,
  task,
}: {
  phaseId: string;
  milestoneId: string;
  task: Task;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { updateTaskProgress } = useContract();
  const { color, status } = getProgressStatus(task.progress);

  const hasSubtasks = task.subtasks.length > 0;
  const Icon = task.progress === 100 ? CheckCircle2 : Circle;

  return (
    <Card className="border">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          {hasSubtasks && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6 p-0 mt-0.5"
            >
              {isExpanded ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
            </Button>
          )}

          <div className="flex-1 space-y-3">
            <div className="flex items-start gap-3">
              <Icon
                className={cn(
                  'h-5 w-5 mt-0.5 flex-shrink-0',
                  task.progress === 100 ? 'text-green-600' : 'text-muted-foreground'
                )}
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-medium">{task.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {task.weight}% weight
                  </Badge>
                </div>

                {task.description && (
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                )}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1 max-w-md">
                    <ProgressSlider
                      progress={task.progress}
                      onChange={(value) =>
                        updateTaskProgress(phaseId, milestoneId, task.id, value)
                      }
                      label="Progress"
                    />
                  </div>

                  {task.deadline && (
                    <DeadlineTracker deadline={task.deadline} compact />
                  )}
                </div>
              </div>
            </div>

            {/* Subtasks */}
            {hasSubtasks && isExpanded && (
              <div className="pl-8 space-y-2 border-l-2 border-muted">
                {task.subtasks.map((subtask) => (
                  <SubtaskNode
                    key={subtask.id}
                    phaseId={phaseId}
                    milestoneId={milestoneId}
                    taskId={task.id}
                    subtask={subtask}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SubtaskNode({
  phaseId,
  milestoneId,
  taskId,
  subtask,
}: {
  phaseId: string;
  milestoneId: string;
  taskId: string;
  subtask: Subtask;
}) {
  const { updateSubtaskProgress } = useContract();
  const Icon = subtask.progress === 100 ? CheckCircle2 : Circle;

  return (
    <div className="pl-4 py-2 space-y-2">
      <div className="flex items-start gap-3">
        <Icon
          className={cn(
            'h-4 w-4 mt-0.5 flex-shrink-0',
            subtask.progress === 100 ? 'text-green-600' : 'text-muted-foreground'
          )}
        />
        <div className="flex-1 space-y-2">
          <div>
            <h5 className="text-sm font-medium">{subtask.title}</h5>
            {subtask.description && (
              <p className="text-xs text-muted-foreground mt-1">{subtask.description}</p>
            )}
          </div>

          <div className="max-w-xs">
            <ProgressSlider
              progress={subtask.progress}
              onChange={(value) =>
                updateSubtaskProgress(phaseId, milestoneId, taskId, subtask.id, value)
              }
              showPercentage={true}
            />
          </div>

          {subtask.deadline && (
            <DeadlineTracker deadline={subtask.deadline} compact showIcon={false} />
          )}
        </div>
      </div>
    </div>
  );
}
