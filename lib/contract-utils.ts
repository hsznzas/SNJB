import { ContractPhase, Milestone, Task, Subtask } from './contract-context';

/**
 * Calculate days remaining until a deadline
 * @param deadline ISO date string
 * @returns Number of days (negative if overdue)
 */
export function getDaysRemaining(deadline: string | undefined): number | null {
  if (!deadline) return null;
  
  const deadlineDate = new Date(deadline);
  const today = new Date();
  
  // Reset time to midnight for accurate day calculation
  deadlineDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Get deadline status with color coding
 * @param deadline ISO date string
 * @returns Object with status, color, and display text
 */
export function getDeadlineStatus(deadline: string | undefined): {
  status: 'safe' | 'warning' | 'danger' | 'overdue' | 'none';
  color: string;
  text: string;
  bgColor: string;
} {
  const daysRemaining = getDaysRemaining(deadline);
  
  if (daysRemaining === null) {
    return {
      status: 'none',
      color: 'text-muted-foreground',
      text: 'No deadline',
      bgColor: 'bg-muted',
    };
  }
  
  if (daysRemaining < 0) {
    return {
      status: 'overdue',
      color: 'text-destructive',
      text: `${Math.abs(daysRemaining)} day${Math.abs(daysRemaining) !== 1 ? 's' : ''} overdue`,
      bgColor: 'bg-destructive/10',
    };
  }
  
  if (daysRemaining === 0) {
    return {
      status: 'danger',
      color: 'text-destructive',
      text: 'Due today',
      bgColor: 'bg-destructive/10',
    };
  }
  
  if (daysRemaining <= 2) {
    return {
      status: 'danger',
      color: 'text-destructive',
      text: `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining`,
      bgColor: 'bg-destructive/10',
    };
  }
  
  if (daysRemaining <= 7) {
    return {
      status: 'warning',
      color: 'text-yellow-600 dark:text-yellow-500',
      text: `${daysRemaining} days remaining`,
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    };
  }
  
  return {
    status: 'safe',
    color: 'text-green-600 dark:text-green-500',
    text: `${daysRemaining} days remaining`,
    bgColor: 'bg-green-100 dark:bg-green-900/20',
  };
}

/**
 * Get progress status with color coding
 * @param progress Number from 0-100
 * @returns Object with color classes
 */
export function getProgressStatus(progress: number): {
  status: 'low' | 'medium' | 'high' | 'complete';
  color: string;
  bgColor: string;
} {
  if (progress >= 100) {
    return {
      status: 'complete',
      color: 'text-foreground',
      bgColor: 'bg-foreground',
    };
  }
  
  if (progress >= 67) {
    return {
      status: 'high',
      color: 'text-foreground',
      bgColor: 'bg-foreground',
    };
  }
  
  if (progress >= 34) {
    return {
      status: 'medium',
      color: 'text-muted-foreground',
      bgColor: 'bg-muted-foreground',
    };
  }
  
  return {
    status: 'low',
    color: 'text-muted-foreground/70',
    bgColor: 'bg-muted-foreground/70',
  };
}

/**
 * Format date to readable string
 * @param isoDate ISO date string
 * @returns Formatted date string
 */
export function formatDate(isoDate: string | undefined): string {
  if (!isoDate) return 'No date set';
  
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Get all overdue tasks from phases
 * @param phases Array of contract phases
 * @returns Array of overdue task objects with their hierarchy info
 */
export function getOverdueTasks(phases: ContractPhase[]): Array<{
  phase: string;
  milestone: string;
  task: Task;
  daysOverdue: number;
}> {
  const overdueTasks: Array<{
    phase: string;
    milestone: string;
    task: Task;
    daysOverdue: number;
  }> = [];
  
  phases.forEach((phase) => {
    phase.milestones.forEach((milestone) => {
      milestone.tasks.forEach((task) => {
        const daysRemaining = getDaysRemaining(task.deadline);
        if (daysRemaining !== null && daysRemaining < 0) {
          overdueTasks.push({
            phase: phase.title,
            milestone: milestone.title,
            task,
            daysOverdue: Math.abs(daysRemaining),
          });
        }
      });
    });
  });
  
  // Sort by most overdue first
  return overdueTasks.sort((a, b) => b.daysOverdue - a.daysOverdue);
}

/**
 * Get upcoming deadlines (within 7 days)
 * @param phases Array of contract phases
 * @returns Array of upcoming task objects with their hierarchy info
 */
export function getUpcomingDeadlines(phases: ContractPhase[]): Array<{
  phase: string;
  milestone: string;
  task: Task;
  daysRemaining: number;
}> {
  const upcomingTasks: Array<{
    phase: string;
    milestone: string;
    task: Task;
    daysRemaining: number;
  }> = [];
  
  phases.forEach((phase) => {
    phase.milestones.forEach((milestone) => {
      milestone.tasks.forEach((task) => {
        const daysRemaining = getDaysRemaining(task.deadline);
        if (daysRemaining !== null && daysRemaining >= 0 && daysRemaining <= 7) {
          upcomingTasks.push({
            phase: phase.title,
            milestone: milestone.title,
            task,
            daysRemaining,
          });
        }
      });
    });
  });
  
  // Sort by soonest deadline first
  return upcomingTasks.sort((a, b) => a.daysRemaining - b.daysRemaining);
}

/**
 * Calculate completion statistics
 * @param phases Array of contract phases
 * @returns Statistics object
 */
export function getCompletionStats(phases: ContractPhase[]): {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  notStartedTasks: number;
  totalSubtasks: number;
  completedSubtasks: number;
} {
  let totalTasks = 0;
  let completedTasks = 0;
  let inProgressTasks = 0;
  let notStartedTasks = 0;
  let totalSubtasks = 0;
  let completedSubtasks = 0;
  
  phases.forEach((phase) => {
    phase.milestones.forEach((milestone) => {
      milestone.tasks.forEach((task) => {
        totalTasks++;
        
        if (task.progress === 100) {
          completedTasks++;
        } else if (task.progress > 0) {
          inProgressTasks++;
        } else {
          notStartedTasks++;
        }
        
        task.subtasks.forEach((subtask) => {
          totalSubtasks++;
          if (subtask.progress === 100) {
            completedSubtasks++;
          }
        });
      });
    });
  });
  
  return {
    totalTasks,
    completedTasks,
    inProgressTasks,
    notStartedTasks,
    totalSubtasks,
    completedSubtasks,
  };
}

/**
 * Export contract data to downloadable JSON file
 * @param data JSON string of contract data
 * @param filename Name for the downloaded file
 */
export function downloadJSON(data: string, filename: string = 'contract-data.json'): void {
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Format progress as percentage string
 * @param progress Number from 0-100
 * @returns Formatted string like "75%"
 */
export function formatProgress(progress: number): string {
  return `${Math.round(progress)}%`;
}
