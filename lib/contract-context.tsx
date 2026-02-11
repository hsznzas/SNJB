'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// TypeScript interfaces for the 4-level hierarchy
export interface Subtask {
  id: string;
  title: string;
  description?: string;
  progress: number; // 0-100
  deadline?: string; // ISO date string
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  progress: number; // 0-100
  deadline?: string;
  weight: number; // Weight within parent milestone
  subtasks: Subtask[];
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  progress: number; // Auto-calculated from tasks
  deadline?: string;
  weight: number; // Weight within parent phase
  tasks: Task[];
}

export interface ContractPhase {
  id: string;
  title: string;
  description?: string;
  progress: number; // Auto-calculated from milestones
  weight: number; // Weight in overall contract (35% / 65%)
  milestones: Milestone[];
}

export interface ContractData {
  phases: ContractPhase[];
  contractTitle: string;
  party1: string;
  party2: string;
  lastUpdated: string;
}

interface ContractContextType {
  contractData: ContractData;
  updateTaskProgress: (phaseId: string, milestoneId: string, taskId: string, progress: number) => void;
  updateSubtaskProgress: (phaseId: string, milestoneId: string, taskId: string, subtaskId: string, progress: number) => void;
  updateTaskDeadline: (phaseId: string, milestoneId: string, taskId: string, deadline: string) => void;
  calculateWeightedProgress: () => number;
  exportData: () => string;
  importData: (jsonData: string) => void;
  resetData: () => void;
}

const ContractContext = createContext<ContractContextType | undefined>(undefined);

const STORAGE_KEY = 'muhannad-contract-data';

// Initial seed data based on the contract
const getInitialContractData = (): ContractData => ({
  contractTitle: 'Project Services Agreement',
  party1: 'Sinjab Fun Company',
  party2: 'Muhanned Al Tinai',
  lastUpdated: new Date().toISOString(),
  phases: [
    {
      id: 'phase-1',
      title: 'Phase 1: Operational & Talent',
      description: 'Focus on talent acquisition and financial operations',
      progress: 0,
      weight: 35,
      milestones: [
        {
          id: 'milestone-1-1',
          title: 'Talent Acquisition',
          description: 'Hire key operational staff',
          progress: 0,
          deadline: '2026-02-12',
          weight: 50,
          tasks: [
            {
              id: 'task-1-1-1',
              title: 'Hire COO (Saudi)',
              description: 'Source and hire Chief Operating Officer',
              progress: 0,
              deadline: '2026-02-12',
              weight: 40,
              subtasks: [
                {
                  id: 'subtask-1-1-1-1',
                  title: 'Source candidates',
                  progress: 0,
                },
                {
                  id: 'subtask-1-1-1-2',
                  title: 'Shortlist for leadership in 3-6 months',
                  progress: 0,
                },
              ],
            },
            {
              id: 'task-1-1-2',
              title: 'Hire Accounting Manager',
              description: 'Must have ZATCA/VAT expertise',
              progress: 0,
              deadline: '2026-02-12',
              weight: 40,
              subtasks: [
                {
                  id: 'subtask-1-1-2-1',
                  title: 'Must know ZATCA/VAT',
                  progress: 0,
                },
                {
                  id: 'subtask-1-1-2-2',
                  title: 'Full transfer from "Dhaher" (7 days post-hire)',
                  progress: 0,
                },
              ],
            },
            {
              id: 'task-1-1-3',
              title: 'Hire Sales Representative (Saudi Male)',
              description: 'Sales team member',
              progress: 0,
              deadline: '2026-02-12',
              weight: 20,
              subtasks: [],
            },
          ],
        },
        {
          id: 'milestone-1-2',
          title: 'Financial Handover',
          description: 'Complete financial system transfer',
          progress: 0,
          deadline: '2026-02-15',
          weight: 50,
          tasks: [
            {
              id: 'task-1-2-1',
              title: 'AHH Takeover',
              description: 'Complete takeover of accounting systems',
              progress: 0,
              deadline: '2026-02-15',
              weight: 100,
              subtasks: [
                {
                  id: 'subtask-1-2-1-1',
                  title: 'Funds transfer',
                  progress: 0,
                },
                {
                  id: 'subtask-1-2-1-2',
                  title: 'Invoicing',
                  progress: 0,
                },
                {
                  id: 'subtask-1-2-1-3',
                  title: 'Alrajhi Dashboard functions',
                  progress: 0,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'phase-2',
      title: 'Phase 2: Technical & Integration',
      description: 'System integration and technical development',
      progress: 0,
      weight: 65,
      milestones: [
        {
          id: 'milestone-2-1',
          title: 'Odoo Migration',
          description: 'Complete migration to Odoo system',
          progress: 0,
          deadline: '2026-02-26',
          weight: 30,
          tasks: [
            {
              id: 'task-2-1-1',
              title: 'Financial dashboard expertise',
              description: 'Build and configure financial dashboards',
              progress: 0,
              deadline: '2026-02-26',
              weight: 50,
              subtasks: [],
            },
            {
              id: 'task-2-1-2',
              title: 'Transition Sales/CS from Trello/Google Sheets',
              description: 'Migrate all sales and customer service data',
              progress: 0,
              deadline: '2026-02-26',
              weight: 50,
              subtasks: [],
            },
          ],
        },
        {
          id: 'milestone-2-2',
          title: 'Key Features Development',
          description: 'Develop core business features',
          progress: 0,
          deadline: '2026-03-03',
          weight: 30,
          tasks: [
            {
              id: 'task-2-2-1',
              title: 'B2B Corporate/Wallet Feature',
              description: 'Corporate accounts and wallet system',
              progress: 0,
              deadline: '2026-03-03',
              weight: 60,
              subtasks: [],
            },
            {
              id: 'task-2-2-2',
              title: 'Football Industry Supervision',
              description: 'Industry-specific management features',
              progress: 0,
              deadline: '2026-03-03',
              weight: 40,
              subtasks: [],
            },
          ],
        },
        {
          id: 'milestone-2-3',
          title: 'API Integrations',
          description: 'Third-party system integrations',
          progress: 0,
          deadline: '2026-05-12',
          weight: 40,
          tasks: [
            {
              id: 'task-2-3-1',
              title: 'Al Rajhi Integration',
              description: 'Banking system integration',
              progress: 0,
              deadline: '2026-05-12',
              weight: 25,
              subtasks: [],
            },
            {
              id: 'task-2-3-2',
              title: 'Al-Inma Integration',
              description: 'Banking system integration',
              progress: 0,
              deadline: '2026-05-12',
              weight: 25,
              subtasks: [],
            },
            {
              id: 'task-2-3-3',
              title: 'Webook Integration',
              description: 'Booking system integration',
              progress: 0,
              deadline: '2026-05-12',
              weight: 20,
              subtasks: [],
            },
            {
              id: 'task-2-3-4',
              title: 'Wafi Integration',
              description: 'Payment system integration',
              progress: 0,
              deadline: '2026-05-12',
              weight: 15,
              subtasks: [],
            },
            {
              id: 'task-2-3-5',
              title: 'Thriwe Integration',
              description: 'Loyalty program integration',
              progress: 0,
              deadline: '2026-05-12',
              weight: 15,
              subtasks: [],
            },
          ],
        },
      ],
    },
  ],
});

export function ContractProvider({ children }: { children: ReactNode }) {
  const [contractData, setContractData] = useState<ContractData>(getInitialContractData());

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setContractData(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load contract data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contractData));
  }, [contractData]);

  // Calculate weighted progress for a task (based on subtasks)
  const calculateTaskProgress = (task: Task): number => {
    if (task.subtasks.length === 0) {
      return task.progress;
    }
    const subtaskProgress = task.subtasks.reduce((sum, subtask) => sum + subtask.progress, 0);
    return subtaskProgress / task.subtasks.length;
  };

  // Calculate weighted progress for a milestone (based on tasks)
  const calculateMilestoneProgress = (milestone: Milestone): number => {
    if (milestone.tasks.length === 0) return 0;
    const totalWeight = milestone.tasks.reduce((sum, task) => sum + task.weight, 0);
    const weightedSum = milestone.tasks.reduce((sum, task) => {
      const taskProgress = calculateTaskProgress(task);
      return sum + (taskProgress * task.weight);
    }, 0);
    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  };

  // Calculate weighted progress for a phase (based on milestones)
  const calculatePhaseProgress = (phase: ContractPhase): number => {
    if (phase.milestones.length === 0) return 0;
    const totalWeight = phase.milestones.reduce((sum, milestone) => sum + milestone.weight, 0);
    const weightedSum = phase.milestones.reduce((sum, milestone) => {
      const milestoneProgress = calculateMilestoneProgress(milestone);
      return sum + (milestoneProgress * milestone.weight);
    }, 0);
    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  };

  // Update task progress
  const updateTaskProgress = (phaseId: string, milestoneId: string, taskId: string, progress: number) => {
    setContractData((prev) => {
      const newData = { ...prev };
      const phase = newData.phases.find((p) => p.id === phaseId);
      if (!phase) return prev;

      const milestone = phase.milestones.find((m) => m.id === milestoneId);
      if (!milestone) return prev;

      const task = milestone.tasks.find((t) => t.id === taskId);
      if (!task) return prev;

      task.progress = Math.max(0, Math.min(100, progress));

      // Recalculate milestone and phase progress
      milestone.progress = calculateMilestoneProgress(milestone);
      phase.progress = calculatePhaseProgress(phase);

      newData.lastUpdated = new Date().toISOString();
      return newData;
    });
  };

  // Update subtask progress
  const updateSubtaskProgress = (
    phaseId: string,
    milestoneId: string,
    taskId: string,
    subtaskId: string,
    progress: number
  ) => {
    setContractData((prev) => {
      const newData = { ...prev };
      const phase = newData.phases.find((p) => p.id === phaseId);
      if (!phase) return prev;

      const milestone = phase.milestones.find((m) => m.id === milestoneId);
      if (!milestone) return prev;

      const task = milestone.tasks.find((t) => t.id === taskId);
      if (!task) return prev;

      const subtask = task.subtasks.find((s) => s.id === subtaskId);
      if (!subtask) return prev;

      subtask.progress = Math.max(0, Math.min(100, progress));

      // Recalculate task, milestone, and phase progress
      task.progress = calculateTaskProgress(task);
      milestone.progress = calculateMilestoneProgress(milestone);
      phase.progress = calculatePhaseProgress(phase);

      newData.lastUpdated = new Date().toISOString();
      return newData;
    });
  };

  // Update task deadline
  const updateTaskDeadline = (phaseId: string, milestoneId: string, taskId: string, deadline: string) => {
    setContractData((prev) => {
      const newData = { ...prev };
      const phase = newData.phases.find((p) => p.id === phaseId);
      if (!phase) return prev;

      const milestone = phase.milestones.find((m) => m.id === milestoneId);
      if (!milestone) return prev;

      const task = milestone.tasks.find((t) => t.id === taskId);
      if (!task) return prev;

      task.deadline = deadline;
      newData.lastUpdated = new Date().toISOString();
      return newData;
    });
  };

  // Calculate overall contract progress (weighted by phase weights)
  const calculateWeightedProgress = (): number => {
    const totalWeight = contractData.phases.reduce((sum, phase) => sum + phase.weight, 0);
    const weightedSum = contractData.phases.reduce((sum, phase) => {
      const phaseProgress = calculatePhaseProgress(phase);
      return sum + (phaseProgress * phase.weight);
    }, 0);
    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  };

  // Export data as JSON
  const exportData = (): string => {
    return JSON.stringify(contractData, null, 2);
  };

  // Import data from JSON
  const importData = (jsonData: string) => {
    try {
      const data = JSON.parse(jsonData);
      setContractData(data);
    } catch (error) {
      console.error('Failed to import data:', error);
      throw new Error('Invalid JSON data');
    }
  };

  // Reset to initial data
  const resetData = () => {
    setContractData(getInitialContractData());
  };

  const value: ContractContextType = {
    contractData,
    updateTaskProgress,
    updateSubtaskProgress,
    updateTaskDeadline,
    calculateWeightedProgress,
    exportData,
    importData,
    resetData,
  };

  return <ContractContext.Provider value={value}>{children}</ContractContext.Provider>;
}

export function useContract() {
  const context = useContext(ContractContext);
  if (context === undefined) {
    throw new Error('useContract must be used within a ContractProvider');
  }
  return context;
}
