'use client';

import React, { useState, useMemo, useCallback, useReducer } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/shared/ui/card';
import { Switch } from '@/components/shared/ui/switch';
import { Slider } from '@/components/shared/ui/slider';
import { Input } from '@/components/shared/ui/input';
import { 
  TrendingUp, 
  Settings2, 
  Calendar,
  DollarSign,
  Download,
  Layers,
  Zap,
  ChevronDown,
  ChevronUp,
  Info,
  RotateCcw
} from 'lucide-react';

// ============================================================================
// CONSTANTS
// ============================================================================

const generateMonthlyDates = (): string[] => {
  const dates: string[] = [];
  for (let year = 2023; year <= 2028; year++) {
    for (let month = 1; month <= 12; month++) {
      dates.push(`${year}-${month.toString().padStart(2, '0')}`);
    }
  }
  return dates;
};

export const MONTHLY_DATES = generateMonthlyDates();

// Stream configuration
export type StreamId = 
  | 'padelCommission' 
  | 'padelSubscription' 
  | 'premiumListings'
  | 'tennis'
  | 'newCategories'
  | 'tournaments'
  | 'matchmaking'
  | 'ecommerce'
  | 'ads'
  | 'b2b';

export interface StreamConfig {
  id: StreamId;
  name: string;
  color: string;
  defaultBaseValue: number;
  defaultStartDate: string;
  hasHistoricalData: boolean;
}

export const STREAM_CONFIGS: StreamConfig[] = [
  { id: 'padelCommission', name: 'Padel Commission', color: '#3b82f6', defaultBaseValue: 158000, defaultStartDate: '2023-01', hasHistoricalData: true },  // blue-500
  { id: 'padelSubscription', name: 'Padel Subscription', color: '#6366f1', defaultBaseValue: 52000, defaultStartDate: '2023-01', hasHistoricalData: true },  // indigo-500
  { id: 'premiumListings', name: 'Premium Listings', color: '#64748b', defaultBaseValue: 18000, defaultStartDate: '2023-01', hasHistoricalData: true },  // slate-500
  { id: 'tennis', name: 'Tennis', color: '#10b981', defaultBaseValue: 15000, defaultStartDate: '2026-03', hasHistoricalData: false },  // emerald-500
  { id: 'newCategories', name: 'New Categories', color: '#f59e0b', defaultBaseValue: 8000, defaultStartDate: '2026-06', hasHistoricalData: false },  // amber-500
  { id: 'tournaments', name: 'Tournaments', color: '#ec4899', defaultBaseValue: 25000, defaultStartDate: '2026-04', hasHistoricalData: false },  // pink-500
  { id: 'matchmaking', name: 'Match Making', color: '#8b5cf6', defaultBaseValue: 10000, defaultStartDate: '2026-05', hasHistoricalData: false },  // violet-500
  { id: 'ecommerce', name: 'E-commerce', color: '#14b8a6', defaultBaseValue: 20000, defaultStartDate: '2026-09', hasHistoricalData: false },  // teal-500
  { id: 'ads', name: 'Ads', color: '#f97316', defaultBaseValue: 8000, defaultStartDate: '2026-07', hasHistoricalData: false },  // orange-500
  { id: 'b2b', name: 'B2B Revenue', color: '#22c55e', defaultBaseValue: 50000, defaultStartDate: '2026-02', hasHistoricalData: false },  // green-500
];

// ============================================================================
// HISTORICAL DATA (2023-2024 ACTUALS)
// ============================================================================

export const HISTORICAL_DATA: Record<StreamId, Record<string, number>> = {
  padelCommission: {
    '2023-01': 85000, '2023-02': 88000, '2023-03': 92000, '2023-04': 95000,
    '2023-05': 98000, '2023-06': 102000, '2023-07': 108000, '2023-08': 105000,
    '2023-09': 110000, '2023-10': 115000, '2023-11': 112000, '2023-12': 120000,
    '2024-01': 125000, '2024-02': 130000, '2024-03': 138000, '2024-04': 125000,
    '2024-05': 142000, '2024-06': 115000, '2024-07': 155000, '2024-08': 128000,
    '2024-09': 112000, '2024-10': 128000, '2024-11': 110000, '2024-12': 158000,
  },
  padelSubscription: {
    '2023-01': 15000, '2023-02': 18000, '2023-03': 22000, '2023-04': 25000,
    '2023-05': 28000, '2023-06': 30000, '2023-07': 32000, '2023-08': 35000,
    '2023-09': 38000, '2023-10': 42000, '2023-11': 45000, '2023-12': 48000,
    '2024-01': 52000, '2024-02': 55000, '2024-03': 58000, '2024-04': 48000,
    '2024-05': 52000, '2024-06': 45000, '2024-07': 55000, '2024-08': 48000,
    '2024-09': 42000, '2024-10': 48000, '2024-11': 45000, '2024-12': 52000,
  },
  premiumListings: {
    '2023-01': 5000, '2023-02': 6000, '2023-03': 7500, '2023-04': 8000,
    '2023-05': 9000, '2023-06': 10000, '2023-07': 11000, '2023-08': 12000,
    '2023-09': 13000, '2023-10': 14000, '2023-11': 15000, '2023-12': 16000,
    '2024-01': 17000, '2024-02': 18000, '2024-03': 19500, '2024-04': 16000,
    '2024-05': 18000, '2024-06': 15000, '2024-07': 19000, '2024-08': 16000,
    '2024-09': 14000, '2024-10': 16000, '2024-11': 15000, '2024-12': 18000,
  },
  tennis: {},
  newCategories: {},
  tournaments: {},
  matchmaking: {},
  ecommerce: {},
  ads: {},
  b2b: {},
};

// Projection data for streams
export const PROJECTION_DATA: Record<StreamId, Record<string, number>> = {
  padelCommission: {
    '2025-01': 118000, '2025-02': 95000, '2025-03': 162000, '2025-04': 142000,
    '2025-05': 150000, '2025-06': 125000, '2025-07': 138000, '2025-08': 145000,
    '2025-09': 135000, '2025-10': 140000, '2025-11': 145000, '2025-12': 160000,
    '2026-01': 165000, '2026-02': 170000, '2026-03': 178000, '2026-04': 175000,
    '2026-05': 182000, '2026-06': 168000, '2026-07': 188000, '2026-08': 180000,
    '2026-09': 175000, '2026-10': 185000, '2026-11': 190000, '2026-12': 198000,
    '2027-01': 205000, '2027-02': 210000, '2027-03': 220000, '2027-04': 215000,
    '2027-05': 225000, '2027-06': 210000, '2027-07': 235000, '2027-08': 228000,
    '2027-09': 220000, '2027-10': 230000, '2027-11': 238000, '2027-12': 248000,
    '2028-01': 255000, '2028-02': 260000, '2028-03': 272000, '2028-04': 265000,
    '2028-05': 278000, '2028-06': 262000, '2028-07': 290000, '2028-08': 282000,
    '2028-09': 275000, '2028-10': 285000, '2028-11': 295000, '2028-12': 310000,
  },
  padelSubscription: {
    '2025-01': 48000, '2025-02': 42000, '2025-03': 55000, '2025-04': 50000,
    '2025-05': 52000, '2025-06': 48000, '2025-07': 50000, '2025-08': 52000,
    '2025-09': 50000, '2025-10': 52000, '2025-11': 50000, '2025-12': 52000,
    '2026-01': 55000, '2026-02': 58000, '2026-03': 62000, '2026-04': 60000,
    '2026-05': 65000, '2026-06': 62000, '2026-07': 68000, '2026-08': 65000,
    '2026-09': 62000, '2026-10': 68000, '2026-11': 72000, '2026-12': 75000,
    '2027-01': 78000, '2027-02': 82000, '2027-03': 88000, '2027-04': 85000,
    '2027-05': 92000, '2027-06': 88000, '2027-07': 95000, '2027-08': 92000,
    '2027-09': 88000, '2027-10': 95000, '2027-11': 100000, '2027-12': 105000,
    '2028-01': 110000, '2028-02': 115000, '2028-03': 122000, '2028-04': 118000,
    '2028-05': 128000, '2028-06': 122000, '2028-07': 132000, '2028-08': 128000,
    '2028-09': 125000, '2028-10': 132000, '2028-11': 138000, '2028-12': 145000,
  },
  premiumListings: {
    '2025-01': 16000, '2025-02': 14000, '2025-03': 19000, '2025-04': 17000,
    '2025-05': 18000, '2025-06': 16000, '2025-07': 17000, '2025-08': 18000,
    '2025-09': 17000, '2025-10': 18000, '2025-11': 17000, '2025-12': 18000,
    '2026-01': 20000, '2026-02': 22000, '2026-03': 25000, '2026-04': 24000,
    '2026-05': 27000, '2026-06': 25000, '2026-07': 28000, '2026-08': 27000,
    '2026-09': 26000, '2026-10': 28000, '2026-11': 30000, '2026-12': 32000,
    '2027-01': 35000, '2027-02': 38000, '2027-03': 42000, '2027-04': 40000,
    '2027-05': 45000, '2027-06': 42000, '2027-07': 48000, '2027-08': 45000,
    '2027-09': 43000, '2027-10': 48000, '2027-11': 52000, '2027-12': 55000,
    '2028-01': 58000, '2028-02': 62000, '2028-03': 68000, '2028-04': 65000,
    '2028-05': 72000, '2028-06': 68000, '2028-07': 75000, '2028-08': 72000,
    '2028-09': 70000, '2028-10': 75000, '2028-11': 80000, '2028-12': 85000,
  },
  tennis: {
    '2026-03': 15000, '2026-04': 18000, '2026-05': 22000, '2026-06': 25000,
    '2026-07': 28000, '2026-08': 32000, '2026-09': 35000, '2026-10': 38000,
    '2026-11': 42000, '2026-12': 45000,
    '2027-01': 48000, '2027-02': 52000, '2027-03': 58000, '2027-04': 55000,
    '2027-05': 62000, '2027-06': 58000, '2027-07': 65000, '2027-08': 62000,
    '2027-09': 60000, '2027-10': 65000, '2027-11': 70000, '2027-12': 75000,
    '2028-01': 78000, '2028-02': 82000, '2028-03': 88000, '2028-04': 85000,
    '2028-05': 92000, '2028-06': 88000, '2028-07': 95000, '2028-08': 92000,
    '2028-09': 90000, '2028-10': 95000, '2028-11': 100000, '2028-12': 108000,
  },
  newCategories: {
    '2026-06': 8000, '2026-07': 12000, '2026-08': 15000, '2026-09': 18000,
    '2026-10': 22000, '2026-11': 25000, '2026-12': 28000,
    '2027-01': 32000, '2027-02': 35000, '2027-03': 40000, '2027-04': 38000,
    '2027-05': 45000, '2027-06': 42000, '2027-07': 48000, '2027-08': 45000,
    '2027-09': 43000, '2027-10': 48000, '2027-11': 52000, '2027-12': 58000,
    '2028-01': 62000, '2028-02': 68000, '2028-03': 75000, '2028-04': 72000,
    '2028-05': 80000, '2028-06': 75000, '2028-07': 85000, '2028-08': 82000,
    '2028-09': 78000, '2028-10': 85000, '2028-11': 92000, '2028-12': 100000,
  },
  tournaments: {
    '2026-04': 25000, '2026-05': 30000, '2026-06': 35000, '2026-07': 40000,
    '2026-08': 45000, '2026-09': 50000, '2026-10': 55000, '2026-11': 60000,
    '2026-12': 65000,
    '2027-01': 70000, '2027-02': 75000, '2027-03': 82000, '2027-04': 78000,
    '2027-05': 88000, '2027-06': 82000, '2027-07': 95000, '2027-08': 90000,
    '2027-09': 85000, '2027-10': 95000, '2027-11': 102000, '2027-12': 110000,
    '2028-01': 115000, '2028-02': 122000, '2028-03': 132000, '2028-04': 128000,
    '2028-05': 140000, '2028-06': 132000, '2028-07': 148000, '2028-08': 142000,
    '2028-09': 138000, '2028-10': 148000, '2028-11': 158000, '2028-12': 170000,
  },
  matchmaking: {
    '2026-05': 10000, '2026-06': 15000, '2026-07': 20000, '2026-08': 25000,
    '2026-09': 30000, '2026-10': 35000, '2026-11': 40000, '2026-12': 45000,
    '2027-01': 50000, '2027-02': 55000, '2027-03': 62000, '2027-04': 58000,
    '2027-05': 68000, '2027-06': 62000, '2027-07': 75000, '2027-08': 70000,
    '2027-09': 65000, '2027-10': 75000, '2027-11': 82000, '2027-12': 90000,
    '2028-01': 95000, '2028-02': 102000, '2028-03': 112000, '2028-04': 108000,
    '2028-05': 120000, '2028-06': 112000, '2028-07': 128000, '2028-08': 122000,
    '2028-09': 118000, '2028-10': 128000, '2028-11': 138000, '2028-12': 150000,
  },
  ecommerce: {
    '2026-09': 20000, '2026-10': 28000, '2026-11': 35000, '2026-12': 42000,
    '2027-01': 50000, '2027-02': 58000, '2027-03': 68000, '2027-04': 62000,
    '2027-05': 75000, '2027-06': 68000, '2027-07': 85000, '2027-08': 78000,
    '2027-09': 72000, '2027-10': 85000, '2027-11': 95000, '2027-12': 108000,
    '2028-01': 118000, '2028-02': 128000, '2028-03': 142000, '2028-04': 135000,
    '2028-05': 152000, '2028-06': 142000, '2028-07': 165000, '2028-08': 155000,
    '2028-09': 148000, '2028-10': 165000, '2028-11': 180000, '2028-12': 198000,
  },
  ads: {
    '2026-07': 8000, '2026-08': 12000, '2026-09': 15000, '2026-10': 18000,
    '2026-11': 22000, '2026-12': 25000,
    '2027-01': 28000, '2027-02': 32000, '2027-03': 38000, '2027-04': 35000,
    '2027-05': 42000, '2027-06': 38000, '2027-07': 48000, '2027-08': 45000,
    '2027-09': 42000, '2027-10': 48000, '2027-11': 55000, '2027-12': 62000,
    '2028-01': 68000, '2028-02': 75000, '2028-03': 85000, '2028-04': 80000,
    '2028-05': 92000, '2028-06': 85000, '2028-07': 100000, '2028-08': 95000,
    '2028-09': 90000, '2028-10': 100000, '2028-11': 112000, '2028-12': 125000,
  },
  b2b: {},
};

// ============================================================================
// STREAM EDITOR STATE MANAGEMENT (useReducer)
// ============================================================================

interface StreamEditState {
  enabled: boolean;
  baseValue: number;
  growthRate: number; // -10 to +50 MoM percentage
  startDate: string;
}

type StreamEditsState = Record<StreamId, StreamEditState>;

type StreamEditAction = 
  | { type: 'SET_ENABLED'; streamId: StreamId; enabled: boolean }
  | { type: 'SET_BASE_VALUE'; streamId: StreamId; value: number }
  | { type: 'SET_GROWTH_RATE'; streamId: StreamId; rate: number }
  | { type: 'SET_START_DATE'; streamId: StreamId; date: string }
  | { type: 'RESET_STREAM'; streamId: StreamId }
  | { type: 'RESET_ALL' };

const getDefaultStreamEdit = (config: StreamConfig): StreamEditState => ({
  enabled: true,
  baseValue: config.defaultBaseValue,
  growthRate: 0,
  startDate: config.defaultStartDate,
});

const createInitialState = (): StreamEditsState => {
  const state: Partial<StreamEditsState> = {};
  STREAM_CONFIGS.forEach(config => {
    state[config.id] = getDefaultStreamEdit(config);
  });
  return state as StreamEditsState;
};

const initialStreamEdits = createInitialState();

function streamEditsReducer(state: StreamEditsState, action: StreamEditAction): StreamEditsState {
  switch (action.type) {
    case 'SET_ENABLED':
      return { ...state, [action.streamId]: { ...state[action.streamId], enabled: action.enabled } };
    case 'SET_BASE_VALUE':
      return { ...state, [action.streamId]: { ...state[action.streamId], baseValue: action.value } };
    case 'SET_GROWTH_RATE':
      return { ...state, [action.streamId]: { ...state[action.streamId], growthRate: action.rate } };
    case 'SET_START_DATE':
      return { ...state, [action.streamId]: { ...state[action.streamId], startDate: action.date } };
    case 'RESET_STREAM':
      const config = STREAM_CONFIGS.find(c => c.id === action.streamId)!;
      return { ...state, [action.streamId]: getDefaultStreamEdit(config) };
    case 'RESET_ALL':
      return createInitialState();
    default:
      return state;
  }
}

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

const isDateOnOrAfter = (date: string, startDate: string): boolean => {
  return getMonthIndex(date) >= getMonthIndex(startDate);
};

// CSV Export
const exportToCSV = (data: ChartDataPoint[], filename: string) => {
  const headers = ['Date', 'Display Date', ...STREAM_CONFIGS.map(s => s.name), 'Total'];
  
  const rows = data.map(row => [
    row.date,
    row.displayDate,
    ...STREAM_CONFIGS.map(s => Math.round(row[s.id] as number)),
    Math.round(row.total),
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};

// ============================================================================
// TYPES
// ============================================================================

interface ChartDataPoint {
  date: string;
  displayDate: string;
  padelCommission: number;
  padelSubscription: number;
  premiumListings: number;
  tennis: number;
  newCategories: number;
  tournaments: number;
  matchmaking: number;
  ecommerce: number;
  ads: number;
  b2b: number;
  total: number;
}

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

export const FinancialScenarioPlanner: React.FC = () => {
  // State
  const [streamEdits, dispatch] = useReducer(streamEditsReducer, initialStreamEdits);
  const [selectedStream, setSelectedStream] = useState<StreamId>('matchmaking');
  const [showControls, setShowControls] = useState(true);
  
  // Calculate chart data
  const chartData = useMemo((): ChartDataPoint[] => {
    return MONTHLY_DATES.map((date) => {
      const dataPoint: ChartDataPoint = {
        date,
        displayDate: getDisplayDate(date),
        padelCommission: 0,
        padelSubscription: 0,
        premiumListings: 0,
        tennis: 0,
        newCategories: 0,
        tournaments: 0,
        matchmaking: 0,
        ecommerce: 0,
        ads: 0,
        b2b: 0,
        total: 0,
      };
      
      STREAM_CONFIGS.forEach(config => {
        const edit = streamEdits[config.id];
        
        // If stream is disabled, value is 0
        if (!edit.enabled) {
          dataPoint[config.id] = 0;
          return;
        }
        
        // If date is before start date, value is 0
        if (!isDateOnOrAfter(date, edit.startDate)) {
          dataPoint[config.id] = 0;
          return;
        }
        
        // Get base value from historical or projection data
        let baseValue = HISTORICAL_DATA[config.id][date] || PROJECTION_DATA[config.id][date] || 0;
        
        // For B2B and streams without predefined data, use custom calculation
        if (config.id === 'b2b' || (!HISTORICAL_DATA[config.id][date] && !PROJECTION_DATA[config.id][date])) {
          const monthsFromStart = getMonthIndex(date) - getMonthIndex(edit.startDate);
          if (monthsFromStart >= 0) {
            // Compound growth from base value
            baseValue = edit.baseValue * Math.pow(1 + edit.growthRate / 100, monthsFromStart);
          }
        } else {
          // Apply growth rate adjustment to existing data
          baseValue = baseValue * (1 + edit.growthRate / 100);
        }
        
        dataPoint[config.id] = baseValue;
      });
      
      // Calculate total
      dataPoint.total = STREAM_CONFIGS.reduce((sum, config) => sum + dataPoint[config.id], 0);
      
      return dataPoint;
    });
  }, [streamEdits]);
  
  // Summary metrics
  const summary = useMemo(() => {
    const year2024Data = chartData.filter(d => d.date.startsWith('2024'));
    const year2025Data = chartData.filter(d => d.date.startsWith('2025'));
    
    // Jan-Sep 2025 (first 9 months)
    const ytd2025Months = ['2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06', '2025-07', '2025-08', '2025-09'];
    const projectedYTD2025 = chartData
      .filter(d => ytd2025Months.includes(d.date))
      .reduce((sum, d) => sum + d.total, 0);
    
    // Hardcoded actual YTD (Jan-Sep 2025)
    const actualYTD2025 = 1448824;
    
    // Achievement percentage
    const achievementPct = projectedYTD2025 > 0 ? (actualYTD2025 / projectedYTD2025) * 100 : 0;
    
    const actual2024 = year2024Data.reduce((sum, d) => sum + d.total, 0);
    const projected2025 = year2025Data.reduce((sum, d) => sum + d.total, 0);
    const yoyGrowth = actual2024 > 0 ? ((projected2025 - actual2024) / actual2024) * 100 : 0;
    
    return { actual2024, projected2025, yoyGrowth, actualYTD2025, projectedYTD2025, achievementPct };
  }, [chartData]);
  
  // Export handler
  const handleExport = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    exportToCSV(chartData, `Sinjab_Scenario_${today}.csv`);
  }, [chartData]);
  
  const selectedConfig = STREAM_CONFIGS.find(c => c.id === selectedStream)!;
  const selectedEdit = streamEdits[selectedStream];

  return (
    <div className="space-y-6">
      {/* Main Chart Card */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                Sinjab Financial Simulator v2.0
              </CardTitle>
              <CardDescription className="mt-2 text-slate-500">
                Interactive revenue projections from 2023-2028 with universal stream editing
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-medium text-white transition-colors"
              >
                <Download className="w-4 h-4" />
                Export Scenario
              </button>
              <button
                onClick={() => setShowControls(!showControls)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors"
              >
                <Settings2 className="w-4 h-4" />
                {showControls ? 'Hide' : 'Show'} Editor
                {showControls ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Universal Stream Editor */}
          {showControls && (
            <div className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-slate-900">Universal Stream Editor</h4>
                </div>
                <button
                  onClick={() => dispatch({ type: 'RESET_ALL' })}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset All
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Stream Selector */}
                <div className="lg:col-span-1">
                  <label className="text-sm font-medium text-slate-700 block mb-2">Select Stream</label>
                  <select
                    value={selectedStream}
                    onChange={(e) => setSelectedStream(e.target.value as StreamId)}
                    className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {STREAM_CONFIGS.map(config => (
                      <option key={config.id} value={config.id}>
                        {config.name}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: selectedConfig.color }} />
                    <span className="text-xs text-slate-500">
                      {selectedConfig.hasHistoricalData ? 'Has historical data' : 'Future stream'}
                    </span>
                  </div>
                </div>
                
                {/* Toggle */}
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <label className="text-sm text-slate-600 block mb-3">Status</label>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${selectedEdit.enabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {selectedEdit.enabled ? 'Active' : 'Disabled'}
                    </span>
                    <Switch
                      checked={selectedEdit.enabled}
                      onCheckedChange={(enabled) => 
                        dispatch({ type: 'SET_ENABLED', streamId: selectedStream, enabled })
                      }
                    />
                  </div>
                </div>
                
                {/* Base Value */}
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <label className="text-sm text-slate-600 block mb-2">Base Value (SAR)</label>
                  <Input
                    type="number"
                    value={selectedEdit.baseValue}
                    onChange={(e) => 
                      dispatch({ 
                        type: 'SET_BASE_VALUE', 
                        streamId: selectedStream, 
                        value: Number(e.target.value) || 0 
                      })
                    }
                    className="bg-slate-50"
                    disabled={!selectedEdit.enabled}
                  />
                </div>
                
                {/* Growth Rate */}
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <label className="text-sm text-slate-600 block mb-2">
                    Growth Rate: <span className={selectedEdit.growthRate >= 0 ? 'text-emerald-600' : 'text-red-500'}>
                      {selectedEdit.growthRate > 0 ? '+' : ''}{selectedEdit.growthRate}%
                    </span>
                  </label>
                  <Slider
                    value={[selectedEdit.growthRate]}
                    onValueChange={([rate]) => 
                      dispatch({ type: 'SET_GROWTH_RATE', streamId: selectedStream, rate })
                    }
                    min={-10}
                    max={50}
                    step={1}
                    disabled={!selectedEdit.enabled}
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>-10%</span>
                    <span>+50%</span>
                  </div>
                </div>
                
                {/* Start Date */}
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <label className="text-sm text-slate-600 block mb-2">Start Date</label>
                  <select
                    value={selectedEdit.startDate}
                    onChange={(e) => 
                      dispatch({ type: 'SET_START_DATE', streamId: selectedStream, date: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-md border border-slate-300 bg-slate-50 text-sm"
                    disabled={!selectedEdit.enabled}
                  >
                    {MONTHLY_DATES.map(date => (
                      <option key={date} value={date}>{getDisplayDate(date)}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Quick Toggle Pills */}
              <div className="mt-6 pt-4 border-t border-slate-200">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Quick Toggles</p>
                <div className="flex flex-wrap gap-2">
                  {STREAM_CONFIGS.map(config => (
                    <button
                      key={config.id}
                      onClick={() => dispatch({ 
                        type: 'SET_ENABLED', 
                        streamId: config.id, 
                        enabled: !streamEdits[config.id].enabled 
                      })}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-2 ${
                        streamEdits[config.id].enabled
                          ? 'bg-slate-800 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
                      {config.name}
                    </button>
                  ))}
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
                  {STREAM_CONFIGS.map(config => (
                    <linearGradient key={config.id} id={`gradient-${config.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={config.color} stopOpacity={0.8} />
                      <stop offset="100%" stopColor={config.color} stopOpacity={0.3} />
                    </linearGradient>
                  ))}
                </defs>
                
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                
                <XAxis 
                  dataKey="displayDate" 
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={{ stroke: '#cbd5e1' }}
                  interval={5}
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
                
                {STREAM_CONFIGS.map(config => (
                  <Area
                    key={config.id}
                    type="monotone"
                    dataKey={config.id}
                    stackId="1"
                    stroke={config.color}
                    fill={`url(#gradient-${config.id})`}
                    name={config.name}
                  />
                ))}
                
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
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">2024 Actual Revenue</p>
                <p className="text-2xl font-bold text-slate-900">{formatCurrency(summary.actual2024)}</p>
              </div>
            </div>
            <p className="text-xs text-emerald-600 mt-3 pt-3 border-t border-slate-100">
              ↑ Full year actuals, baseline for projections
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">2025 Scenario Projection</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(summary.projected2025)}</p>
              </div>
            </div>
            <p className="text-xs text-blue-600 mt-3 pt-3 border-t border-slate-100">
              ↑ Full year based on current scenario settings
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${summary.yoyGrowth >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <TrendingUp className={`w-5 h-5 ${summary.yoyGrowth >= 0 ? 'text-green-600' : 'text-red-600 rotate-180'}`} />
              </div>
              <div>
                <p className="text-sm text-slate-500">YoY Growth</p>
                <p className={`text-2xl font-bold ${summary.yoyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {summary.yoyGrowth >= 0 ? '+' : ''}{summary.yoyGrowth.toFixed(1)}%
                </p>
              </div>
            </div>
            <p className={`text-xs mt-3 pt-3 border-t border-slate-100 ${summary.yoyGrowth >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {summary.yoyGrowth >= 0 ? '↑ Strong growth trajectory maintained' : '↓ Below baseline expectations'}
            </p>
          </CardContent>
        </Card>
        
        {/* Reality Check Card */}
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">2025 YTD Achievement</p>
                <p className="text-2xl font-bold text-slate-800">{summary.achievementPct.toFixed(1)}%</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-200">
              Jan-Sep: {formatCurrency(summary.actualYTD2025)} actual vs {formatCurrency(summary.projectedYTD2025)} projected
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Reality Check Analysis Card */}
      <Card className="bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-slate-800 mb-2">2025 Reality Check (Jan-Sep)</p>
              <p className="text-slate-700 leading-relaxed">
                In 2025, we achieved <strong>{summary.achievementPct.toFixed(1)}%</strong> of our projected revenue target (Jan-Sep). 
                Actual revenue was <strong>{formatCurrency(summary.actualYTD2025)}</strong> against a projected <strong>{formatCurrency(summary.projectedYTD2025)}</strong>.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
    </div>
  );
};

export default FinancialScenarioPlanner;
