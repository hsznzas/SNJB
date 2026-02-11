'use client';

import React, { useState } from 'react';
import { useContract, ContractPhase, Milestone, Task, Subtask } from '@/lib/contract-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shared/ui/card';
import { Badge } from '@/components/shared/ui/badge';
import { Button } from '@/components/shared/ui/button';
import { Separator } from '@/components/shared/ui/separator';
import { ProgressSlider } from './ProgressSlider';
import { DeadlineTracker } from './DeadlineTracker';
import { EditDialog } from './EditDialog';
import { ChevronDown, ChevronRight, CheckCircle2, Circle, Target, Edit, Trash2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatProgress, getProgressStatus } from '@/lib/contract-utils';

interface EditFormData {
  title: string;
  description?: string;
  deadline?: string;
  weight?: number;
  progress?: number;
}

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
  const [editOpen, setEditOpen] = useState(false);
  const { contractData, updatePhase, deletePhase, addMilestone } = useContract();
  const { color } = getProgressStatus(phase.progress);
  const [addMilestoneOpen, setAddMilestoneOpen] = useState(false);

  const handleEdit = () => {
    setEditOpen(true);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${phase.title}" and all its contents?`)) {
      deletePhase(phase.id);
    }
  };

  const handleSaveEdit = (data: EditFormData) => {
    updatePhase(phase.id, data);
  };

  const handleAddMilestone = (data: EditFormData) => {
    addMilestone(phase.id, {
      title: data.title,
      description: data.description,
      deadline: data.deadline,
      weight: data.weight ?? 50,
      tasks: [],
    });
  };

  return (
    <>
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
                  <CardTitle className="text-xl font-bold">{phase.title}</CardTitle>
                  <Badge variant="secondary" className="font-bold">
                    {phase.weight}% weight
                  </Badge>
                  <Badge variant="outline" className="font-bold">
                    {formatProgress(phase.progress)}
                  </Badge>
                </div>
                {phase.description && (
                  <CardDescription className="italic">{phase.description}</CardDescription>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setAddMilestoneOpen(true)}>
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleDelete} className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
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

      <EditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Edit Phase"
        item={phase}
        onSave={handleSaveEdit}
        showWeight={true}
        showDeadline={false}
      />

      <EditDialog
        open={addMilestoneOpen}
        onOpenChange={setAddMilestoneOpen}
        title="Add Milestone"
        description={`Add a new milestone to ${phase.title}`}
        onSave={handleAddMilestone}
        showWeight={true}
        showDeadline={true}
      />
    </>
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
  const [editOpen, setEditOpen] = useState(false);
  const { contractData, updateTaskProgress, updateTask, deleteTask, addSubtask } = useContract();
  const { color, status } = getProgressStatus(task.progress);
  const [addSubtaskOpen, setAddSubtaskOpen] = useState(false);

  const hasSubtasks = task.subtasks.length > 0;
  const Icon = task.progress === 100 ? CheckCircle2 : Circle;

  const handleEdit = () => {
    setEditOpen(true);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      deleteTask(phaseId, milestoneId, task.id);
    }
  };

  const handleSaveEdit = (data: EditFormData) => {
    updateTask(phaseId, milestoneId, task.id, data);
  };

  const handleAddSubtask = (data: EditFormData) => {
    addSubtask(phaseId, milestoneId, task.id, {
      title: data.title,
      description: data.description,
      progress: data.progress ?? 0,
      deadline: data.deadline,
    });
  };

  return (
    <>
      <Card className="border bg-card">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
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
                      task.progress === 100 ? 'text-green-600 dark:text-green-500' : 'text-muted-foreground'
                    )}
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold">{task.title}</h4>
                      <Badge variant="outline" className="text-xs font-medium">
                        {task.weight}% weight
                      </Badge>
                    </div>

                    {task.description && (
                      <p className="text-sm text-muted-foreground italic">{task.description}</p>
                    )}

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      {contractData.showProgressBars && (
                        <div className="flex-1 max-w-md">
                          <ProgressSlider
                            progress={task.progress}
                            onChange={(value) =>
                              updateTaskProgress(phaseId, milestoneId, task.id, value)
                            }
                            label="Progress"
                          />
                        </div>
                      )}

                      {contractData.showDeadlines && task.deadline && (
                        <DeadlineTracker deadline={task.deadline} compact />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setAddSubtaskOpen(true)}>
                <Plus className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={handleEdit}>
                <Edit className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={handleDelete}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Subtasks */}
          {hasSubtasks && isExpanded && (
            <div className="pl-8 space-y-2 border-l-2 border-muted mt-3">
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
        </CardContent>
      </Card>

      <EditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Edit Task"
        item={task}
        onSave={handleSaveEdit}
        showWeight={true}
        showDeadline={true}
      />

      <EditDialog
        open={addSubtaskOpen}
        onOpenChange={setAddSubtaskOpen}
        title="Add Subtask"
        description={`Add a new subtask to ${task.title}`}
        onSave={handleAddSubtask}
        showWeight={false}
        showDeadline={true}
        showProgress={true}
      />
    </>
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
  const [editOpen, setEditOpen] = useState(false);
  const { contractData, updateSubtaskProgress, updateSubtask, deleteSubtask } = useContract();
  const Icon = subtask.progress === 100 ? CheckCircle2 : Circle;

  const handleEdit = () => {
    setEditOpen(true);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${subtask.title}"?`)) {
      deleteSubtask(phaseId, milestoneId, taskId, subtask.id);
    }
  };

  const handleSaveEdit = (data: EditFormData) => {
    updateSubtask(phaseId, milestoneId, taskId, subtask.id, data);
  };

  return (
    <>
      <div className="pl-4 py-2 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <Icon
              className={cn(
                'h-4 w-4 mt-0.5 flex-shrink-0',
                subtask.progress === 100 ? 'text-green-600 dark:text-green-500' : 'text-muted-foreground'
              )}
            />
            <div className="flex-1 space-y-2">
              <div>
                <h5 className="text-sm font-semibold">{subtask.title}</h5>
                {subtask.description && (
                  <p className="text-xs text-muted-foreground mt-1 italic">{subtask.description}</p>
                )}
              </div>

              {contractData.showProgressBars && (
                <div className="max-w-xs">
                  <ProgressSlider
                    progress={subtask.progress}
                    onChange={(value) =>
                      updateSubtaskProgress(phaseId, milestoneId, taskId, subtask.id, value)
                    }
                    showPercentage={true}
                  />
                </div>
              )}

              {contractData.showDeadlines && subtask.deadline && (
                <DeadlineTracker deadline={subtask.deadline} compact showIcon={false} />
              )}
            </div>
          </div>

          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleEdit}>
              <Edit className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive hover:text-destructive" onClick={handleDelete}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      <EditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Edit Subtask"
        item={subtask}
        onSave={handleSaveEdit}
        showWeight={false}
        showDeadline={true}
        showProgress={true}
      />
    </>
  );
}
