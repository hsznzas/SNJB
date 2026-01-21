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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/shared/ui/card';
import { 
  TrendingUp, 
  Settings2, 
  DollarSign,
  Layers,
  ChevronDown,
  ChevronUp,
  Building2,
  Users,
  Globe,
  RotateCcw
} from 'lucide-react';
import {
  HISTORICAL_DATA,
  PROJECTION_DATA,
  MONTHLY_DATES,
  STREAM_CONFIGS,
  StreamId,
} from './FinancialScenarioPlanner';

// ============================================================================
// TYPES
// ============================================================================

interface MacroDataPoint {
  date: string;
  displayDate: string;
  baseRevenue: number;
  commissionLift: number;
  offlineRevenue: number;
  b2bRevenue: number;
  total: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const ONLINE_TAKE_RATES = [
  { value: 4.9, label: '4.9% (Default)' },
  { value: 7.9, label: '7.9%' },
  { value: 9.9, label: '9.9%' },
  { value: 12.5, label: '12.5%' },
];

const OFFLINE_GMV_BASE = 500000; // 500k SAR/month baseline offline GMV
const B2B_BASE_VOLUME = 50000; // 50k SAR/month B2B base

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)}M SAR`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K SAR`;
  }
  return `${value.toLocaleString()} SAR`;
};

const formatShortCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toString();
};

const getDisplayDate = (dateStr: string): string => {
  const [year, month] = dateStr.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(month) - 1]} ${year.slice(2)}`;
};

const getMonthIndex = (dateStr: string): number => MONTHLY_DATES.indexOf(dateStr);

// ============================================================================
// CUSTOM TOOLTIP
// ============================================================================

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    color: string;
    name: string;
  }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  
  const total = payload.reduce((sum, entry) => sum + (entry.value || 0), 0);
  
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xl p-4 min-w-[220px]">
      <p className="font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">{label}</p>
      <div className="space-y-1.5">
        {payload.filter(entry => entry.value > 0).reverse().map((entry, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-slate-600">{entry.name}</span>
            </div>
            <span className="font-medium text-slate-900">{formatShortCurrency(entry.value)}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between">
        <span className="font-semibold text-slate-900">Total</span>
        <span className="font-bold text-slate-900">{formatCurrency(total)}</span>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const MacroBusinessModel: React.FC = () => {
  // Macro Controls State
  const [onlineTakeRate, setOnlineTakeRate] = useState<number>(4.9);
  const [offlineTakeRate, setOfflineTakeRate] = useState<boolean>(false); // 0% vs 5%
  const [b2bTakeRate, setB2bTakeRate] = useState<boolean>(false); // 15% vs 20%
  const [horizon, setHorizon] = useState<'2025' | '2028'>('2028');
  const [showControls, setShowControls] = useState(true);

  // Calculate chart data based on macro levers
  const chartData = useMemo((): MacroDataPoint[] => {
    // Filter dates based on horizon
    const endYear = horizon === '2025' ? '2025' : '2028';
    const filteredDates = MONTHLY_DATES.filter(date => {
      const year = parseInt(date.split('-')[0]);
      return year >= 2023 && year <= parseInt(endYear);
    });

    return filteredDates.map((date, index) => {
      // Get base commission from historical/projection data
      const baseCommission = HISTORICAL_DATA.padelCommission[date] || 
                          PROJECTION_DATA.padelCommission[date] || 0;
      
      // Add other existing streams
      const otherStreams = ['padelSubscription', 'premiumListings'] as StreamId[];
      const otherRevenue = otherStreams.reduce((sum, streamId) => {
        return sum + (HISTORICAL_DATA[streamId]?.[date] || PROJECTION_DATA[streamId]?.[date] || 0);
      }, 0);

      // Calculate base revenue (at 4.9% take rate)
      const baseRevenue = baseCommission + otherRevenue;

      // Calculate commission lift from higher take rate
      // Logic: Multiply Commission by (SelectedRate / 4.9)
      const commissionMultiplier = onlineTakeRate / 4.9;
      const commissionLift = baseCommission * (commissionMultiplier - 1);

      // Calculate offline revenue (5% of offline GMV if enabled)
      // Offline GMV grows over time
      const monthsFromStart = index;
      const offlineGmvGrowth = 1 + (monthsFromStart * 0.02); // 2% monthly growth
      const offlineGmv = OFFLINE_GMV_BASE * offlineGmvGrowth;
      const offlineRevenue = offlineTakeRate ? offlineGmv * 0.05 : 0;

      // Calculate B2B revenue
      // Logic: B2B base volume * take rate (15% or 20%)
      // B2B volume also grows over time after 2025
      const year = parseInt(date.split('-')[0]);
      const b2bGrowthMultiplier = year >= 2026 ? 1 + ((year - 2025) * 0.5) : 0.5;
      const b2bVolume = B2B_BASE_VOLUME * b2bGrowthMultiplier;
      const b2bRate = b2bTakeRate ? 0.20 : 0.15;
      const b2bRevenue = year >= 2025 ? b2bVolume * b2bRate : 0;

      const total = baseRevenue + commissionLift + offlineRevenue + b2bRevenue;

      return {
        date,
        displayDate: getDisplayDate(date),
        baseRevenue,
        commissionLift: Math.max(0, commissionLift),
        offlineRevenue,
        b2bRevenue,
        total,
      };
    });
  }, [onlineTakeRate, offlineTakeRate, b2bTakeRate, horizon]);

  // Summary metrics
  const summary = useMemo(() => {
    const baseScenario = chartData.map(d => d.baseRevenue);
    const stressScenario = chartData.map(d => d.total);
    
    const totalBaseRevenue = baseScenario.reduce((sum, v) => sum + v, 0);
    const totalStressRevenue = stressScenario.reduce((sum, v) => sum + v, 0);
    const revenueUplift = totalStressRevenue - totalBaseRevenue;
    const upliftPercentage = totalBaseRevenue > 0 ? (revenueUplift / totalBaseRevenue) * 100 : 0;

    // Calculate new revenue streams contribution
    const commissionLiftTotal = chartData.reduce((sum, d) => sum + d.commissionLift, 0);
    const offlineTotal = chartData.reduce((sum, d) => sum + d.offlineRevenue, 0);
    const b2bTotal = chartData.reduce((sum, d) => sum + d.b2bRevenue, 0);

    return {
      totalBaseRevenue,
      totalStressRevenue,
      revenueUplift,
      upliftPercentage,
      commissionLiftTotal,
      offlineTotal,
      b2bTotal,
    };
  }, [chartData]);

  // Reset to defaults
  const handleReset = () => {
    setOnlineTakeRate(4.9);
    setOfflineTakeRate(false);
    setB2bTakeRate(false);
    setHorizon('2028');
  };

  return (
    <div className="space-y-6">
      {/* Main Chart Card */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                Macro Business Model Simulator
              </CardTitle>
              <CardDescription className="mt-2 text-slate-500">
                Stress-test revenue under different take rate and expansion scenarios
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowControls(!showControls)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors"
              >
                <Settings2 className="w-4 h-4" />
                {showControls ? 'Hide' : 'Show'} Controls
                {showControls ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Macro Controls */}
          {showControls && (
            <div className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-semibold text-slate-900">Macro Levers</h4>
                </div>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Online Take Rate Dropdown */}
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <label className="text-sm font-medium text-slate-700">Online Take Rate</label>
                  </div>
                  <select
                    value={onlineTakeRate}
                    onChange={(e) => setOnlineTakeRate(parseFloat(e.target.value))}
                    className="w-full h-10 px-3 rounded-md border border-slate-300 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {ONLINE_TAKE_RATES.map(rate => (
                      <option key={rate.value} value={rate.value}>
                        {rate.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-2">
                    Multiplies Commission by ({onlineTakeRate} / 4.9)
                  </p>
                </div>
                
                {/* Offline Take Rate Toggle */}
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    <label className="text-sm font-medium text-slate-700">Offline Take Rate</label>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setOfflineTakeRate(false)}
                      className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        !offlineTakeRate
                          ? 'bg-slate-800 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      0%
                    </button>
                    <button
                      onClick={() => setOfflineTakeRate(true)}
                      className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        offlineTakeRate
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      5%
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Adds 5% of Offline GMV as revenue
                  </p>
                </div>
                
                {/* B2B Take Rate Toggle */}
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-violet-600" />
                    <label className="text-sm font-medium text-slate-700">B2B Take Rate</label>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setB2bTakeRate(false)}
                      className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        !b2bTakeRate
                          ? 'bg-slate-800 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      15%
                    </button>
                    <button
                      onClick={() => setB2bTakeRate(true)}
                      className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        b2bTakeRate
                          ? 'bg-violet-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      20%
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    B2B base: 50K SAR/month
                  </p>
                </div>
                
                {/* Horizon Toggle */}
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <label className="text-sm font-medium text-slate-700">Horizon</label>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setHorizon('2025')}
                      className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        horizon === '2025'
                          ? 'bg-slate-800 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      2025
                    </button>
                    <button
                      onClick={() => setHorizon('2028')}
                      className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        horizon === '2028'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      2028
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Projection timeframe
                  </p>
                </div>
              </div>
              
              {/* Active Scenario Summary */}
              <div className="mt-6 pt-4 border-t border-slate-200">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Active Scenario</p>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                    onlineTakeRate > 4.9 ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
                  }`}>
                    Online: {onlineTakeRate}%
                  </span>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                    offlineTakeRate ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                  }`}>
                    Offline: {offlineTakeRate ? '5%' : '0%'}
                  </span>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                    b2bTakeRate ? 'bg-violet-100 text-violet-700' : 'bg-slate-200 text-slate-600'
                  }`}>
                    B2B: {b2bTakeRate ? '20%' : '15%'}
                  </span>
                  <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-800 text-white">
                    Through {horizon}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {/* Chart */}
          <div className="h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="gradient-base" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3} />
                  </linearGradient>
                  <linearGradient id="gradient-commission" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.3} />
                  </linearGradient>
                  <linearGradient id="gradient-offline" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.3} />
                  </linearGradient>
                  <linearGradient id="gradient-b2b" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                
                <XAxis 
                  dataKey="displayDate" 
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={{ stroke: '#cbd5e1' }}
                  interval={horizon === '2025' ? 2 : 5}
                />
                
                <YAxis 
                  tickFormatter={formatShortCurrency}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={{ stroke: '#cbd5e1' }}
                  width={60}
                />
                
                <Tooltip content={<CustomTooltip />} />
                
                <ReferenceLine 
                  x="Jan 25" 
                  stroke="#ef4444" 
                  strokeDasharray="5 5" 
                  strokeWidth={2}
                  label={{ 
                    value: 'Actuals → Projections', 
                    position: 'top', 
                    fill: '#ef4444',
                    fontSize: 11,
                    fontWeight: 600
                  }} 
                />
                
                <Area
                  type="monotone"
                  dataKey="baseRevenue"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="url(#gradient-base)"
                  name="Base Revenue"
                />
                
                <Area
                  type="monotone"
                  dataKey="commissionLift"
                  stackId="1"
                  stroke="#10b981"
                  fill="url(#gradient-commission)"
                  name="Commission Lift"
                />
                
                <Area
                  type="monotone"
                  dataKey="offlineRevenue"
                  stackId="1"
                  stroke="#f59e0b"
                  fill="url(#gradient-offline)"
                  name="Offline Revenue"
                />
                
                <Area
                  type="monotone"
                  dataKey="b2bRevenue"
                  stackId="1"
                  stroke="#8b5cf6"
                  fill="url(#gradient-b2b)"
                  name="B2B Revenue"
                />
                
                <Legend 
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  wrapperStyle={{ paddingLeft: 20 }}
                  iconType="rect"
                  iconSize={10}
                  formatter={(value) => <span className="text-xs text-slate-600">{value}</span>}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Base Case Revenue</p>
                <p className="text-2xl font-bold text-slate-900">{formatCurrency(summary.totalBaseRevenue)}</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
              Current 4.9% take rate scenario
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Stress Test Revenue</p>
                <p className="text-2xl font-bold text-emerald-600">{formatCurrency(summary.totalStressRevenue)}</p>
              </div>
            </div>
            <p className="text-xs text-emerald-600 mt-3 pt-3 border-t border-slate-100">
              With all macro levers applied
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                summary.upliftPercentage > 0 ? 'bg-green-100' : 'bg-slate-100'
              }`}>
                <TrendingUp className={`w-5 h-5 ${
                  summary.upliftPercentage > 0 ? 'text-green-600' : 'text-slate-600'
                }`} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Revenue Uplift</p>
                <p className={`text-2xl font-bold ${
                  summary.upliftPercentage > 0 ? 'text-green-600' : 'text-slate-900'
                }`}>
                  +{summary.upliftPercentage.toFixed(1)}%
                </p>
              </div>
            </div>
            <p className="text-xs text-green-600 mt-3 pt-3 border-t border-slate-100">
              {formatCurrency(summary.revenueUplift)} additional revenue
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-slate-50 to-blue-50 border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
                <Layers className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">New Revenue Streams</p>
                <p className="text-2xl font-bold text-slate-800">
                  {formatCurrency(summary.commissionLiftTotal + summary.offlineTotal + summary.b2bTotal)}
                </p>
              </div>
            </div>
            <div className="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-200 space-y-1">
              <div className="flex justify-between">
                <span>Commission Lift:</span>
                <span className="font-medium">{formatShortCurrency(summary.commissionLiftTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Offline:</span>
                <span className="font-medium">{formatShortCurrency(summary.offlineTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>B2B:</span>
                <span className="font-medium">{formatShortCurrency(summary.b2bTotal)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MacroBusinessModel;
