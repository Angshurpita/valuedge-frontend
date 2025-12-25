
import React from 'react';
import { AppView, FinancialMetric, CompCompany } from './types';

export const INITIAL_METRICS: FinancialMetric[] = [
  { year: 2024, revenue: 1200, ebitda: 300, taxRate: 0.21, capex: 50, changeInNWC: 10, fcf: 177 },
  { year: 2025, revenue: 1350, ebitda: 340, taxRate: 0.21, capex: 55, changeInNWC: 12, fcf: 201 },
  { year: 2026, revenue: 1520, ebitda: 385, taxRate: 0.21, capex: 60, changeInNWC: 15, fcf: 229 },
  { year: 2027, revenue: 1710, ebitda: 440, taxRate: 0.21, capex: 65, changeInNWC: 18, fcf: 265 },
  { year: 2028, revenue: 1920, ebitda: 500, taxRate: 0.21, capex: 70, changeInNWC: 20, fcf: 305 },
];

export const MOCK_COMPS: CompCompany[] = [
  { name: 'Alpha Corp', ticker: 'ALPH', marketCap: 15000, ev: 16500, revenue: 4500, ebitda: 900, peRatio: 22.4, evEbitda: 18.3 },
  { name: 'Beta Solutions', ticker: 'BETA', marketCap: 12400, ev: 13000, revenue: 3800, ebitda: 750, peRatio: 19.8, evEbitda: 17.3 },
  { name: 'Gamma Tech', ticker: 'GAMM', marketCap: 28000, ev: 29500, revenue: 7200, ebitda: 1600, peRatio: 25.1, evEbitda: 18.4 },
  { name: 'Delta Systems', ticker: 'DELT', marketCap: 9800, ev: 11200, revenue: 3100, ebitda: 550, peRatio: 18.5, evEbitda: 20.4 },
  { name: 'Epsilon Industries', ticker: 'EPSI', marketCap: 19200, ev: 21000, revenue: 5600, ebitda: 1100, peRatio: 21.0, evEbitda: 19.1 },
];

export const NAV_ITEMS = [
  { id: AppView.DCF, label: 'DCF Valuation' },
  { id: AppView.COMPS, label: 'Comparable Analysis' },
  { id: AppView.SENSITIVITY, label: 'Sensitivity Analysis' },
  { id: AppView.REPORTS, label: 'Reports' },
];
