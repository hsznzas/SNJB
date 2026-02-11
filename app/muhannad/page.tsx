import { ContractProvider } from '@/lib/contract-context';
import { ContractHeader } from '@/components/muhannad/ContractHeader';
import { TaskTreeClient } from '@/components/muhannad/TaskTreeClient';

export const metadata = {
  title: 'Muhannad Contract Tracker | Sinjab Fun Company',
  description: 'Project Services Agreement tracking system for Muhanned Al Tinai contract',
};

export default function MuhannadContractPage() {
  return (
    <ContractProvider>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8 px-4 max-w-7xl">
          <div className="space-y-8">
            {/* Page Title */}
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">Contract Tracker</h1>
              <p className="text-muted-foreground">
                Track progress and deadlines for the Muhanned Al Tinai project services agreement
              </p>
            </div>

            {/* Contract Header with Summary */}
            <ContractHeader />

            {/* Task Tree - Hierarchical View */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Contract Phases & Tasks</h2>
              <TaskTreeClient />
            </div>
          </div>
        </div>
      </div>
    </ContractProvider>
  );
}
