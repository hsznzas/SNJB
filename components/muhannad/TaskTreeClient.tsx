'use client';

import { useContract } from '@/lib/contract-context';
import { TaskTree } from './TaskTree';

export function TaskTreeClient() {
  const { contractData } = useContract();
  return <TaskTree phases={contractData.phases} />;
}
