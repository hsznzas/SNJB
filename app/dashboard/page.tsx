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
  TICKET_SIZE_DATA,
  USER_TRACTION_DATA
} from '@/data/dashboard-data';
import { Info } from 'lucide-react';
import { motion } from 'framer-motion';

// ============================================
// THEME CONFIGURATION - Edit colors here
// ============================================
const THEME = {
  background: {
    deepVoid: '#030014',
    midnightBlue: '#0F0728',
    cardGlass: 'rgba(0, 0, 0, 0.4)',
  },
  accent: {
    neonPurple: '#7C3AED',
    cyan: '#00D2FF',
    softPink: '#F472B6',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#94A3B8',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: 'rgba(255, 255, 255, 0.08)',
    hoverShadow: '0 0 40px rgba(124, 58, 237, 0.3)',
  },
  chart: {
    revenue: '#7C3AED',
    expense: '#F472B6',
    profit: '#00D2FF',
    debt: '#FFA500',
    tech: '#8B5CF6',
    grid: 'rgba(148, 163, 184, 0.05)',
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Chart metadata for tooltips
const CHART_INFO = {
  performance: {
    calculation: "Revenue - Expenses = Net Margin",
    source: "Stripe API + Internal Ledger"
  },
  gmv: {
    calculation: "Sum of all booking values (Gross)",
    source: "Booking Engine Database"
  },
  userTraction: {
    calculation: "New Signups + Active Users + Capacity %",
    source: "User Analytics Platform"
  },
  bookingVolume: {
    calculation: "Count of completed bookings",
    source: "Booking Engine Database"
  },
  ticketSize: {
    calculation: "Average Booking Value (GMV / Bookings)",
    source: "Booking Engine Database"
  },
  unitEconomics: {
    calculation: "Take Rate - Payment Gateway Fees",
    source: "Stripe + Internal Calculations"
  },
  expenses: {
    calculation: "Payroll + Tech Stack + Operations",
    source: "Quickbooks + Cloud Billing"
  },
  debt: {
    calculation: "Principal Balance Over Time",
    source: "Bank Statements"
  }
};

// Common Chart Styles - Minimalist Mixpanel Style
const commonChartProps = {
  grid: { horizontal: true },
  margin: { top: 20, bottom: 40, left: 100, right: 20 },
  slotProps: { 
    legend: { 
      labelStyle: { fontSize: 12, fill: THEME.text.secondary },
      itemMarkWidth: 10,
      itemMarkHeight: 10,
    } as any
  },
  sx: {
    '.MuiChartsLegend-root text': { fill: `${THEME.text.secondary} !important` }, 
    '.MuiChartsLegend-series text': { fill: `${THEME.text.secondary} !important` }, 
    '.MuiChartsAxis-tickLabel': { fill: `${THEME.text.secondary} !important`, fontSize: 11 },
    '.MuiChartsAxis-line': { stroke: `${THEME.chart.grid} !important`, strokeOpacity: 0.5 },
    '.MuiChartsAxis-tick': { stroke: `${THEME.chart.grid} !important`, strokeOpacity: 0.3 },
    '.MuiChartsGrid-line': { stroke: `${THEME.chart.grid} !important`, strokeOpacity: 1 },
  }
};

// Info Tooltip Component
function InfoTooltip({ info }: { info: { calculation: string; source: string } }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block ml-2">
      <button
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="text-purple-400 hover:text-cyan-400 transition-colors"
        aria-label="Info"
      >
        <Info className="w-4 h-4" />
      </button>
      
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-0 top-full mt-2 z-50 w-72 p-4 rounded-2xl border backdrop-blur-xl"
          style={{
            background: 'rgba(15, 7, 40, 0.95)',
            borderColor: THEME.card.border,
            boxShadow: '0 20px 60px rgba(124, 58, 237, 0.4)',
          }}
        >
          <div className="space-y-3">
            <div>
              <div className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-1">
                Calculation
              </div>
              <div className="text-sm text-white font-mono">
                {info.calculation}
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
            <div>
              <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-1">
                Source
              </div>
              <div className="text-sm text-gray-300">
                {info.source}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function FinancialDashboard() {
  const [view, setView] = useState<2024 | 2025 | 'consolidated'>('consolidated');
  
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
    <div 
      className="min-h-screen text-white p-4 md:p-12 font-sans relative overflow-x-hidden"
      style={{
        background: `linear-gradient(180deg, ${THEME.background.deepVoid} 0%, ${THEME.background.midnightBlue} 100%)`,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
      }}
    >
      {/* Dot Grid Background */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(124, 58, 237, 0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
        }}
      />
      
      {/* Glowing Orb */}
      <div 
        className="fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: '800px',
          height: '800px',
          background: `radial-gradient(circle, ${THEME.accent.neonPurple}30 0%, transparent 70%)`,
          filter: 'blur(80px)',
          opacity: 0.4,
        }}
      />

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: ${THEME.background.deepVoid};
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, ${THEME.accent.neonPurple} 0%, ${THEME.accent.cyan} 100%);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${THEME.accent.neonPurple};
        }
      `}</style>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto relative z-10">
        {/* GRADIENTS */}
        <svg height={0} width={0}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={THEME.chart.revenue} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={THEME.chart.revenue} stopOpacity={0.2}/>
            </linearGradient>
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={THEME.chart.expense} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={THEME.chart.expense} stopOpacity={0.2}/>
            </linearGradient>
            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={THEME.chart.profit} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={THEME.chart.profit} stopOpacity={0.2}/>
            </linearGradient>
            <linearGradient id="colorDebt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={THEME.chart.debt} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={THEME.chart.debt} stopOpacity={0.2}/>
            </linearGradient>
            <linearGradient id="colorTech" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={THEME.chart.tech} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={THEME.chart.tech} stopOpacity={0.2}/>
            </linearGradient>
          </defs>
        </svg>

        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 
              className="text-5xl font-black mb-2"
              style={{ 
                background: `linear-gradient(135deg, ${THEME.text.primary} 0%, ${THEME.accent.cyan} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Financial Analytics
            </h1>
            <p className="text-lg" style={{ color: THEME.text.secondary }}>
              Real-time insights • Operational intelligence
            </p>
          </div>
          <div 
            className="p-1.5 rounded-2xl border flex gap-1.5 backdrop-blur-xl"
            style={{
              background: THEME.card.background,
              borderColor: THEME.card.border,
            }}
          >
            {[2024, 2025].map((y) => (
              <button
                key={y}
                onClick={() => setView(y as 2024 | 2025)}
                className="px-6 py-3 rounded-xl text-sm font-bold transition-all"
                style={{
                  background: view === y ? THEME.accent.neonPurple : 'transparent',
                  color: view === y ? THEME.text.primary : THEME.text.secondary,
                  boxShadow: view === y ? `0 8px 32px ${THEME.accent.neonPurple}50` : 'none',
                }}
              >
                {y}
              </button>
            ))}
            <button
              onClick={() => setView('consolidated')}
              className="px-6 py-3 rounded-xl text-sm font-bold transition-all"
              style={{
                background: view === 'consolidated' ? THEME.accent.cyan : 'transparent',
                color: view === 'consolidated' ? THEME.text.primary : THEME.text.secondary,
                boxShadow: view === 'consolidated' ? `0 8px 32px ${THEME.accent.cyan}50` : 'none',
              }}
            >
              All Time
            </button>
          </div>
        </div>

        {/* HEADER STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <StatCard 
            label="Total Revenue" 
            value={formatCurrency(totalRev)} 
            sub="Actuals" 
            accentColor={THEME.accent.neonPurple} 
          />
          <StatCard 
            label="Total Expenses" 
            value={formatCurrency(totalExp)} 
            sub="Actuals" 
            accentColor={THEME.chart.expense} 
          />
          <StatCard 
            label="Net Margin" 
            value={formatCurrency(netMargin)} 
            sub={netMargin > 0 ? "Profitable" : "Burn Zone"} 
            accentColor={netMargin > 0 ? THEME.chart.profit : THEME.chart.debt} 
          />
          <StatCard 
            label="Cash Runway" 
            value={view === 2025 ? "Stabilizing" : "Critical"} 
            sub="Status" 
            accentColor={THEME.accent.cyan} 
          />
        </div>

        {/* ==================== SECTION: PERFORMANCE OVERVIEW ==================== */}
        <SectionDivider />
        <div 
          className="rounded-3xl p-8 mb-16 relative overflow-hidden backdrop-blur-xl border transition-all duration-300 hover:shadow-2xl"
          style={{
            background: THEME.card.background,
            borderColor: THEME.card.border,
          }}
          onMouseEnter={(e) => e.currentTarget.style.boxShadow = THEME.card.hoverShadow}
          onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center text-white">
            Performance Trends {view === 'consolidated' ? '(2023 - 2025)' : `(${view})`}
            <InfoTooltip info={CHART_INFO.performance} />
          </h3>
          <div className="w-full h-[400px]">
            <BarChart
              dataset={currentData}
              xAxis={[{ 
                scaleType: 'band', 
                dataKey: 'month', 
                tickLabelStyle: { fill: THEME.text.secondary, fontSize: view === 'consolidated' ? 10 : 12 } 
              }]}
              series={[
                { dataKey: 'revenue', label: 'Revenue', color: 'url(#colorRevenue)', stack: 'A' },
                { dataKey: 'expenses', label: 'Expenses', color: 'url(#colorExpense)', stack: 'B' },
              ]}
              yAxis={[{ tickLabelStyle: { fill: THEME.text.secondary } }]}
              {...commonChartProps}
            />
          </div>
        </div>

        {/* ==================== SECTION: BUSINESS HEALTH ==================== */}
        <SectionDivider />
        <div className="mb-16">
          {/* GMV Overview */}
          <ChartCard title="Gross Merchandise Value (GMV)" info={CHART_INFO.gmv}>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 overflow-x-auto">
                <div className="h-[350px] min-w-[900px]">
                  <BarChart
                    dataset={GMV_DATA}
                    xAxis={[{ scaleType: 'band', dataKey: 'month', tickLabelStyle: { fill: THEME.text.secondary, fontSize: 9, angle: -45, textAnchor: 'end' } }]}
                    series={[{ dataKey: 'gmv', label: 'GMV (SAR)', color: 'url(#colorProfit)' }]}
                    yAxis={[{ tickLabelStyle: { fill: THEME.text.secondary } }]}
                    {...commonChartProps}
                  />
                </div>
              </div>
              <div className="w-full lg:w-[280px] space-y-3">
                {Object.entries(GMV_SUMMARY).map(([yr, data]: any) => (
                  <div 
                    key={yr} 
                    className="p-4 rounded-2xl border backdrop-blur-sm"
                    style={{
                      background: `${THEME.chart.profit}15`,
                      borderColor: `${THEME.chart.profit}30`,
                    }}
                  >
                    <div className="text-xs uppercase font-bold" style={{ color: THEME.chart.profit }}>
                      {yr} ({data.label})
                    </div>
                    <div className="text-2xl font-black mt-1 text-white">{data.total}</div>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>

          {/* USER GROWTH & UTILIZATION */}
          <ChartCard title="User Traction & Utilization" subtitle="New acquisition, active retention, and capacity utilization" info={CHART_INFO.userTraction}>
            <div className="h-[400px] w-full overflow-x-auto">
              <div className="min-w-[900px] h-full">
                <LineChart
                  dataset={USER_TRACTION_DATA}
                  xAxis={[{ scaleType: 'point', dataKey: 'month', tickLabelStyle: { fill: THEME.text.secondary, fontSize: 10 } }]}
                  series={[
                    { dataKey: 'newUsers', label: 'New Players', color: THEME.accent.cyan, showMark: false, area: true },
                    { dataKey: 'activeUsers', label: 'Active/Returning', color: THEME.chart.revenue, showMark: false, area: true },
                    { dataKey: 'utilization', label: 'Utilization %', color: THEME.chart.debt, yAxisId: 'rightAxis', showMark: false } as any,
                  ]}
                  yAxis={[
                    { id: 'leftAxis', tickLabelStyle: { fill: THEME.text.secondary } },
                    { id: 'rightAxis', position: 'right', tickLabelStyle: { fill: THEME.chart.debt }, min: 0, max: 100 } as any
                  ]}
                  {...commonChartProps}
                />
              </div>
            </div>
          </ChartCard>

          {/* Booking Volume + Ticket Size */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Booking Volume" info={CHART_INFO.bookingVolume}>
              <div className="h-[300px] w-full">
                <BarChart
                  dataset={GMV_DATA}
                  xAxis={[{ scaleType: 'band', dataKey: 'month', tickLabelStyle: { fill: THEME.text.secondary, fontSize: 10 } }]}
                  series={[{ dataKey: 'bookings', label: 'Count', color: 'url(#colorTech)' }]}
                  yAxis={[{ tickLabelStyle: { fill: THEME.text.secondary } }]}
                  {...commonChartProps}
                />
              </div>
            </ChartCard>
            <ChartCard title="Avg. Ticket Size" info={CHART_INFO.ticketSize}>
              <div className="h-[300px] w-full">
                <LineChart
                  dataset={TICKET_SIZE_DATA}
                  xAxis={[{ scaleType: 'point', dataKey: 'month', tickLabelStyle: { fill: THEME.text.secondary, fontSize: 10 } }]}
                  series={[{ dataKey: 'ticket', label: 'SAR / Booking', color: THEME.chart.debt, area: true, showMark: false }]}
                  yAxis={[{ tickLabelStyle: { fill: THEME.text.secondary } }]}
                  {...commonChartProps}
                />
              </div>
            </ChartCard>
          </div>

          {/* Unit Economics */}
          <ChartCard title="Unit Economics: Revenue vs Cost" info={CHART_INFO.unitEconomics}>
            <div className="h-[350px] w-full">
              <LineChart
                dataset={TAKE_RATE_DATA}
                xAxis={[{ scaleType: 'point', dataKey: 'month', tickLabelStyle: { fill: THEME.text.secondary, fontSize: 10 } }]}
                series={[
                  { dataKey: 'grossRevenue', label: 'Gross Revenue (Take Rate)', color: THEME.chart.revenue, showMark: false },
                  { dataKey: 'costOfRevenue', label: 'Gateway Cost', color: THEME.chart.expense, showMark: false },
                  { dataKey: 'netRevenue', label: 'Net Profit Spread', color: THEME.chart.profit, area: true, showMark: false },
                ]}
                yAxis={[{ tickLabelStyle: { fill: THEME.text.secondary } }]}
                {...commonChartProps}
              />
            </div>
          </ChartCard>
        </div>

        {/* ==================== SECTION: EXPENSES ==================== */}
        <SectionDivider />
        <ChartCard title="Cost Breakdown (Payroll vs Tech vs Ops)" info={CHART_INFO.expenses} className="mb-16">
          <div className="h-[400px] w-full">
            <LineChart
              dataset={'chartData' in breakdown.expenses ? breakdown.expenses.chartData : []}
              xAxis={[{ scaleType: 'point', dataKey: 'month', tickLabelStyle: { fill: THEME.text.secondary, fontSize: 10 } }]}
              series={[
                { dataKey: 'payroll', label: 'Payroll', color: THEME.accent.cyan, showMark: false, curve: 'linear' },
                { dataKey: 'tech', label: 'Tech', color: THEME.chart.tech, showMark: false, curve: 'linear' },
                { dataKey: 'ops', label: 'Ops', color: THEME.chart.debt, showMark: false, curve: 'linear' },
              ]}
              yAxis={[{ tickLabelStyle: { fill: THEME.text.secondary } }]}
              {...commonChartProps}
            />
          </div>
        </ChartCard>

        {/* ==================== SECTION: DEBT ==================== */}
        <SectionDivider />
        <ChartCard title="Debt Management" info={CHART_INFO.debt} className="mb-16">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <h4 className="text-lg font-bold mb-4" style={{ color: THEME.text.primary }}>
                Debt Trajectory
              </h4>
              <div className="h-[300px] w-full">
                <LineChart
                  dataset={DEBT_BALANCE_HISTORY}
                  xAxis={[{ scaleType: 'point', dataKey: 'month', tickLabelStyle: { fill: THEME.text.secondary, fontSize: 10 } }]}
                  series={[{ dataKey: 'balance', label: 'Principal', color: THEME.chart.debt, area: true, showMark: true }]}
                  yAxis={[{ tickLabelStyle: { fill: THEME.text.secondary } }]}
                  {...commonChartProps}
                />
              </div>
            </div>
            <div className="w-full lg:w-[350px] space-y-4">
              <h4 className="text-lg font-bold" style={{ color: THEME.text.primary }}>
                Monthly Commitments
              </h4>
              <div className="h-[200px] w-full mb-4">
                <BarChart
                  dataset={'schedule' in breakdown.debt ? breakdown.debt.schedule : []}
                  xAxis={[{ scaleType: 'band', dataKey: 'month', tickLabelStyle: { fill: THEME.text.secondary, fontSize: 8 } }]}
                  series={[
                    { dataKey: 'loan1', label: 'Loan 1', color: THEME.chart.debt, stack: 'total' },
                    { dataKey: 'loan2', label: 'Loan 2', color: THEME.chart.tech, stack: 'total' },
                  ]}
                  {...commonChartProps}
                  margin={{ left: 0, right: 0, top: 10, bottom: 20 }}
                  slotProps={{ legend: {} } as any}
                />
              </div>
              {LOAN_DETAILS.map((loan, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-2xl border backdrop-blur-sm"
                  style={{
                    background: THEME.card.background,
                    borderColor: THEME.card.border,
                  }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="text-xs font-bold text-white">{loan.name}</div>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: loan.color }} />
                  </div>
                  <div className="text-lg font-mono font-bold text-white">
                    {loan.monthly} <span className="text-[10px]" style={{ color: THEME.text.secondary }}>SAR/mo</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

// ============================================
// HELPER COMPONENTS
// ============================================

function StatCard({ label, value, sub, accentColor }: any) {
  return (
    <div 
      className="p-6 rounded-3xl backdrop-blur-xl border transition-all duration-300 group cursor-default"
      style={{
        background: THEME.card.background,
        borderColor: THEME.card.border,
      }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = THEME.card.hoverShadow}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
    >
      <div 
        className="text-xs uppercase font-bold tracking-wider mb-3"
        style={{ color: THEME.text.secondary }}
      >
        {label}
      </div>
      <div 
        className="text-4xl font-black mb-2"
        style={{ color: accentColor }}
      >
        {value}
      </div>
      <div 
        className="text-sm"
        style={{ color: THEME.text.secondary }}
      >
        {sub}
      </div>
    </div>
  );
}

function SectionDivider() {
  return (
    <div className="my-16 h-px relative">
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${THEME.accent.neonPurple}40 50%, transparent 100%)`,
        }}
      />
    </div>
  );
}

function ChartCard({ 
  title, 
  subtitle, 
  info, 
  children, 
  className = '' 
}: { 
  title: string; 
  subtitle?: string; 
  info: { calculation: string; source: string }; 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div 
      className={`rounded-3xl p-8 backdrop-blur-xl border transition-all duration-300 ${className}`}
      style={{
        background: THEME.card.background,
        borderColor: THEME.card.border,
      }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = THEME.card.hoverShadow}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
    >
      <div className="mb-6">
        <h3 className="text-2xl font-bold flex items-center text-white">
          {title}
          <InfoTooltip info={info} />
        </h3>
        {subtitle && (
          <p className="text-sm mt-1" style={{ color: THEME.text.secondary }}>
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}