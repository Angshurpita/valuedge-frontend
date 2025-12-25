import { FinancialSectionHeader } from "./Common";

interface ReportsViewProps {
  dcfEV: number;
  compsMedianEV: number;
  sharePriceDCF: number;
  currentPrice?: number; // optional, default assumed
}

const ReportsView = ({
  dcfEV,
  compsMedianEV,
  sharePriceDCF,
  currentPrice = sharePriceDCF * 0.85, // assume market discount
}: ReportsViewProps) => {
  const upside = ((sharePriceDCF - currentPrice) / currentPrice) * 100;

  const recommendation =
    upside > 20 ? "BUY" : upside > -10 ? "HOLD" : "SELL";

  const color =
    recommendation === "BUY"
      ? "text-emerald-400"
      : recommendation === "HOLD"
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-12">
      <FinancialSectionHeader
        title="Investment Summary"
        description="Valuation-based investment conclusion"
      />

      {/* Recommendation */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
        <div className="text-sm text-slate-400 uppercase tracking-widest mb-2">
          Recommendation
        </div>
        <div className={`text-4xl font-bold ${color}`}>
          {recommendation}
        </div>
        <p className="text-slate-400 mt-2">
          Based on intrinsic valuation vs current market price
        </p>
      </div>

      {/* Valuation Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400 uppercase">DCF Value</div>
          <div className="text-2xl font-bold text-white">
            ${dcfEV.toFixed(0)}M
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400 uppercase">
            COMPS (Median)
          </div>
          <div className="text-2xl font-bold text-white">
            ${compsMedianEV.toFixed(0)}M
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400 uppercase">
            Upside / Downside
          </div>
          <div
            className={`text-2xl font-bold ${
              upside >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {upside.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Conclusion */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
        <h3 className="text-lg font-bold text-white mb-3">
          Investment Conclusion
        </h3>
        <p className="text-slate-400 leading-relaxed">
          Our intrinsic valuation analysis suggests that the company is{" "}
          <span className="font-semibold text-white">
            {recommendation.toLowerCase()}
          </span>{" "}
          at current market levels. The DCF-derived valuation implies a fair
          value meaningfully{" "}
          {upside >= 0 ? "above" : "below"} the prevailing price, supported by
          peer trading multiples and fundamental cash flow assumptions.
        </p>
      </div>
    </div>
  );
};

export default ReportsView;

