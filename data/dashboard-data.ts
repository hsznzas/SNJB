// data/dashboard-data.ts

export type FinancialData = {
  month: string;
  revenue: number | null;
  expenses: number | null;
  burn: number | null;
};

// 2022 & Early 2023 (Pre-Report Estimates)
export const DATA_2022: FinancialData[] = [
  { month: 'Jan', revenue: null, expenses: null, burn: null }, 
  { month: 'Dec', revenue: null, expenses: null, burn: null }
];

// 2023 ACTUALS (Jul - Dec from Bank)
export const DATA_2023: FinancialData[] = [
  { month: 'Jul', revenue: 145200, expenses: 210000, burn: -64800 },
  { month: 'Aug', revenue: 152300, expenses: 215000, burn: -62700 },
  { month: 'Sep', revenue: 148900, expenses: 220000, burn: -71100 },
  { month: 'Oct', revenue: 160500, expenses: 225000, burn: -64500 },
  { month: 'Nov', revenue: 158200, expenses: 230000, burn: -71800 },
  { month: 'Dec', revenue: 165400, expenses: 240000, burn: -74600 },
];

// 2024 ACTUALS
export const DATA_2024: FinancialData[] = [
  { month: 'Jan', revenue: 177360, expenses: 279512, burn: -102152 },
  { month: 'Feb', revenue: 187297, expenses: 173289, burn: 14008 },
  { month: 'Mar', revenue: 195562, expenses: 325974, burn: -130412 },
  { month: 'Apr', revenue: 151600, expenses: 320000, burn: -168400 },
  { month: 'May', revenue: 173361, expenses: 280000, burn: -106639 },
  { month: 'Jun', revenue: 138592, expenses: 260000, burn: -121408 },
  { month: 'Jul', revenue: 189607, expenses: 290000, burn: -100393 },
  { month: 'Aug', revenue: 156329, expenses: 250000, burn: -93671 },
  { month: 'Sep', revenue: 135434, expenses: 270000, burn: -134566 },
  { month: 'Oct', revenue: 156329, expenses: 260000, burn: -103671 },
  { month: 'Nov', revenue: 135434, expenses: 280000, burn: -144566 },
  { month: 'Dec', revenue: 190184, expenses: 350000, burn: -159816 },
];

// 2025 ACTUALS (Updated with Full Dec Data)
export const DATA_2025: FinancialData[] = [
  { month: 'Jan', revenue: 141975, expenses: 138508, burn: 3467 },
  { month: 'Feb', revenue: 113636, expenses: 134334, burn: -20698 },
  { month: 'Mar', revenue: 193907, expenses: 161324, burn: 32583 },
  { month: 'Apr', revenue: 169685, expenses: 141109, burn: 28576 },
  { month: 'May', revenue: 179530, expenses: 157301, burn: 22229 },
  { month: 'Jun', revenue: 148465, expenses: 138417, burn: 10048 },
  { month: 'Jul', revenue: 165530, expenses: 137885, burn: 27645 },
  { month: 'Aug', revenue: 174235, expenses: 168640, burn: 5595 },
  { month: 'Sep', revenue: 161856, expenses: 153572, burn: 8284 },
  { month: 'Oct', revenue: 168500, expenses: 148000, burn: 20500 },
  { month: 'Nov', revenue: 172100, expenses: 149500, burn: 22600 },
  // Updated Dec: Previously projected, now final based on logs + 5 days
  { month: 'Dec', revenue: 189250, expenses: 156500, burn: 32750 }, 
];

// CONSOLIDATED P&L
export const DATA_CONSOLIDATED: FinancialData[] = [
  ...DATA_2023.map(d => ({ ...d, month: `${d.month} 23` })),
  ...DATA_2024.map(d => ({ ...d, month: `${d.month} 24` })),
  ...DATA_2025.map(d => ({ ...d, month: `${d.month} 25` }))
];

// --- USER TRACTION & RETENTION (From Booking Logs) ---
export const USER_TRACTION_DATA = [
  { month: 'Jan 22', newUsers: 973, activeUsers: 265, utilization: 82 },
  { month: 'Feb 22', newUsers: 1732, activeUsers: 420, utilization: 73 },
  { month: 'Mar 22', newUsers: 3710, activeUsers: 910, utilization: 75 },
  { month: 'Apr 22', newUsers: 5652, activeUsers: 4345, utilization: 33 },
  { month: 'May 22', newUsers: 4465, activeUsers: 3991, utilization: 32 },
  { month: 'Jun 22', newUsers: 7336, activeUsers: 5745, utilization: 32 },
  { month: 'Jul 22', newUsers: 7313, activeUsers: 3900, utilization: 35 },
  { month: 'Aug 22', newUsers: 6387, activeUsers: 5785, utilization: 38 },
  { month: 'Sep 22', newUsers: 5571, activeUsers: 4515, utilization: 40 },
  { month: 'Oct 22', newUsers: 5891, activeUsers: 5077, utilization: 43 },
  { month: 'Nov 22', newUsers: 5036, activeUsers: 4342, utilization: 43 },
  { month: 'Dec 22', newUsers: 4955, activeUsers: 4293, utilization: 44 },
  { month: 'Jan 23', newUsers: 5636, activeUsers: 4320, utilization: 45 },
  { month: 'Feb 23', newUsers: 5516, activeUsers: 3949, utilization: 49 },
  { month: 'Mar 23', newUsers: 14821, activeUsers: 10896, utilization: 45 },
  { month: 'Apr 23', newUsers: 18598, activeUsers: 14222, utilization: 41 },
  { month: 'May 23', newUsers: 12330, activeUsers: 9383, utilization: 44 },
  { month: 'Jun 23', newUsers: 10446, activeUsers: 7635, utilization: 48 },
  { month: 'Jul 23', newUsers: 11231, activeUsers: 8211, utilization: 47 },
  { month: 'Aug 23', newUsers: 8137, activeUsers: 5935, utilization: 50 },
  { month: 'Sep 23', newUsers: 6929, activeUsers: 4938, utilization: 54 },
  { month: 'Oct 23', newUsers: 5942, activeUsers: 4316, utilization: 63 },
  { month: 'Nov 23', newUsers: 5562, activeUsers: 3952, utilization: 71 },
  { month: 'Dec 23', newUsers: 4411, activeUsers: 3276, utilization: 77 },
  { month: 'Jan 24', newUsers: 6748, activeUsers: 5744, utilization: 48 },
  { month: 'Feb 24', newUsers: 5901, activeUsers: 4978, utilization: 45 },
  { month: 'Mar 24', newUsers: 8822, activeUsers: 7998, utilization: 44 },
  { month: 'Apr 24', newUsers: 6961, activeUsers: 6267, utilization: 44 },
  { month: 'May 24', newUsers: 7504, activeUsers: 6579, utilization: 39 },
  { month: 'Jun 24', newUsers: 7019, activeUsers: 6222, utilization: 44 },
  { month: 'Jul 24', newUsers: 7695, activeUsers: 6843, utilization: 46 },
  { month: 'Aug 24', newUsers: 6202, activeUsers: 5196, utilization: 46 },
  { month: 'Sep 24', newUsers: 5342, activeUsers: 4415, utilization: 68 },
  { month: 'Oct 24', newUsers: 5847, activeUsers: 4470, utilization: 66 },
  { month: 'Nov 24', newUsers: 6148, activeUsers: 4879, utilization: 65 },
  { month: 'Dec 24', newUsers: 3989, activeUsers: 3210, utilization: 67 },
  { month: 'Jan 25', newUsers: 5078, activeUsers: 4742, utilization: 62 },
  { month: 'Feb 25', newUsers: 4573, activeUsers: 4368, utilization: 49 },
  { month: 'Mar 25', newUsers: 7539, activeUsers: 7567, utilization: 57 },
  { month: 'Apr 25', newUsers: 5797, activeUsers: 5408, utilization: 57 },
  { month: 'May 25', newUsers: 5710, activeUsers: 5049, utilization: 57 },
  { month: 'Jun 25', newUsers: 6820, activeUsers: 5666, utilization: 57 },
  { month: 'Jul 25', newUsers: 8189, activeUsers: 7266, utilization: 57 },
  { month: 'Aug 25', newUsers: 7530, activeUsers: 7050, utilization: 56 },
  { month: 'Sep 25', newUsers: 6321, activeUsers: 5970, utilization: 57 },
  { month: 'Oct 25', newUsers: 6578, activeUsers: 5745, utilization: 59 },
  { month: 'Nov 25', newUsers: 6494, activeUsers: 5905, utilization: 61 },
  // Updated Dec 2025 Traction
  { month: 'Dec 25', newUsers: 4280, activeUsers: 3890, utilization: 61 },
];

// --- GMV & UNIT ECONOMICS (Bank Verified Calculation) ---
export const GMV_DATA = [
  // 2022 (Est @ 100 SAR Ticket)
  { month: 'Jan 22', bookings: 1141, gmv: 1141 * 100 },
  { month: 'Jun 22', bookings: 5375, gmv: 5375 * 100 },
  { month: 'Dec 22', bookings: 6844, gmv: 6844 * 100 },
  // 2023
  { month: 'Jul 23', gmv: 5487162, bookings: 21511 },
  { month: 'Aug 23', gmv: 3196926, bookings: 19440 },
  { month: 'Sep 23', gmv: 3275373, bookings: 18044 },
  { month: 'Oct 23', gmv: 4105337, bookings: 17468 },
  { month: 'Nov 23', gmv: 3131545, bookings: 16787 },
  { month: 'Dec 23', gmv: 2082259, bookings: 13646 },
  // 2024
  { month: 'Jan 24', gmv: 2265726, bookings: 28500 },
  { month: 'Feb 24', gmv: 2014239, bookings: 26100 },
  { month: 'Mar 24', gmv: 3290400, bookings: 29400 },
  { month: 'Apr 24', gmv: 2838323, bookings: 24800 },
  { month: 'May 24', gmv: 2955795, bookings: 27500 },
  { month: 'Jun 24', gmv: 2258452, bookings: 22100 },
  { month: 'Jul 24', gmv: 2460211, bookings: 31200 },
  { month: 'Aug 24', gmv: 2517192, bookings: 26800 },
  { month: 'Sep 24', gmv: 2136290, bookings: 23500 },
  { month: 'Oct 24', gmv: 2144435, bookings: 27100 },
  { month: 'Nov 24', gmv: 2177341, bookings: 24300 },
  { month: 'Dec 24', gmv: 1647102, bookings: 32100 },
  // 2025
  { month: 'Jan 25', gmv: 1633188, bookings: 25400 },
  { month: 'Feb 25', gmv: 1630117, bookings: 19800 },
  { month: 'Mar 25', gmv: 2861244, bookings: 33500 },
  { month: 'Apr 25', gmv: 2056912, bookings: 28900 },
  { month: 'May 25', gmv: 2308016, bookings: 30100 },
  { month: 'Jun 25', gmv: 2111792, bookings: 25600 },
  { month: 'Jul 25', gmv: 2621187, bookings: 28200 },
  { month: 'Aug 25', gmv: 2640910, bookings: 29800 },
  { month: 'Sep 25', gmv: 2522948, bookings: 27500 },
  { month: 'Oct 25', gmv: 2299649, bookings: 29100 },
  { month: 'Nov 25', gmv: 2293505, bookings: 30500 },
  // Dec 25 Updated with full data
  { month: 'Dec 25', gmv: 1450200, bookings: 34100 }, 
];

export const GMV_SUMMARY = {
  2022: { total: '6.1M SAR', label: 'Launch' },
  2023: { total: '21.3M SAR', label: 'High Growth' },
  2024: { total: '28.7M SAR', label: 'Market Leader' },
  2025: { total: '26.5M SAR', label: 'Optimization' }
};

export const TICKET_SIZE_DATA = GMV_DATA.map(d => ({
  month: d.month,
  ticket: d.gmv / (d.bookings || 1)
}));

export const TAKE_RATE_DATA = GMV_DATA.map(d => ({
  month: d.month,
  gmv: d.gmv,
  grossRevenue: d.gmv * 0.049, 
  costOfRevenue: d.gmv * 0.02, 
  netRevenue: d.gmv * (0.049 - 0.02)
}));

// EXPENSES
export const EXPENSE_HISTORY_CONSOLIDATED = [
  ...DATA_2023.map(d => ({ month: `${d.month} 23`, payroll: 62000, tech: 30000, ops: (d.expenses || 0) - 92000 })),
  ...DATA_2024.map((d, i) => {
    const payroll = [123862, 63375, 136638, 71014, 66638, 75338, 73138, 82005, 74014, 76801, 74138, 74184][i];
    const tech = 36500; 
    const ops = (d.expenses || 0) - payroll - tech;
    return { month: `${d.month} 24`, payroll, tech, ops: Math.max(0, ops) };
  }),
  ...DATA_2025.map((d, i) => {
    const payroll = [74138, 74138, 74138, 74138, 74138, 67528, 67528, 78574, 78138, 75000, 75000, 75000][i];
    const tech = i >= 9 ? 2500 : 37500; 
    const ops = (d.expenses || 0) - payroll - tech;
    return { month: `${d.month} 25`, payroll, tech, ops: Math.max(0, ops) };
  })
];

// DEBT
export const DEBT_BALANCE_HISTORY = [
  { month: 'Jan 24', balance: 0 },
  { month: 'Apr 24', balance: 3500000 },
  { month: 'Dec 24', balance: 3100000 },
  { month: 'Dec 25', balance: 2100000 },
];

export const DEBT_SCHEDULE = [
  { month: '2024', loan1: 103333, loan2: 7350 },
  { month: '2025', loan1: 103333, loan2: 14700 }
];

export const LOAN_DETAILS = [
  { name: 'Bank Loan 1', principal: '3,500,000', monthly: '103,333.33', color: '#facc15' },
  { name: 'Bank Loan 2', principal: '500,000', monthly: '14,700.00', color: '#ca8a04' }
];

export const BREAKDOWN_DATA = {
  2024: { expenses: { total: '3.1M', trend: 'Burn' }, debt: { bank: '118k', clubs: '1M' } },
  2025: { expenses: { total: '1.7M', trend: 'Lean' }, debt: { bank: '118k', clubs: '2M' } },
  consolidated: {
    expenses: { total: '6.1M', trend: 'Cumulative', chartData: EXPENSE_HISTORY_CONSOLIDATED },
    debt: { total: '118k', bank: '118k', clubs: '2M', schedule: DEBT_SCHEDULE }
  }
};

// Outstanding Liabilities (November 2025 Update)
export const LIABILITY_BREAKDOWN = [
  { category: 'NextGeni', amount: 419347.50 },
  { category: "Club's Payables", amount: 1928428.21 },
  { category: 'Marketing', amount: 20000.00 },
  { category: 'Finance Team', amount: 190000.00 },
  { category: 'Old Odoo', amount: 10000.00 },
  { category: 'New Odoo', amount: 25541.00 },
  { category: 'Loan', amount: 1784014.00 },
];

export const LIABILITY_TOTAL = 4377330.71;