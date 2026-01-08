'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Handshake, 
  FileCheck, 
  CalendarClock, 
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Building2,
  Banknote,
  FileText,
  Target,
  User
} from 'lucide-react';
import Link from 'next/link';

// --- THEME CONFIGURATION (Light Mode - Matching Financial Dashboard) ---
const THEME = {
  background: {
    primary: '#fafbfc',
    secondary: '#ffffff',
    accent: '#f1f5f9',
  },
  accent: {
    blue: '#2563eb',
    purple: '#7c3aed',
    green: '#059669',
    orange: '#ea580c',
    red: '#dc2626',
    yellow: '#ca8a04',
    text: '#0f172a',
    textSecondary: '#64748b',
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

const AgendaCard = ({ 
  number, 
  title, 
  icon: Icon, 
  children,
  iconColor = THEME.accent.blue 
}: { 
  number: number; 
  title: string; 
  icon: any; 
  children: React.ReactNode;
  iconColor?: string;
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: number * 0.1 }}
    className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 hover:shadow-lg hover:border-slate-300 transition-all"
  >
    <div className="flex items-start gap-4 mb-6">
      <div 
        className="flex items-center justify-center w-12 h-12 rounded-xl"
        style={{ 
          background: `${iconColor}15`,
          border: `1px solid ${iconColor}30`
        }}
      >
        <Icon className="w-6 h-6" style={{ color: iconColor }} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span 
            className="text-xs font-bold px-2 py-1 rounded"
            style={{ 
              background: `${iconColor}15`,
              color: iconColor 
            }}
          >
            #{number}
          </span>
          <h3 className="text-xl font-bold text-slate-900">
            {title}
          </h3>
        </div>
      </div>
    </div>
    <div className="text-slate-700">
      {children}
    </div>
  </motion.div>
);

const StatHighlight = ({ 
  label, 
  value, 
  color = THEME.accent.blue 
}: { 
  label: string; 
  value: string; 
  color?: string;
}) => (
  <div 
    className="p-4 rounded-xl border"
    style={{
      background: `${color}10`,
      borderColor: `${color}30`,
    }}
  >
    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">
      {label}
    </div>
    <div className="text-2xl font-black" style={{ color }}>
      {value}
    </div>
  </div>
);

const ChecklistItem = ({ 
  text, 
  checked = false 
}: { 
  text: string; 
  checked?: boolean;
}) => (
  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
    {checked ? (
      <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
    ) : (
      <XCircle className="w-5 h-5 flex-shrink-0 text-slate-400" />
    )}
    <span className={checked ? 'text-slate-900' : 'text-slate-500'}>
      {text}
    </span>
  </div>
);

export default function AgendaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 text-slate-900 selection:bg-blue-500/20 font-sans">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 bg-slate-600 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">
              Today • Jan 7, 2026 • Priority Meeting
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-4">
            Meeting Agenda
          </h1>
          <p className="text-xl text-slate-600 mb-6">
            Finance Partner (AHH Firm) • Pre-Investment Briefing
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatHighlight 
              label="Meeting Type" 
              value="Due Diligence" 
              color="#475569" 
            />
            <StatHighlight 
              label="Timeline" 
              value="60 Days" 
              color="#64748b" 
            />
            <StatHighlight 
              label="Priority Level" 
              value="Critical" 
              color="#334155" 
            />
          </div>
        </motion.div>

        {/* Agenda Items */}
        <div className="space-y-6">
          
          {/* 1. Investment & Payoff Strategy */}
          <AgendaCard 
            number={1} 
            title="Investment & Payoff Strategy" 
            icon={TrendingUp}
            iconColor={THEME.accent.green}
          >
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-slate-700" />
                <div>
                  <div className="font-bold text-slate-800 mb-1">
                    Status: Serious Investor Confirmed
                  </div>
                  <div className="text-sm text-slate-600">
                    Investment funds secured and ready for deployment
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-3">
                  Liability Clearance Plan
                </h4>
                <div className="space-y-3">
                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-300">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-5 h-5 text-slate-600" />
                      <span className="font-bold text-slate-900">
                        Farzal's Entities (NextGeni/DotZero)
                      </span>
                    </div>
                    <div className="text-3xl font-black text-slate-700 mb-2">
                      {formatCurrency(419347.50)}
                    </div>
                    <div className="text-sm text-slate-600">
                      Full settlement upon fund transfer
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-300">
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 className="w-5 h-5 text-slate-600" />
                      <span className="font-bold text-slate-900">
                        Club Payables
                      </span>
                    </div>
                    <div className="text-3xl font-black text-slate-700 mb-2">
                      {formatCurrency(1928428.21)}
                    </div>
                    <div className="text-sm text-slate-600">
                      Clearing all operational debts with partner facilities
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-300">
                    <div className="flex items-center gap-2 mb-3">
                      <Banknote className="w-5 h-5 text-slate-600" />
                      <span className="font-bold text-slate-900">
                        Bank Loan (Strategic Decision)
                      </span>
                    </div>
                    <div className="text-3xl font-black text-slate-700 mb-2">
                      {formatCurrency(1784014.00)}
                    </div>
                    <div className="text-sm text-slate-600">
                      Note: Investor may retain this loan as part of the structure
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AgendaCard>

          {/* 2. The 60-Day Sprint */}
          <AgendaCard 
            number={2} 
            title="The 60-Day Sprint" 
            icon={CalendarClock}
            iconColor={THEME.accent.yellow}
          >
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-100 border border-slate-300">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-slate-600" />
                  <span className="font-bold text-slate-800">
                    Deadline: End of February 2026
                  </span>
                </div>
                <div className="text-sm text-slate-600">
                  Clean handover with full operational transfer
                </div>
              </div>

              {/* Priority #1: Audit & Financial Reporting */}
              <div className="p-5 rounded-xl bg-slate-50 border-2 border-slate-400">
                <div className="flex items-center gap-2 mb-3">
                  <FileCheck className="w-5 h-5 text-slate-700" />
                  <span className="font-bold text-slate-900 text-lg">
                    Priority #1: Dashboard Audit & Financial Reporting
                  </span>
                </div>
                <p className="text-sm text-slate-700 mb-4">
                  Partner must audit the Financial Dashboard and validate all numbers against the ledger. Critical for investor due diligence.
                </p>
                <Link href="/dashboard">
                  <button className="w-full py-3 px-6 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-md hover:shadow-lg">
                    <FileCheck className="w-5 h-5" />
                    Open Financial Dashboard
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </Link>
                <div className="mt-3 p-3 bg-slate-200 rounded-lg">
                  <p className="text-xs text-slate-700 font-semibold">
                    Contact: Marko Eremets for dashboard review coordination
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-3">
                  Sprint Checklist
                </h4>
                <div className="space-y-2">
                  <ChecklistItem text="New technical system fully operational" checked={false} />
                  <ChecklistItem text="All third-party vendors paid and settled" checked={false} />
                  <ChecklistItem text="Full handover execution completed" checked={false} />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-100 border border-slate-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-semibold text-slate-700">
                  Critical path: All items must be completed for successful handover
                </span>
              </div>
            </div>
          </AgendaCard>

          {/* 3. Financial Reporting Gaps */}
          <AgendaCard 
            number={3} 
            title="Financial Reporting Status (2025)" 
            icon={FileText}
            iconColor={THEME.accent.blue}
          >
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-100 border border-slate-300">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-slate-600" />
                  <span className="font-bold text-slate-800">
                    Urgent: Complete 2025 Financial Statements Required
                  </span>
                </div>
                <div className="text-sm text-slate-600">
                  Full year financial statements needed for investor review
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-3">
                  2025 Monthly Reports Status
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { month: 'January', delivered: true },
                    { month: 'February', delivered: true },
                    { month: 'March', delivered: true },
                    { month: 'April', delivered: true },
                    { month: 'May', delivered: true },
                    { month: 'June', delivered: true },
                    { month: 'July', delivered: true },
                    { month: 'August', delivered: true },
                    { month: 'September', delivered: true },
                    { month: 'October', delivered: false },
                    { month: 'November', delivered: false },
                    { month: 'December', delivered: false },
                  ].map((item) => (
                    <div
                      key={item.month}
                      className={`p-3 rounded-lg text-center border ${
                        item.delivered
                          ? 'bg-emerald-50 border-emerald-300'
                          : 'bg-slate-100 border-slate-400'
                      }`}
                    >
                      <div className={`text-xs font-bold ${
                        item.delivered ? 'text-emerald-700' : 'text-slate-700'
                      }`}>
                        {item.month}
                      </div>
                      <div className={`text-[10px] mt-1 font-semibold ${
                        item.delivered ? 'text-emerald-600' : 'text-slate-600'
                      }`}>
                        {item.delivered ? '✓ Delivered' : 'Missing'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-100 border border-slate-200">
                <div className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">Note:</span> Q4 statements (Oct-Dec) are critical for completing the full-year financial picture required by the investor
                </div>
              </div>
            </div>
          </AgendaCard>

          {/* 4. Liability Negotiation */}
          <AgendaCard 
            number={4} 
            title="Liability Negotiation (The Ask)" 
            icon={Handshake}
            iconColor={THEME.accent.blue}
          >
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-900 mb-3">
                  Current Situation
                </h4>
                <div className="p-6 rounded-xl bg-slate-100 border-2 border-slate-400">
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-semibold">
                    Outstanding Liability to AHH Firm
                  </div>
                  <div className="text-4xl md:text-5xl font-black text-slate-700 mb-3">
                    {formatCurrency(190000)}
                  </div>
                  <div className="text-sm text-slate-600">
                    Second largest operational debt (after Clubs/Farzal)
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-300">
                <div className="flex items-center gap-2 mb-2">
                  <Handshake className="w-5 h-5 text-slate-700" />
                  <span className="font-bold text-slate-800">
                    Negotiation Point
                  </span>
                </div>
                <div className="text-sm text-slate-700">
                  Request a settlement discount to close this invoice immediately as part of the clean handover process
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-3">
                  Strategic Rationale
                </h4>
                <ul className="space-y-2">
                  {[
                    'Immediate payment upon agreement',
                    'Simplifies balance sheet for investor review',
                    'Strengthens partnership for future engagements',
                    'Demonstrates commitment to clean exit'
                  ].map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-slate-600" />
                      <span className="text-sm text-slate-600">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </AgendaCard>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 pt-8 border-t border-slate-200"
        >
          <div className="text-center">
            <p className="text-sm text-slate-500">
              Confidential Meeting Agenda • Sinjab Financial Operations • Jan 7, 2026
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

