// data/dashboard-data.ts

export type FinancialData = {
    month: string;
    revenue: number | null;
    expenses: number | null;
    burn: number | null;
  };
  
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
    { month: 'Oct', revenue: null, expenses: null, burn: null },
    { month: 'Nov', revenue: null, expenses: null, burn: null },
    { month: 'Dec', revenue: null, expenses: null, burn: null },
  ];
  
  // PAYROLL HISTORY FOR CHARTS
  export const PAYROLL_2024 = [
    { x: 'Jan', y: 123862 }, { x: 'Feb', y: 63375 }, { x: 'Mar', y: 136638 },
    { x: 'Apr', y: 71014 }, { x: 'May', y: 66638 }, { x: 'Jun', y: 75338 },
    { x: 'Jul', y: 73138 }, { x: 'Aug', y: 82005 }, { x: 'Sep', y: 74014 },
    { x: 'Oct', y: 76801 }, { x: 'Nov', y: 74138 }, { x: 'Dec', y: 74184 }
  ];
  
  export const PAYROLL_2025 = [
    { x: 'Jan', y: 74138 }, { x: 'Feb', y: 74138 }, { x: 'Mar', y: 74138 },
    { x: 'Apr', y: 74138 }, { x: 'May', y: 74138 }, { x: 'Jun', y: 67528 },
    { x: 'Jul', y: 67528 }, { x: 'Aug', y: 78574 }, { x: 'Sep', y: 78138 },
    { x: 'Oct', y: null }, { x: 'Nov', y: null }, { x: 'Dec', y: null }
  ];
  
  // EXPORTED BREAKDOWN DATA (THIS WAS MISSING)
  export const BREAKDOWN_DATA = {
    2024: {
      payroll: { total: '991,151 SAR', trend: 'Volatile', history: PAYROLL_2024 },
      tech: { dev: '420,000 SAR', subs: '18,500 SAR' },
      debt: { bank: '103,333 SAR/mo', clubs: '1,038,701 SAR' }
    },
    2025: {
      payroll: { total: '662,464 SAR (YTD)', trend: 'Stabilizing', history: PAYROLL_2025 },
      tech: { dev: 'Stopped (Oct)', subs: '22,196 SAR' },
      debt: { bank: '103,333.33 SAR/mo', clubs: '2,035,594 SAR' }
    }
  };