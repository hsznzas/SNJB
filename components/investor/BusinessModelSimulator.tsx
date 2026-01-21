'use client';

import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import { 
  Calculator, 
  TrendingUp,
  ChevronDown,
  Info,
  Building2,
  Target,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Slider } from '@/components/shared/ui/slider';

// --- TYPES ---
type OnlineRateOption = 4.9 | 7.9 | 9.9 | 12.5;
type OfflineRateOption = 0 | 5;
type B2BRateOption = 0 | 15 | 20;
type HorizonOption = 2025 | 2028;

interface SimulatorState {
  onlineRate: OnlineRateOption;
  offlineRate: OfflineRateOption;
  b2bRate: B2BRateOption;
  horizon: HorizonOption;
  includeLeadingClubs: boolean;
  growthRate: number; // -20 to +100 (annual)
}

interface DataPoint {
  year: number;
  displayYear: string;
  subscription: number;
  commission: number;
  offlineRevenue: number;
  b2bRevenue: number;
  totalRevenue: number;
  isProjection: boolean;
}

// --- CALIBRATED CONSTANTS ---
// Subscription Revenue: Fixed revenue from 140+ clubs
const BASE_SUBSCRIPTION_MONTHLY = 168000; // 140 Clubs × 1,200 SAR/month
const BASE_SUBSCRIPTION_ANNUAL = BASE_SUBSCRIPTION_MONTHLY * 12; // 2,016,000 SAR/year
const SUBSCRIPTION_GROWTH_RATE = 0.02; // 2% monthly growth (~27% annual)

// Commission Revenue: GMV-based (Take Rate applies here)
const BASE_COMMISSION_MONTHLY = 117000; // ~2.4M monthly GMV × 4.9%
const BASE_COMMISSION_ANNUAL = BASE_COMMISSION_MONTHLY * 12; // 1,404,000 SAR/year
const BASE_GMV_MONTHLY = 2400000; // ~2.4M SAR/month GMV

// Offline GMV (35% of total) - Take Rate applies here too
const OFFLINE_GMV_SPLIT = 0.35;
const BASE_OFFLINE_GMV_ANNUAL = BASE_GMV_MONTHLY * 12 * OFFLINE_GMV_SPLIT;

// B2B Volume
const B2B_ANNUAL_BASE_VOLUME = 600000; // 600k SAR/year
const B2B_ANNUAL_GROWTH_RATE = 0.80; // 80% annual growth

// Leading Clubs Boost
const LEADING_CLUBS_BOOST = 1.225; // +22.5%

// Verified 2025 YTD Actuals (Jan-Sep) - Source: Internal Financial Statement
const ACTUAL_YTD_2025 = 1448824; // SAR

// Historical Annual Revenue (verified)
const ANNUAL_REVENUE_HISTORICAL = {
  2023: 930500,  // ~930K SAR (Jul-Dec only)
  2024: 1987089, // ~1.99M SAR (full year at 4.9%)
};

// Saudi Reality Dec 2028 Terminal Monthly Targets (SAR/month)
const DEC_2028_TARGETS = {
  matchmaking: 120000,
  ads: 60000,
  ecommerce: 50000,
  tournaments: 20000,
  premiumListings: 48000,
  get corePadel() {
    return 600000 - (this.matchmaking + this.ads + this.ecommerce + this.tournaments + this.premiumListings);
  },
  total: 600000,
};

const ONLINE_RATE_OPTIONS: { value: OnlineRateOption; label: string }[] = [
  { value: 4.9, label: '4.9% (Current)' },
  { value: 7.9, label: '7.9%' },
  { value: 9.9, label: '9.9%' },
  { value: 12.5, label: '12.5%' },
];

// --- THEME ---
const THEME = {
  subscription: '#8b5cf6', // Purple (fixed)
  commission: '#3b82f6',   // Blue (variable)
  offline: '#f59e0b',      // Amber
  b2b: '#22c55e',          // Green
  historical: '#94a3b8',   // Gray
};

// --- CUSTOM TOOLTIP ---
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
    dataKey: string;
  }>;
  label?: string;
}

const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  
  const total = payload.reduce((sum, entry) => sum + (entry.value || 0), 0);
  
  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(2)}M SAR`;
    if (val >= 1000) return `${(val / 1000).toFixed(0)}K SAR`;
    return `${val.toLocaleString()} SAR`;
  };
  
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xl p-4 min-w-[220px]">
      <p className="font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">{label}</p>
      <div className="space-y-2">
        {payload.filter(entry => entry.value > 0).reverse().map((entry, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-slate-600">{entry.name}</span>
            </div>
            <span className="font-medium text-slate-900">{formatCurrency(entry.value)}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between">
        <span className="font-semibold text-slate-900">Total Revenue</span>
        <span className="font-bold text-emerald-600">{formatCurrency(total)}</span>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export const BusinessModelSimulator: React.FC = () => {
  const [state, setState] = useState<SimulatorState>({
    onlineRate: 4.9,
    offlineRate: 0,
    b2bRate: 15,
    horizon: 2025,
    includeLeadingClubs: false,
    growthRate: 0,
  });
  
  // Calculate chart data based on inputs (ANNUAL)
  const chartData = useMemo((): DataPoint[] => {
    const data: DataPoint[] = [];
    
    // Historical years (2023-2024) - Static revenue at 4.9%
    Object.entries(ANNUAL_REVENUE_HISTORICAL).forEach(([yearStr, revenue]) => {
      const year = parseInt(yearStr);
      data.push({
        year,
        displayYear: year.toString(),
        subscription: 0, // Historical didn't have subscription model
        commission: revenue,
        offlineRevenue: 0,
        b2bRevenue: 0,
        totalRevenue: revenue,
        isProjection: false,
      });
    });
    
    // 2025 - Calibrated baseline with new model
    const boostMultiplier = state.includeLeadingClubs ? LEADING_CLUBS_BOOST : 1;
    
    // Subscription stays fixed (doesn't respond to take rate)
    const subscription2025 = BASE_SUBSCRIPTION_ANNUAL * boostMultiplier;
    
    // Commission scales with take rate (user rate vs base 4.9%)
    const commissionMultiplier = state.onlineRate / 4.9;
    const commission2025 = BASE_COMMISSION_ANNUAL * commissionMultiplier * boostMultiplier;
    
    // Offline GMV with take rate
    const offline2025 = BASE_OFFLINE_GMV_ANNUAL * (state.offlineRate / 100) * boostMultiplier;
    
    // B2B
    const b2b2025 = B2B_ANNUAL_BASE_VOLUME * (state.b2bRate / 100);
    
    const total2025 = subscription2025 + commission2025 + offline2025 + b2b2025;
    
    data.push({
      year: 2025,
      displayYear: '2025',
      subscription: subscription2025,
      commission: commission2025,
      offlineRevenue: offline2025,
      b2bRevenue: b2b2025,
      totalRevenue: total2025,
      isProjection: true,
    });
    
    // Future years (2026-2028) - Apply annual growth rate
    if (state.horizon === 2028) {
      for (let year = 2026; year <= 2028; year++) {
        const yearsFromBase = year - 2025;
        const growthMultiplier = Math.pow(1 + state.growthRate / 100, yearsFromBase);
        
        // Subscription grows organically (2% MoM compound)
        const subscriptionGrowth = Math.pow(1 + SUBSCRIPTION_GROWTH_RATE * 12, yearsFromBase);
        const subscriptionYear = subscription2025 * subscriptionGrowth;
        
        // Commission grows with user-selected rate
        const commissionYear = commission2025 * growthMultiplier;
        
        // Offline grows with user rate
        const offlineYear = offline2025 * growthMultiplier;
        
        // B2B grows aggressively
        const b2bVolume = B2B_ANNUAL_BASE_VOLUME * Math.pow(1 + B2B_ANNUAL_GROWTH_RATE, yearsFromBase);
        const b2bYear = b2bVolume * (state.b2bRate / 100);
        
        const totalYear = subscriptionYear + commissionYear + offlineYear + b2bYear;
        
        data.push({
          year,
          displayYear: year.toString(),
          subscription: subscriptionYear,
          commission: commissionYear,
          offlineRevenue: offlineYear,
          b2bRevenue: b2bYear,
          totalRevenue: totalYear,
          isProjection: true,
        });
      }
    }
    
    return data;
  }, [state]);
  
  // Summary calculations
  const summary = useMemo(() => {
    const horizonYearData = chartData.find(d => d.year === state.horizon);
    
    const totalProjectedRevenue = horizonYearData?.totalRevenue || 0;
    const subscriptionRevenue = horizonYearData?.subscription || 0;
    const commissionRevenue = horizonYearData?.commission || 0;
    const offlineRevenue = horizonYearData?.offlineRevenue || 0;
    const b2bRevenue = horizonYearData?.b2bRevenue || 0;
    
    const subscriptionShare = totalProjectedRevenue > 0 ? (subscriptionRevenue / totalProjectedRevenue) * 100 : 0;
    const commissionShare = totalProjectedRevenue > 0 ? (commissionRevenue / totalProjectedRevenue) * 100 : 0;
    const offlineShare = totalProjectedRevenue > 0 ? (offlineRevenue / totalProjectedRevenue) * 100 : 0;
    const b2bShare = totalProjectedRevenue > 0 ? (b2bRevenue / totalProjectedRevenue) * 100 : 0;
    
    // 2025 Reality Check
    const projected2025Data = chartData.find(d => d.year === 2025);
    const projected2025Revenue = projected2025Data?.totalRevenue || 0;
    
    // Calculate Jan-Sep 2025 portion (9 months = 75% of annual)
    const projectedYTD2025 = projected2025Revenue * 0.75;
    const achievementPct = projectedYTD2025 > 0 ? (ACTUAL_YTD_2025 / projectedYTD2025) * 100 : 0;
    
    // Cumulative revenue
    const cumulativeRevenue = chartData
      .filter(d => d.year >= 2025 && d.year <= state.horizon)
      .reduce((sum, d) => sum + d.totalRevenue, 0);
    
    return {
      totalProjectedRevenue,
      subscriptionRevenue,
      commissionRevenue,
      offlineRevenue,
      b2bRevenue,
      subscriptionShare,
      commissionShare,
      offlineShare,
      b2bShare,
      actualYTD2025: ACTUAL_YTD_2025,
      projectedYTD2025,
      achievementPct,
      cumulativeRevenue,
    };
  }, [chartData, state.horizon]);
  
  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(2)}M SAR`;
    if (val >= 1000) return `${(val / 1000).toFixed(0)}K SAR`;
    return `${val.toLocaleString()} SAR`;
  };

  return (
    <div className="space-y-6">
      
      {/* Control Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Revenue Scenario Controls</h3>
            <p className="text-sm text-slate-500">Adjust take rates to model different business scenarios</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Online Take Rate */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: THEME.commission }} />
              <label className="text-sm font-medium text-slate-700">Commission Take Rate</label>
            </div>
            <div className="relative">
              <select
                value={state.onlineRate}
                onChange={(e) => setState({ ...state, onlineRate: parseFloat(e.target.value) as OnlineRateOption })}
                className="w-full h-11 px-4 pr-10 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
              >
                {ONLINE_RATE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <p className="text-xs text-slate-400 mt-2">Applies to GMV-based commission only</p>
          </div>
          
          {/* Offline Take Rate */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: THEME.offline }} />
              <label className="text-sm font-medium text-slate-700">Offline Take Rate</label>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setState({ ...state, offlineRate: 0 })}
                className={`flex-1 h-11 rounded-lg text-sm font-medium transition-all ${
                  state.offlineRate === 0 
                    ? 'bg-amber-500 text-white shadow-md' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                0% (Current)
              </button>
              <button
                onClick={() => setState({ ...state, offlineRate: 5 })}
                className={`flex-1 h-11 rounded-lg text-sm font-medium transition-all ${
                  state.offlineRate === 5 
                    ? 'bg-amber-500 text-white shadow-md' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                5%
              </button>
            </div>
          </div>
          
          {/* B2B Take Rate */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: THEME.b2b }} />
              <label className="text-sm font-medium text-slate-700">B2B Take Rate</label>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setState({ ...state, b2bRate: 0 })}
                className={`flex-1 h-11 rounded-lg text-sm font-medium transition-all ${
                  state.b2bRate === 0 
                    ? 'bg-slate-500 text-white shadow-md' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                0%
              </button>
              <button
                onClick={() => setState({ ...state, b2bRate: 15 })}
                className={`flex-1 h-11 rounded-lg text-sm font-medium transition-all ${
                  state.b2bRate === 15 
                    ? 'bg-emerald-500 text-white shadow-md' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                15%
              </button>
              <button
                onClick={() => setState({ ...state, b2bRate: 20 })}
                className={`flex-1 h-11 rounded-lg text-sm font-medium transition-all ${
                  state.b2bRate === 20 
                    ? 'bg-emerald-500 text-white shadow-md' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                20%
              </button>
            </div>
          </div>
          
          {/* Projection Horizon */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-slate-500" />
              <label className="text-sm font-medium text-slate-700">Projection Horizon</label>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setState({ ...state, horizon: 2025 })}
                className={`flex-1 h-11 rounded-lg text-sm font-medium transition-all ${
                  state.horizon === 2025 
                    ? 'bg-slate-800 text-white shadow-md' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                End of 2025
              </button>
              <button
                onClick={() => setState({ ...state, horizon: 2028 })}
                className={`flex-1 h-11 rounded-lg text-sm font-medium transition-all ${
                  state.horizon === 2028 
                    ? 'bg-slate-800 text-white shadow-md' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                End of 2028
              </button>
            </div>
          </div>
          
        </div>
        
        {/* Second Row: Leading Clubs Toggle & Growth Rate */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          
          {/* Leading Club's Revenue Toggle */}
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-4 h-4 text-amber-600" />
              <label className="text-sm font-medium text-amber-800">Leading Club&apos;s Revenue Impact</label>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setState({ ...state, includeLeadingClubs: false })}
                className={`flex-1 h-11 rounded-lg text-sm font-medium transition-all ${
                  !state.includeLeadingClubs 
                    ? 'bg-slate-600 text-white shadow-md' 
                    : 'bg-white border border-amber-200 text-slate-600 hover:bg-amber-100'
                }`}
              >
                Current (Without)
              </button>
              <button
                onClick={() => setState({ ...state, includeLeadingClubs: true })}
                className={`flex-1 h-11 rounded-lg text-sm font-medium transition-all ${
                  state.includeLeadingClubs 
                    ? 'bg-amber-500 text-white shadow-md' 
                    : 'bg-white border border-amber-200 text-slate-600 hover:bg-amber-100'
                }`}
              >
                +22.5% Recovery
              </button>
            </div>
            <p className="text-xs text-amber-700 mt-2">
              Models revenue recovery from leading clubs lost to Playtomic
            </p>
          </div>
          
          {/* Growth Rate Slider */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-slate-500" />
                <label className="text-sm font-medium text-slate-700">Annual Growth Rate</label>
              </div>
              <span className={`text-sm font-bold ${state.growthRate >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {state.growthRate > 0 ? '+' : ''}{state.growthRate}%
              </span>
            </div>
            <Slider
              value={[state.growthRate]}
              onValueChange={([rate]) => setState({ ...state, growthRate: rate })}
              min={-20}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-2">
              <span>-20%</span>
              <span>0%</span>
              <span>+100%</span>
            </div>
          </div>
          
        </div>
        
        {/* Formula explanation */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-slate-500">
            <strong>Revenue Model:</strong> Subscription (140 clubs × 1.2K SAR, <span className="text-purple-600">fixed</span>) + Commission (GMV × {state.onlineRate}%) + Offline (GMV × {state.offlineRate}%) + B2B ({state.b2bRate}%)
            {state.includeLeadingClubs && <span className="text-amber-600 font-medium">&nbsp;× 1.225 (Leading Clubs)</span>}
            {state.growthRate !== 0 && <span className={state.growthRate > 0 ? 'text-emerald-600 font-medium' : 'text-red-500 font-medium'}>&nbsp;× {state.growthRate > 0 ? '+' : ''}{state.growthRate}% YoY</span>}
          </p>
        </div>
      </motion.div>
      
      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
      >
        <h3 className="font-bold text-slate-900 mb-6">Revenue Mix Over Time</h3>
        
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient id="subscriptionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={THEME.subscription} stopOpacity={0.8}/>
                  <stop offset="100%" stopColor={THEME.subscription} stopOpacity={0.3}/>
                </linearGradient>
                <linearGradient id="commissionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={THEME.commission} stopOpacity={0.8}/>
                  <stop offset="100%" stopColor={THEME.commission} stopOpacity={0.3}/>
                </linearGradient>
                <linearGradient id="offlineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={THEME.offline} stopOpacity={0.8}/>
                  <stop offset="100%" stopColor={THEME.offline} stopOpacity={0.3}/>
                </linearGradient>
                <linearGradient id="b2bGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={THEME.b2b} stopOpacity={0.8}/>
                  <stop offset="100%" stopColor={THEME.b2b} stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              
              <XAxis 
                dataKey="displayYear" 
                tick={{ fontSize: 12, fill: '#64748b' }}
                tickLine={{ stroke: '#cbd5e1' }}
              />
              
              <YAxis 
                tickFormatter={(v) => v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : `${(v/1000).toFixed(0)}K`}
                tick={{ fontSize: 10, fill: '#64748b' }}
                tickLine={{ stroke: '#cbd5e1' }}
                width={55}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              {/* Reference line for projection start */}
              <ReferenceLine 
                x="2025" 
                stroke="#ef4444" 
                strokeDasharray="5 5" 
                strokeWidth={2}
                label={{ 
                  value: 'New Model →', 
                  position: 'top', 
                  fill: '#ef4444',
                  fontSize: 11,
                  fontWeight: 600
                }} 
              />
              
              <Area
                type="monotone"
                dataKey="subscription"
                stackId="1"
                stroke={THEME.subscription}
                fill="url(#subscriptionGradient)"
                name="Subscription (Fixed)"
              />
              
              <Area
                type="monotone"
                dataKey="commission"
                stackId="1"
                stroke={THEME.commission}
                fill="url(#commissionGradient)"
                name="Commission (Variable)"
              />
              
              <Area
                type="monotone"
                dataKey="offlineRevenue"
                stackId="1"
                stroke={THEME.offline}
                fill="url(#offlineGradient)"
                name="Offline Revenue"
              />
              
              <Area
                type="monotone"
                dataKey="b2bRevenue"
                stackId="1"
                stroke={THEME.b2b}
                fill="url(#b2bGradient)"
                name="B2B Revenue"
              />
              
              <Legend 
                wrapperStyle={{ paddingTop: 20 }}
                iconType="rect"
                iconSize={12}
                formatter={(value) => <span className="text-xs text-slate-600">{value}</span>}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Total Projected Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white"
        >
          <p className="text-slate-400 text-sm mb-1">Total Revenue ({state.horizon})</p>
          <p className="text-3xl font-black">{formatCurrency(summary.totalProjectedRevenue)}</p>
          <p className="text-xs text-slate-400 mt-2">Annual projection</p>
        </motion.div>
        
        {/* Subscription Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="bg-white border border-slate-200 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: THEME.subscription }} />
            <p className="text-slate-500 text-sm">Subscription</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(summary.subscriptionRevenue)}</p>
          <p className="text-xs text-purple-600 mt-2">{summary.subscriptionShare.toFixed(1)}% • Fixed</p>
        </motion.div>
        
        {/* Commission Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-200 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: THEME.commission }} />
            <p className="text-slate-500 text-sm">Commission ({state.onlineRate}%)</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(summary.commissionRevenue)}</p>
          <p className="text-xs text-blue-600 mt-2">{summary.commissionShare.toFixed(1)}% • Variable</p>
        </motion.div>
        
        {/* Offline Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="bg-white border border-slate-200 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: THEME.offline }} />
            <p className="text-slate-500 text-sm">Offline ({state.offlineRate}%)</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(summary.offlineRevenue)}</p>
          <p className="text-xs text-amber-600 mt-2">{summary.offlineShare.toFixed(1)}% of total</p>
        </motion.div>
        
        {/* B2B Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-slate-200 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: THEME.b2b }} />
            <p className="text-slate-500 text-sm">B2B ({state.b2bRate}%)</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(summary.b2bRevenue)}</p>
          <p className="text-xs text-emerald-600 mt-2">{summary.b2bShare.toFixed(1)}% of total</p>
        </motion.div>
        
      </div>
      
      {/* 2025 Reality Check */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`border rounded-2xl p-6 ${
          summary.achievementPct >= 100 
            ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200' 
            : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'
        }`}
      >
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
            summary.achievementPct >= 100 ? 'bg-emerald-100' : 'bg-amber-100'
          }`}>
            <Target className={`w-6 h-6 ${summary.achievementPct >= 100 ? 'text-emerald-600' : 'text-amber-600'}`} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-slate-900 mb-2">2025 Performance Reality Check (Jan-Sep YTD)</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Actual Revenue YTD</p>
                <p className="text-xl font-bold text-slate-900">{formatCurrency(summary.actualYTD2025)}</p>
                <p className="text-xs text-slate-400">Jan-Sep 2025 Verified</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Projected YTD</p>
                <p className="text-xl font-bold text-blue-600">{formatCurrency(summary.projectedYTD2025)}</p>
                <p className="text-xs text-slate-400">Based on simulator</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Achievement</p>
                <p className={`text-xl font-bold ${
                  summary.achievementPct >= 100 ? 'text-emerald-600' : 
                  summary.achievementPct >= 80 ? 'text-amber-600' : 'text-red-600'
                }`}>
                  {summary.achievementPct.toFixed(1)}%
                </p>
                <p className="text-xs text-slate-400">
                  {summary.achievementPct >= 100 ? 'Exceeding target' : 
                   summary.achievementPct >= 80 ? 'On track' : 'Below projection'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Cumulative ({state.horizon})</p>
                <p className="text-xl font-bold text-emerald-600">{formatCurrency(summary.cumulativeRevenue)}</p>
                <p className="text-xs text-slate-400">Total projected</p>
              </div>
            </div>
            
            {/* Contextual Message */}
            <div className={`mt-4 p-3 rounded-lg ${
              summary.achievementPct >= 100 ? 'bg-emerald-100/50' : 'bg-amber-100/50'
            }`}>
              <p className="text-sm text-slate-700">
                {summary.achievementPct >= 100 ? (
                  <>
                    <strong className="text-emerald-700">Strong Performance:</strong> We achieved {summary.achievementPct.toFixed(0)}% of our projected targets for Jan-Sep 2025.
                  </>
                ) : (
                  <>
                    <strong className="text-amber-700">Note:</strong> We achieved {summary.achievementPct.toFixed(0)}% of our aggressive 2025 targets. The gap reflects the new subscription + commission model which has higher baseline projections.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Dec 2028 Saudi Reality Targets */}
      {state.horizon === 2028 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border border-slate-200 rounded-2xl p-6"
        >
          <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Dec 2028 Monthly Revenue Target: {formatCurrency(DEC_2028_TARGETS.total)}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-xs text-blue-600 font-medium mb-1">Core Padel</p>
              <p className="text-lg font-bold text-slate-900">{formatCurrency(DEC_2028_TARGETS.corePadel)}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <p className="text-xs text-purple-600 font-medium mb-1">Matchmaking</p>
              <p className="text-lg font-bold text-slate-900">{formatCurrency(DEC_2028_TARGETS.matchmaking)}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 text-center">
              <p className="text-xs text-orange-600 font-medium mb-1">Ads</p>
              <p className="text-lg font-bold text-slate-900">{formatCurrency(DEC_2028_TARGETS.ads)}</p>
            </div>
            <div className="bg-teal-50 rounded-lg p-3 text-center">
              <p className="text-xs text-teal-600 font-medium mb-1">E-commerce</p>
              <p className="text-lg font-bold text-slate-900">{formatCurrency(DEC_2028_TARGETS.ecommerce)}</p>
            </div>
            <div className="bg-pink-50 rounded-lg p-3 text-center">
              <p className="text-xs text-pink-600 font-medium mb-1">Tournaments</p>
              <p className="text-lg font-bold text-slate-900">{formatCurrency(DEC_2028_TARGETS.tournaments)}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <p className="text-xs text-slate-600 font-medium mb-1">Premium (8×6k)</p>
              <p className="text-lg font-bold text-slate-900">{formatCurrency(DEC_2028_TARGETS.premiumListings)}</p>
            </div>
          </div>
        </motion.div>
      )}
      
    </div>
  );
};

export default BusinessModelSimulator;
