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
  showProgressBars: boolean;
  showDeadlines: boolean;
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
  toggleProgressBars: () => void;
  toggleDeadlines: () => void;
  // CRUD operations
  addPhase: (phase: Omit<ContractPhase, 'id' | 'progress'>) => void;
  updatePhase: (phaseId: string, updates: Partial<ContractPhase>) => void;
  deletePhase: (phaseId: string) => void;
  addMilestone: (phaseId: string, milestone: Omit<Milestone, 'id' | 'progress'>) => void;
  updateMilestone: (phaseId: string, milestoneId: string, updates: Partial<Milestone>) => void;
  deleteMilestone: (phaseId: string, milestoneId: string) => void;
  addTask: (phaseId: string, milestoneId: string, task: Omit<Task, 'id'>) => void;
  updateTask: (phaseId: string, milestoneId: string, taskId: string, updates: Partial<Task>) => void;
  deleteTask: (phaseId: string, milestoneId: string, taskId: string) => void;
  addSubtask: (phaseId: string, milestoneId: string, taskId: string, subtask: Omit<Subtask, 'id'>) => void;
  updateSubtask: (phaseId: string, milestoneId: string, taskId: string, subtaskId: string, updates: Partial<Subtask>) => void;
  deleteSubtask: (phaseId: string, milestoneId: string, taskId: string, subtaskId: string) => void;
}

const ContractContext = createContext<ContractContextType | undefined>(undefined);

const STORAGE_KEY = 'muhannad-contract-data';

// Initial seed data based on the contract
const getInitialContractData = (): ContractData => {
  // Calculate date 8 days from now for next Thursday
  const nextThursday = new Date();
  nextThursday.setDate(nextThursday.getDate() + 8);
  const nextThursdayISO = nextThursday.toISOString().split('T')[0];

  return {
    contractTitle: 'Project Services Agreement',
    party1: 'Sinjab Fun Company',
    party2: 'Muhanned Al Tinai',
    lastUpdated: new Date().toISOString(),
    showProgressBars: true,
    showDeadlines: true,
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
              deadline: nextThursdayISO,
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
              deadline: nextThursdayISO,
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
  };
};

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

  // Toggle functions
  const toggleProgressBars = () => {
    setContractData((prev) => ({
      ...prev,
      showProgressBars: !prev.showProgressBars,
      lastUpdated: new Date().toISOString(),
    }));
  };

  const toggleDeadlines = () => {
    setContractData((prev) => ({
      ...prev,
      showDeadlines: !prev.showDeadlines,
      lastUpdated: new Date().toISOString(),
    }));
  };

  // CRUD Operations - Phase
  const addPhase = (phase: Omit<ContractPhase, 'id' | 'progress'>) => {
    setContractData((prev) => {
      const newPhase: ContractPhase = {
        ...phase,
        id: `phase-${Date.now()}`,
        progress: 0,
      };
      return {
        ...prev,
        phases: [...prev.phases, newPhase],
        lastUpdated: new Date().toISOString(),
      };
    });
  };

  const updatePhase = (phaseId: string, updates: Partial<ContractPhase>) => {
    setContractData((prev) => {
      const newData = { ...prev };
      const phaseIndex = newData.phases.findIndex((p) => p.id === phaseId);
      if (phaseIndex === -1) return prev;

      newData.phases[phaseIndex] = { ...newData.phases[phaseIndex], ...updates };
      newData.lastUpdated = new Date().toISOString();
      return newData;
    });
  };

  const deletePhase = (phaseId: string) => {
    setContractData((prev) => ({
      ...prev,
      phases: prev.phases.filter((p) => p.id !== phaseId),
      lastUpdated: new Date().toISOString(),
    }));
  };

  // CRUD Operations - Milestone
  const addMilestone = (phaseId: string, milestone: Omit<Milestone, 'id' | 'progress'>) => {
    setContractData((prev) => {
      const newData = { ...prev };
      const phase = newData.phases.find((p) => p.id === phaseId);
      if (!phase) return prev;

      const newMilestone: Milestone = {
        ...milestone,
        id: `milestone-${Date.now()}`,
        progress: 0,
      };
      phase.milestones.push(newMilestone);
      phase.progress = calculatePhaseProgress(phase);
      newData.lastUpdated = new Date().toISOString();
      return newData;
    });
  };

  const updateMilestone = (phaseId: string, milestoneId: string, updates: Partial<Milestone>) => {
    setContractData((prev) => {
      const newData = { ...prev };
      const phase = newData.phases.find((p) => p.id === phaseId);
      if (!phase) return prev;

      const milestoneIndex = phase.milestones.findIndex((m) => m.id === milestoneId);
      if (milestoneIndex === -1) return prev;

      phase.milestones[milestoneIndex] = { ...phase.milestones[milestoneIndex], ...updates };
      phase.progress = calculatePhaseProgress(phase);
      newData.lastUpdated = new Date().toISOString();
      return newData;
    });
  };

  const deleteMilestone = (phaseId: string, milestoneId: string) => {
    setContractData((prev) => {
      const newData = { ...prev };
      const phase = newData.phases.find((p) => p.id === phaseId);
      if (!phase) return prev;

      phase.milestones = phase.milestones.filter((m) => m.id !== milestoneId);
      phase.progress = calculatePhaseProgress(phase);
      newData.lastUpdated = new Date().toISOString();
      return newData;
    });
  };

  // CRUD Operations - Task
  const addTask = (phaseId: string, milestoneId: string, task: Omit<Task, 'id'>) => {
    setContractData((prev) => {
      const newData = { ...prev };
      const phase = newData.phases.find((p) => p.id === phaseId);
      if (!phase) return prev;

      const milestone = phase.milestones.find((m) => m.id === milestoneId);
      if (!milestone) return prev;

      const newTask: Task = {
        ...task,
        id: `task-${Date.now()}`,
      };
      milestone.tasks.push(newTask);
      milestone.progress = calculateMilestoneProgress(milestone);
      phase.progress = calculatePhaseProgress(phase);
      newData.lastUpdated = new Date().toISOString();
      return newData;
    });
  };

  const updateTask = (phaseId: string, milestoneId: string, taskId: string, updates: Partial<Task>) => {
    setContractData((prev) => {
      const newData = { ...prev };
      const phase = newData.phases.find((p) => p.id === phaseId);
      if (!phase) return prev;

      const milestone = phase.milestones.find((m) => m.id === milestoneId);
      if (!milestone) return prev;

      const taskIndex = milestone.tasks.findIndex((t) => t.id === taskId);
      if (taskIndex === -1) return prev;

      milestone.tasks[taskIndex] = { ...milestone.tasks[taskIndex], ...updates };
      milestone.progress = calculateMilestoneProgress(milestone);
      phase.progress = calculatePhaseProgress(phase);
      newData.lastUpdated = new Date().toISOString();
      return newData;
    });
  };

  const deleteTask = (phaseId: string, milestoneId: string, taskId: string) => {
    setContractData((prev) => {
      const newData = { ...prev };
      const phase = newData.phases.find((p) => p.id === phaseId);
      if (!phase) return prev;

      const milestone = phase.milestones.find((m) => m.id === milestoneId);
      if (!milestone) return prev;

      milestone.tasks = milestone.tasks.filter((t) => t.id !== taskId);
      milestone.progress = calculateMilestoneProgress(milestone);
      phase.progress = calculatePhaseProgress(phase);
      newData.lastUpdated = new Date().toISOString();
      return newData;
    });
  };

  // CRUD Operations - Subtask
  const addSubtask = (phaseId: string, milestoneId: string, taskId: string, subtask: Omit<Subtask, 'id'>) => {
    setContractData((prev) => {
      const newData = { ...prev };
      const phase = newData.phases.find((p) => p.id === phaseId);
      if (!phase) return prev;

      const milestone = phase.milestones.find((m) => m.id === milestoneId);
      if (!milestone) return prev;

      const task = milestone.tasks.find((t) => t.id === taskId);
      if (!task) return prev;

      const newSubtask: Subtask = {
        ...subtask,
        id: `subtask-${Date.now()}`,
      };
      task.subtasks.push(newSubtask);
      task.progress = calculateTaskProgress(task);
      milestone.progress = calculateMilestoneProgress(milestone);
      phase.progress = calculatePhaseProgress(phase);
      newData.lastUpdated = new Date().toISOString();
      return newData;
    });
  };

  const updateSubtask = (
    phaseId: string,
    milestoneId: string,
    taskId: string,
    subtaskId: string,
    updates: Partial<Subtask>
  ) => {
    setContractData((prev) => {
      const newData = { ...prev };
      const phase = newData.phases.find((p) => p.id === phaseId);
      if (!phase) return prev;

      const milestone = phase.milestones.find((m) => m.id === milestoneId);
      if (!milestone) return prev;

      const task = milestone.tasks.find((t) => t.id === taskId);
      if (!task) return prev;

      const subtaskIndex = task.subtasks.findIndex((s) => s.id === subtaskId);
      if (subtaskIndex === -1) return prev;

      task.subtasks[subtaskIndex] = { ...task.subtasks[subtaskIndex], ...updates };
      task.progress = calculateTaskProgress(task);
      milestone.progress = calculateMilestoneProgress(milestone);
      phase.progress = calculatePhaseProgress(phase);
      newData.lastUpdated = new Date().toISOString();
      return newData;
    });
  };

  const deleteSubtask = (phaseId: string, milestoneId: string, taskId: string, subtaskId: string) => {
    setContractData((prev) => {
      const newData = { ...prev };
      const phase = newData.phases.find((p) => p.id === phaseId);
      if (!phase) return prev;

      const milestone = phase.milestones.find((m) => m.id === milestoneId);
      if (!milestone) return prev;

      const task = milestone.tasks.find((t) => t.id === taskId);
      if (!task) return prev;

      task.subtasks = task.subtasks.filter((s) => s.id !== subtaskId);
      task.progress = calculateTaskProgress(task);
      milestone.progress = calculateMilestoneProgress(milestone);
      phase.progress = calculatePhaseProgress(phase);
      newData.lastUpdated = new Date().toISOString();
      return newData;
    });
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
    toggleProgressBars,
    toggleDeadlines,
    addPhase,
    updatePhase,
    deletePhase,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    addTask,
    updateTask,
    deleteTask,
    addSubtask,
    updateSubtask,
    deleteSubtask,
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
