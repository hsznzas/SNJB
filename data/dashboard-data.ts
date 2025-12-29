// data/dashboard-data.ts

export type FinancialData = {
    month: string;
    revenue: number | null;
    expenses: number | null;
    burn: number | null;
  };
  
  // 2022 & Early 2023 (Estimates for Context)
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
  
  // 2025 ACTUALS
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
    { month: 'Dec', revenue: 185400, expenses: 155000, burn: 30400 },
  ];
  
  // CONSOLIDATED P&L
  export const DATA_CONSOLIDATED: FinancialData[] = [
    ...DATA_2023.map(d => ({ ...d, month: `${d.month} 23` })),
    ...DATA_2024.map(d => ({ ...d, month: `${d.month} 24` })),
    ...DATA_2025.map(d => ({ ...d, month: `${d.month} 25` }))
  ];
  
  // --- GMV & UNIT ECONOMICS (Bank Verified Calculation) ---
  export const GMV_DATA = [
    // 2022 (Est @ 100 SAR Ticket)
    { month: 'Jan 22', bookings: 1141, gmv: 1141 * 100 },
    { month: 'Jun 22', bookings: 5375, gmv: 5375 * 100 },
    { month: 'Dec 22', bookings: 6844, gmv: 6844 * 100 },
    
    // 2023 (Bank Data ~21.3M)
    { month: 'Jul 23', gmv: 5487162, bookings: 21511 },
    { month: 'Aug 23', gmv: 3196926, bookings: 19440 },
    { month: 'Sep 23', gmv: 3275373, bookings: 18044 },
    { month: 'Oct 23', gmv: 4105337, bookings: 17468 },
    { month: 'Nov 23', gmv: 3131545, bookings: 16787 },
    { month: 'Dec 23', gmv: 2082259, bookings: 13646 },
  
    // 2024 (Bank Data ~28.7M)
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
  
    // 2025 (Bank Data ~26.4M)
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
    { month: 'Dec 25', gmv: 1409287, bookings: 33200 },
  ];
  
  export const GMV_SUMMARY = {
    2022: { total: '6.1M SAR', label: 'Launch' },
    2023: { total: '21.3M SAR', label: 'High Growth' },
    2024: { total: '28.7M SAR', label: 'Market Leader' },
    2025: { total: '26.4M SAR', label: 'Optimization' }
  };
  
  // --- UNIT ECONOMICS DATASETS ---
  
  // 1. TICKET SIZE (Revenue Per Match)
  export const TICKET_SIZE_DATA = GMV_DATA.map(d => ({
    month: d.month,
    ticket: d.gmv / (d.bookings || 1)
  }));
  
  // 2. TAKE RATE & COSTS (The Chart you asked to restore)
  export const TAKE_RATE_DATA = GMV_DATA.map(d => ({
    month: d.month,
    gmv: d.gmv,
    grossRevenue: d.gmv * 0.049, // 4.9% Commission
    costOfRevenue: d.gmv * 0.02, // 2% Payment Gateway
    netRevenue: d.gmv * (0.049 - 0.02) // 2.9% Spread
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