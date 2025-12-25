
export enum AppView {
  DCF = 'DCF Valuation',
  COMPS = 'Comparable Analysis',
  SENSITIVITY = 'Sensitivity Analysis',
  REPORTS = 'Reports'
}

export interface FinancialMetric {
  year: number;
  revenue: number;
  ebitda: number;
  taxRate: number;
  capex: number;
  changeInNWC: number;
  fcf: number;
}

export interface CompCompany {
  name: string;
  ticker: string;
  marketCap: number;
  ev: number;
  revenue: number;
  ebitda: number;
  peRatio: number;
  evEbitda: number;
}

export interface ValuationState {
  metrics: FinancialMetric[];
  wacc: number;
  terminalGrowthRate: number;
  terminalExitMultiple: number;
  useExitMultiple: boolean;
}
