'use client';

import { useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/shared/ui/sheet';
import { DATA_2024, DATA_2025, BREAKDOWN_DATA } from '@/data/dashboard-data';
import { ArrowUpRight, Users, Server, CreditCard } from 'lucide-react';

// Helper to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function FinancialDashboard() {
  const [year, setYear] = useState<2024 | 2025>(2025);
  
  // Safe Data Selection
  const currentData = year === 2025 ? DATA_2025 : DATA_2024;
  const breakdown = BREAKDOWN_DATA?.[year] || BREAKDOWN_DATA[2025]; // Safe fallback

  // Calculate Header Stats (Ignore nulls for correct averages)
  const validMonths = currentData.filter(d => d.revenue !== null);
  const totalRev = validMonths.reduce((acc, curr) => acc + (curr.revenue || 0), 0);
  const totalExp = validMonths.reduce((acc, curr) => acc + (curr.expenses || 0), 0);
  const avgRev = validMonths.length ? totalRev / validMonths.length : 0;
  const avgExp = validMonths.length ? totalExp / validMonths.length : 0;
  const netMargin = totalRev - totalExp;

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-4 md:p-8 font-sans">
      
      {/* 1. TOP BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Financial Command Center</h1>
          <p className="text-gray-400 text-sm">Operational visibility & audit trail</p>
        </div>
        <div className="bg-white/5 p-1 rounded-lg border border-white/10 flex gap-1">
          {[2024, 2025].map((y) => (
            <button
              key={y}
              onClick={() => setYear(y as 2024 | 2025)}
              className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${
                year === y 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* 2. HEADER STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard 
          label="Total Revenue (YTD)" 
          value={formatCurrency(totalRev)} 
          sub={`Avg: ${formatCurrency(avgRev)}/mo`}
          color="text-emerald-400" 
        />
        <StatCard 
          label="Total Expenses (YTD)" 
          value={formatCurrency(totalExp)} 
          sub={`Avg: ${formatCurrency(avgExp)}/mo`}
          color="text-red-400" 
        />
        <StatCard 
          label="Net Margin" 
          value={formatCurrency(netMargin)} 
          sub={netMargin > 0 ? "Profitable" : "Burn Zone"}
          color={netMargin > 0 ? "text-emerald-400" : "text-yellow-400"} 
        />
        <StatCard 
          label="Cash Runway" 
          value={year === 2025 ? "Stabilizing" : "Critical"} 
          sub="Debt Restructuring Active"
          color="text-blue-400" 
        />
      </div>

      {/* 3. MAIN CHART */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 shadow-2xl">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full"/> Performance Trends
        </h3>
        <div className="w-full h-[400px]">
          <BarChart
            dataset={currentData}
            xAxis={[{ 
              scaleType: 'band', 
              dataKey: 'month', 
              tickLabelStyle: { fill: '#9ca3af' } // Correct usage
            }]}
            series={[
              { dataKey: 'revenue', label: 'Revenue', color: '#10b981', stack: 'A' },
              { dataKey: 'expenses', label: 'Expenses', color: '#ef4444', stack: 'B' },
            ]}
            yAxis={[{ 
              tickLabelStyle: { fill: '#9ca3af' } // Correct usage
            }]}
            slotProps={{ 
              legend: { 
                labelStyle: { fill: '#ffffff' } // Correct legend styling
              } 
            }}
            grid={{ horizontal: true }}
            margin={{ top: 20, bottom: 30, left: 100, right: 10 }}
            sx={{
              // Global text color overrides for axis labels
              '.MuiChartsAxis-tickLabel': { fill: '#9ca3af !important' },
              '.MuiChartsAxis-line': { stroke: '#374151 !important' },
              '.MuiChartsAxis-tick': { stroke: '#374151 !important' },
            }}
          />
        </div>
      </div>

      {/* 4. DRILL DOWNS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* PAYROLL */}
        <Sheet>
          <SheetTrigger asChild>
            <DrillCard 
              icon={<Users className="w-6 h-6 text-blue-400"/>}
              title="Payroll & HR"
              value={breakdown.payroll.total}
              trend={breakdown.payroll.trend}
            />
          </SheetTrigger>
          <SheetContent className="bg-[#09090b] border-l border-white/10 text-white min-w-[350px] md:min-w-[500px]">
            <SheetHeader className="mb-8">
              <SheetTitle className="text-white text-2xl">Payroll Analysis ({year})</SheetTitle>
              <p className="text-gray-400">Monthly salary bill including GOSI and benefits.</p>
            </SheetHeader>
            <div className="h-[300px] w-full mb-8">
              <h4 className="text-sm font-bold text-gray-500 mb-4 uppercase">Trend Line</h4>
              <LineChart
                xAxis={[{ 
                  data: breakdown.payroll.history.map((d: any) => d.x), 
                  scaleType: 'point', 
                  tickLabelStyle: { fill: '#6b7280' } 
                }]}
                series={[{ 
                  data: breakdown.payroll.history.map((d: any) => d.y), 
                  color: '#60a5fa', 
                  area: true,
                  showMark: true
                }]}
                height={300}
                grid={{ horizontal: true }}
                sx={{
                  '.MuiChartsAxis-tickLabel': { fill: '#9ca3af !important' },
                  '.MuiChartsAxis-line': { stroke: '#374151 !important' },
                }}
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between p-4 bg-white/5 rounded-lg border border-white/5">
                <span>Executive Team</span>
                <span className="font-mono font-bold">~35k / mo</span>
              </div>
              <div className="flex justify-between p-4 bg-white/5 rounded-lg border border-white/5">
                <span>Tech Team</span>
                <span className="font-mono font-bold">~28k / mo</span>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* TECH STACK */}
        <Sheet>
          <SheetTrigger asChild>
            <DrillCard 
              icon={<Server className="w-6 h-6 text-purple-400"/>}
              title="Tech & Dev"
              value={breakdown.tech.dev.includes('Stopped') ? 'Dev Halted' : breakdown.tech.dev}
              trend={year === 2025 ? "Optimized" : "High Investment"}
            />
          </SheetTrigger>
          <SheetContent className="bg-[#09090b] border-l border-white/10 text-white min-w-[350px] md:min-w-[500px]">
            <SheetHeader className="mb-8">
              <SheetTitle className="text-white text-2xl">Technology Spend</SheetTitle>
            </SheetHeader>
            <div className="space-y-4">
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <h4 className="text-red-400 font-bold mb-1">Development Costs</h4>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Status:</span>
                  <span className="font-mono font-bold text-white">{breakdown.tech.dev}</span>
                </div>
              </div>
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <h4 className="text-blue-400 font-bold mb-1">Infrastructure (AWS/Google)</h4>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Monthly Run Rate:</span>
                  <span className="font-mono font-bold text-white">{breakdown.tech.subs}</span>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* DEBT WAR ROOM */}
        <Sheet>
          <SheetTrigger asChild>
            <DrillCard 
              icon={<CreditCard className="w-6 h-6 text-yellow-400"/>}
              title="Debt Service"
              value={breakdown.debt.bank}
              trend="Priority 1"
            />
          </SheetTrigger>
          <SheetContent className="bg-[#09090b] border-l border-white/10 text-white min-w-[350px] md:min-w-[500px]">
            <SheetHeader className="mb-8">
              <SheetTitle className="text-white text-2xl">Debt Restructuring</SheetTitle>
            </SheetHeader>
            <div className="space-y-6">
              <div className="p-5 bg-white/5 rounded-xl border border-white/10">
                <h4 className="text-gray-400 text-xs uppercase tracking-wider mb-2">Bank Loan (3.5M Principal)</h4>
                <div className="text-3xl font-mono font-bold text-white mb-1">103,333.33 <span className="text-sm text-gray-500">SAR/mo</span></div>
                <div className="w-full bg-gray-800 h-2 rounded-full mt-4 overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[45%]"></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Paid: 16 Installments</span>
                  <span>Remaining: 18</span>
                </div>
              </div>

              <div className="p-5 bg-white/5 rounded-xl border border-white/10">
                <h4 className="text-gray-400 text-xs uppercase tracking-wider mb-2">Club Liabilities (Trade Payables)</h4>
                <div className="text-3xl font-mono font-bold text-red-400 mb-1">{breakdown.debt.clubs}</div>
                <p className="text-sm text-gray-500 mt-2">Arrears due to cash flow float usage. Repayment plan linked to growth capital.</p>
              </div>
            </div>
          </SheetContent>
        </Sheet>

      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatCard({ label, value, sub, color }: { label: string, value: string, sub: string, color: string }) {
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-colors">
      <div className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-2">{label}</div>
      <div className={`text-2xl font-black mb-1 ${color}`}>{value}</div>
      <div className="text-xs text-gray-500 font-mono">{sub}</div>
    </div>
  );
}

function DrillCard({ icon, title, value, trend }: { icon: any, title: string, value: string, trend: string }) {
  return (
    <button className="w-full group bg-white/5 border border-white/10 p-6 rounded-2xl cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-left">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-black/40 rounded-lg border border-white/5 group-hover:border-blue-500/30 transition-colors">
          {icon}
        </div>
        <ArrowUpRight className="w-5 h-5 text-gray-600 group-hover:text-blue-400 transition-colors"/>
      </div>
      <div className="text-gray-400 text-sm font-medium mb-1">{title}</div>
      <div className="text-xl font-bold text-white mb-2">{value}</div>
      <div className="inline-flex items-center px-2 py-1 rounded bg-white/5 text-xs text-gray-400 border border-white/5 group-hover:text-blue-200 group-hover:bg-blue-500/20 group-hover:border-blue-500/20 transition-all">
        {trend}
      </div>
    </button>
  );
}