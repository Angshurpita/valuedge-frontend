import React from "react";

export interface Projection {
  year: string;
  revenue: number;
  ebitda: number;
  fcf: number;
  dfcf: number;
}

interface ValuationResultsProps {
  enterpriseValue: number;
  equityValue: number;
  impliedSharePrice: number;
  sharesOutstanding: number;
  netDebt: number;
  projections?: Projection[];
}

const ValuationResults: React.FC<ValuationResultsProps> = ({
  enterpriseValue,
  equityValue,
  impliedSharePrice,
  sharesOutstanding,
  netDebt,
  projections,
}) => {
  // 🔐 HARD RENDER GUARD (PREVENT BLANK SCREEN)
  if (!projections || projections.length === 0) {
    return null;
  }

  // 🔢 SAFE NUMBER NORMALIZATION
  const EV = Number(enterpriseValue);
  const EQ = Number(equityValue);
  const PRICE = Number(impliedSharePrice);
  const NET_DEBT = Number(netDebt);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 1,
    }).format(val) + "M";

  const formatPrice = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(val);

  const cumulativePV = projections.reduce(
    (sum, p) => sum + Number(p.dfcf || 0),
    0
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <p className="text-xs text-slate-500 uppercase">Enterprise Value</p>
          <div className="text-3xl font-bold text-white">
            {formatCurrency(EV)}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <p className="text-xs text-slate-500 uppercase">Equity Value</p>
          <div className="text-3xl font-bold text-white">
            {formatCurrency(EQ)}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            EV − Net Debt ({formatCurrency(NET_DEBT)})
          </p>
        </div>

        <div className="bg-slate-900 border border-blue-500/40 rounded-xl p-6">
          <p className="text-xs text-blue-400 uppercase">
            Implied Share Price
          </p>
          <div className="text-3xl font-bold text-blue-400">
            {formatPrice(PRICE)}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            {sharesOutstanding}M shares outstanding
          </p>
        </div>
      </div>

      {/* Projection Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-950 text-slate-500">
            <tr>
              <th className="px-6 py-3 text-left">Year</th>
              <th className="px-6 py-3 text-right">Revenue</th>
              <th className="px-6 py-3 text-right">EBITDA</th>
              <th className="px-6 py-3 text-right">FCF</th>
              <th className="px-6 py-3 text-right text-blue-400">PV FCF</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {projections.map((p, i) => (
              <tr key={i} className="hover:bg-slate-800/40">
                <td className="px-6 py-3 font-mono">{p.year}</td>
                <td className="px-6 py-3 text-right">
                  ${Number(p.revenue).toLocaleString()}
                </td>
                <td className="px-6 py-3 text-right">
                  ${Number(p.ebitda).toLocaleString()}
                </td>
                <td className="px-6 py-3 text-right">
                  ${Number(p.fcf).toLocaleString(undefined, { maximumFractionDigits: 1 })}
                </td>
                <td className="px-6 py-3 text-right text-blue-400 font-bold">
                  ${Number(p.dfcf).toLocaleString(undefined, { maximumFractionDigits: 1 })}
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr className="bg-slate-950 font-bold">
              <td colSpan={4} className="px-6 py-4 text-right text-slate-500">
                Cumulative PV of FCF
              </td>
              <td className="px-6 py-4 text-right text-white">
                ${cumulativePV.toLocaleString(undefined, { maximumFractionDigits: 1 })}M
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ValuationResults;

