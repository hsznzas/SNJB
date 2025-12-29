'use client';

import { useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { 
  DATA_2024, 
  DATA_2025, 
  DATA_CONSOLIDATED, 
  BREAKDOWN_DATA, 
  DEBT_BALANCE_HISTORY, 
  LOAN_DETAILS,
  GMV_DATA,
  GMV_SUMMARY,
  TAKE_RATE_DATA,
  TICKET_SIZE_DATA
} from '@/data/dashboard-data';
import { ArrowDown, Users, Server, CreditCard, Activity, PieChart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Common Chart Styles for Consistency
const commonChartProps = {
  grid: { horizontal: true },
  margin: { top: 20, bottom: 40, left: 120, right: 20 }, // Increased Left Margin for Y-Axis
  slotProps: { 
    legend: { 
      hidden: false,
      labelStyle: { fontSize: 12, fill: '#E5E7EB' }, // Direct Prop Styling
      itemMarkWidth: 10,
      itemMarkHeight: 10,
    } 
  },
  sx: {
    // Force Override for Legend Text
    '.MuiChartsLegend-root text': { fill: '#E5E7EB !important' }, 
    '.MuiChartsLegend-series text': { fill: '#E5E7EB !important' }, 
    // Axis Labels & Ticks
    '.MuiChartsAxis-tickLabel': { fill: '#E5E7EB !important', fontSize: 11 },
    '.MuiChartsAxis-line': { stroke: '#60A5FA !important', strokeOpacity: 0.3 },
    '.MuiChartsAxis-tick': { stroke: '#60A5FA !important', strokeOpacity: 0.3 },
    // Grid Lines
    '.MuiChartsGrid-line': { stroke: '#60A5FA !important', strokeOpacity: 0.1 },
  }
};

export default function FinancialDashboard() {
  const [view, setView] = useState<2024 | 2025 | 'consolidated'>('consolidated');
  const [activeTab, setActiveTab] = useState<'health' | 'expenses' | 'debt'>('health');
  
  let currentData;
  if (view === 'consolidated') currentData = DATA_CONSOLIDATED;
  else if (view === 2025) currentData = DATA_2025;
  else currentData = DATA_2024;

  const breakdown = BREAKDOWN_DATA[view] || BREAKDOWN_DATA['consolidated'];

  const validMonths = (currentData || []).filter(d => d.revenue !== null);
  const totalRev = validMonths.reduce((acc, curr) => acc + (curr.revenue || 0), 0);
  const totalExp = validMonths.reduce((acc, curr) => acc + (curr.expenses || 0), 0);
  const netMargin = totalRev - totalExp;

  return (
    // UPDATED BACKGROUND TO SINJAB DARK BLUE
    <div className="min-h-screen bg-[#000F80] text-white p-4 md:p-8 font-sans">
      
      {/* GRADIENT DEFINITIONS */}
      <svg height={0} width={0}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1B5BCC" stopOpacity={0.9}/>
            <stop offset="95%" stopColor="#1B5BCC" stopOpacity={0.3}/>
          </linearGradient>
          <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#B20B00" stopOpacity={0.9}/>
            <stop offset="95%" stopColor="#B20B00" stopOpacity={0.3}/>
          </linearGradient>
          <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#28B463" stopOpacity={0.9}/>
            <stop offset="95%" stopColor="#28B463" stopOpacity={0.3}/>
          </linearGradient>
          <linearGradient id="colorDebt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FFC300" stopOpacity={0.9}/>
            <stop offset="95%" stopColor="#B27600" stopOpacity={0.3}/>
          </linearGradient>
          <linearGradient id="colorTech" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8E44AD" stopOpacity={0.9}/>
            <stop offset="95%" stopColor="#420061" stopOpacity={0.3}/>
          </linearGradient>
        </defs>
      </svg>

      {/* TOP BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Financial Command Center</h1>
          <p className="text-blue-200 text-sm">Operational visibility & audit trail</p>
        </div>
        <div className="bg-black/20 p-1 rounded-lg border border-white/10 flex gap-1">
          {[2024, 2025].map((y) => (
            <button
              key={y}
              onClick={() => setView(y as 2024 | 2025)}
              className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${
                view === y 
                  ? 'bg-[#1B5BCC] text-white shadow-lg shadow-blue-900/50' 
                  : 'text-blue-200 hover:text-white hover:bg-white/5'
              }`}
            >
              {y}
            </button>
          ))}
          <button
            onClick={() => setView('consolidated')}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all border-l border-white/10 ${
              view === 'consolidated' 
                ? 'bg-[#8E44AD] text-white shadow-lg shadow-purple-900/50' 
                : 'text-purple-200 hover:text-white hover:bg-purple-500/10'
            }`}
          >
            Consolidated
          </button>
        </div>
      </div>

      {/* HEADER STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Revenue" value={formatCurrency(totalRev)} sub="Actuals" color="text-[#28B463]" />
        <StatCard label="Total Expenses" value={formatCurrency(totalExp)} sub="Actuals" color="text-[#FF5252]" />
        <StatCard label="Net Margin" value={formatCurrency(netMargin)} sub={netMargin > 0 ? "Profitable" : "Burn Zone"} color={netMargin > 0 ? "text-[#28B463]" : "text-[#FFC300]"} />
        <StatCard label="Cash Runway" value={view === 2025 ? "Stabilizing" : "Critical"} sub="Restructuring" color="text-[#3498DB]" />
      </div>

      {/* MAIN CHART */}
      <div className="bg-black/20 border border-white/10 rounded-2xl p-6 mb-8 shadow-2xl relative overflow-hidden backdrop-blur-sm">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
          <span className="w-2 h-2 bg-[#28B463] rounded-full"/> Performance Trends {view === 'consolidated' ? '(2023 - 2025)' : `(${view})`}
        </h3>
        <div className="w-full h-[400px]">
          <BarChart
            dataset={currentData}
            xAxis={[{ 
              scaleType: 'band', 
              dataKey: 'month', 
              tickLabelStyle: { fill: '#E5E7EB', fontSize: view === 'consolidated' ? 10 : 12 } 
            }]}
            series={[
              { dataKey: 'revenue', label: 'Revenue', color: 'url(#colorRevenue)', stack: 'A' },
              { dataKey: 'expenses', label: 'Expenses', color: 'url(#colorExpense)', stack: 'B' },
            ]}
            yAxis={[{ tickLabelStyle: { fill: '#E5E7EB' } }]}
            {...commonChartProps}
          />
        </div>
      </div>

      {/* TABS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <TabCard id="health" active={activeTab === 'health'} onClick={() => setActiveTab('health')} icon={<Activity className="w-6 h-6 text-[#28B463]"/>} title="Business Health" value="GMV & Unit Econ" trend="Scale" />
        <TabCard id="expenses" active={activeTab === 'expenses'} onClick={() => setActiveTab('expenses')} icon={<PieChart className="w-6 h-6 text-[#3498DB]"/>} title="Expense Breakdown" value="Payroll & Tech" trend="Analysis" />
        <TabCard id="debt" active={activeTab === 'debt'} onClick={() => setActiveTab('debt')} icon={<CreditCard className="w-6 h-6 text-[#FFC300]"/>} title="Debt Management" value={breakdown.debt.bank} trend="Priority" />
      </div>

      {/* TAB CONTENT */}
      <AnimatePresence mode="wait">
        
        {/* 1. BUSINESS HEALTH */}
        {activeTab === 'health' && (
          <motion.div key="health" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            
            {/* GMV Overview */}
            <div className="bg-black/20 border border-white/10 rounded-2xl p-8 flex flex-col lg:flex-row gap-8 backdrop-blur-sm">
              <div className="flex-1 overflow-x-auto">
                <h3 className="text-xl font-bold text-white mb-2">Gross Merchandise Value (GMV) History</h3>
                <div className="h-[350px] min-w-[1000px] bg-black/30 rounded-xl border border-white/5 p-4">
                  <BarChart
                    dataset={GMV_DATA}
                    xAxis={[{ scaleType: 'band', dataKey: 'month', tickLabelStyle: { fill: '#E5E7EB', fontSize: 9, angle: -45, textAnchor: 'end' } }]}
                    series={[{ dataKey: 'gmv', label: 'GMV (SAR)', color: 'url(#colorProfit)' }]}
                    yAxis={[{ tickLabelStyle: { fill: '#E5E7EB' } }]}
                    {...commonChartProps}
                  />
                </div>
              </div>
              <div className="w-full lg:w-[300px] space-y-3">
                {Object.entries(GMV_SUMMARY).map(([yr, data]: any) => (
                  <div key={yr} className="p-4 bg-[#28B463]/10 border border-[#28B463]/20 rounded-xl">
                    <div className="text-xs text-[#28B463] uppercase font-bold">{yr} ({data.label})</div>
                    <div className="text-xl font-mono font-bold text-white">{data.total}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bookings & Ticket Size */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-black/20 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-white mb-2">Booking Volume</h3>
                  <div className="h-[300px] w-full bg-black/30 rounded-xl border border-white/5 p-4">
                      <BarChart
                      dataset={GMV_DATA}
                      xAxis={[{ scaleType: 'band', dataKey: 'month', tickLabelStyle: { fill: '#E5E7EB', fontSize: 10 } }]}
                      series={[{ dataKey: 'bookings', label: 'Count', color: 'url(#colorTech)' }]}
                      yAxis={[{ tickLabelStyle: { fill: '#E5E7EB' } }]}
                      {...commonChartProps}
                      />
                  </div>
                </div>
                <div className="bg-black/20 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-white mb-2">Avg. Ticket Size</h3>
                  <div className="h-[300px] w-full bg-black/30 rounded-xl border border-white/5 p-4">
                      <LineChart
                      dataset={TICKET_SIZE_DATA}
                      xAxis={[{ scaleType: 'point', dataKey: 'month', tickLabelStyle: { fill: '#E5E7EB', fontSize: 10 } }]}
                      series={[{ dataKey: 'ticket', label: 'SAR / Booking', color: '#FFC300', area: true, showMark: false }]}
                      yAxis={[{ tickLabelStyle: { fill: '#E5E7EB' } }]}
                      {...commonChartProps}
                      />
                  </div>
                </div>
            </div>

            {/* Unit Economics */}
            <div className="bg-black/20 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-2">Unit Economics: Revenue vs Cost</h3>
              <div className="h-[350px] w-full bg-black/30 rounded-xl border border-white/5 p-4">
                 <LineChart
                  dataset={TAKE_RATE_DATA}
                  xAxis={[{ scaleType: 'point', dataKey: 'month', tickLabelStyle: { fill: '#E5E7EB', fontSize: 10 } }]}
                  series={[
                    { dataKey: 'grossRevenue', label: 'Gross Revenue (Take Rate)', color: '#1B5BCC', showMark: false },
                    { dataKey: 'costOfRevenue', label: 'Gateway Cost', color: '#B20B00', showMark: false },
                    { dataKey: 'netRevenue', label: 'Net Profit Spread', color: '#28B463', area: true, showMark: false },
                  ]}
                  yAxis={[{ tickLabelStyle: { fill: '#E5E7EB' } }]}
                  {...commonChartProps}
                />
              </div>
            </div>

          </motion.div>
        )}

        {/* 2. EXPENSES */}
        {activeTab === 'expenses' && (
          <motion.div key="expenses" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-black/20 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-6">Cost Breakdown (Payroll vs Tech vs Ops)</h3>
            <div className="h-[400px] w-full bg-black/30 rounded-xl border border-white/5 p-4">
              <LineChart
                dataset={breakdown.expenses.chartData}
                xAxis={[{ scaleType: 'point', dataKey: 'month', tickLabelStyle: { fill: '#E5E7EB', fontSize: 10 } }]}
                series={[
                  { dataKey: 'payroll', label: 'Payroll', color: '#3498DB', showMark: false, curve: 'linear' },
                  { dataKey: 'tech', label: 'Tech', color: '#8E44AD', showMark: false, curve: 'linear' },
                  { dataKey: 'ops', label: 'Ops', color: '#B27600', showMark: false, curve: 'linear' },
                ]}
                yAxis={[{ tickLabelStyle: { fill: '#E5E7EB' } }]}
                {...commonChartProps}
              />
            </div>
          </motion.div>
        )}

        {/* 3. DEBT */}
        {activeTab === 'debt' && (
          <motion.div key="debt" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-black/20 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">Debt Trajectory</h3>
                <div className="h-[300px] w-full bg-black/30 rounded-xl border border-white/5 p-4">
                  <LineChart
                    dataset={DEBT_BALANCE_HISTORY}
                    xAxis={[{ scaleType: 'point', dataKey: 'month', tickLabelStyle: { fill: '#E5E7EB', fontSize: 10 } }]}
                    series={[{ dataKey: 'balance', label: 'Principal', color: '#FFC300', area: true, showMark: true }]}
                    yAxis={[{ tickLabelStyle: { fill: '#E5E7EB' } }]}
                    {...commonChartProps}
                  />
                </div>
              </div>
              <div className="w-full lg:w-[350px] space-y-4">
                <h3 className="text-xl font-bold text-white mb-4">Monthly Commitments</h3>
                <div className="h-[200px] w-full mb-4 bg-black/30 p-2 rounded-lg">
                   <BarChart
                    dataset={breakdown.debt.schedule}
                    xAxis={[{ scaleType: 'band', dataKey: 'month', tickLabelStyle: { fill: '#E5E7EB', fontSize: 8 } }]}
                    series={[
                      { dataKey: 'loan1', label: 'Loan 1', color: '#FFC300', stack: 'total' },
                      { dataKey: 'loan2', label: 'Loan 2', color: '#B27600', stack: 'total' },
                    ]}
                    {...commonChartProps}
                    margin={{ left: 0, right: 0, top: 10, bottom: 20 }}
                    slotProps={{ legend: { hidden: true } }}
                  />
                </div>
                {LOAN_DETAILS.map((loan, idx) => (
                  <div key={idx} className="p-4 bg-black/40 rounded-xl border border-white/10">
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-xs font-bold text-white">{loan.name}</div>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: loan.color }} />
                    </div>
                    <div className="text-lg font-mono font-bold text-white">
                      {loan.monthly} <span className="text-[10px] text-gray-400">SAR/mo</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

function StatCard({ label, value, sub, color }: any) {
  return (
    <div className="bg-black/20 border border-white/10 p-6 rounded-xl hover:bg-white/5 transition-colors">
      <div className="text-blue-200 text-xs uppercase font-bold tracking-wider mb-2">{label}</div>
      <div className={`text-2xl font-black mb-1 ${color}`}>{value}</div>
      <div className="text-xs text-blue-300 font-mono">{sub}</div>
    </div>
  );
}

function TabCard({ id, active, onClick, icon, title, value, trend }: any) {
  return (
    <button onClick={onClick} className={`group p-6 rounded-2xl border transition-all text-left relative overflow-hidden ${active ? 'bg-[#1B5BCC]/20 border-[#1B5BCC] ring-1 ring-[#1B5BCC]' : 'bg-black/20 border-white/10 hover:bg-white/5'}`}>
      {active && <div className="absolute top-0 left-0 w-1 h-full bg-[#1B5BCC]" />}
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg border ${active ? 'bg-[#1B5BCC]/20 border-[#1B5BCC]/30' : 'bg-black/40 border-white/5'}`}>{icon}</div>
        {active && <div className="text-xs font-bold text-[#3498DB] uppercase tracking-widest">Active</div>}
      </div>
      <div className="text-blue-200 text-sm font-medium mb-1">{title}</div>
      <div className="text-xl font-bold text-white mb-2">{value}</div>
      <div className="inline-flex items-center px-2 py-1 rounded bg-black/30 text-xs text-gray-400 border border-white/5">{trend}</div>
    </button>
  );
}