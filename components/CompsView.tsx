import { useState } from "react";
import { runComps, exportPDF } from "../geminiService";
import { FinancialInput, FinancialSectionHeader } from "./Common";
import FootballField from "./FootballField";

/* -----------------------------
   TYPES
------------------------------ */

interface CompsViewProps {
  dcfEV?: number; // real DCF EV passed from App
  onResult?: (res: any) => void;
}

/* -----------------------------
   COMPONENT
------------------------------ */

const CompsView: React.FC<CompsViewProps> = ({ dcfEV, onResult }) => {
  const [ebitda, setEbitda] = useState(300);
  const [netDebt, setNetDebt] = useState(450);
  const [shares, setShares] = useState(100);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const peers = [
    { name: "Peer A", multiple: 8 },
    { name: "Peer B", multiple: 10 },
    { name: "Peer C", multiple: 12 },
  ];

  /* -----------------------------
     RUN COMPS
  ------------------------------ */

  const runAnalysis = async () => {
    try {
      setLoading(true);

      const res = await runComps({
        peers: peers.map((p) => ({
          name: String(p.name),
          multiple: Number(p.multiple),
        })),
        metric_value: Number(ebitda),
        net_debt: Number(netDebt),
        shares_outstanding: Number(shares),
      });

      setResult(res);

      // 🔗 EMIT RESULT UPWARD
      onResult?.(res);
    } catch (e) {
      console.error("COMPS ERROR:", e);
      alert("Comps failed — check console");
    } finally {
      setLoading(false);
    }
  };

  // 🔐 SAFE ACCESS
  const ev = result?.enterprise_value;
  const price = result?.implied_price;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <FinancialSectionHeader
        title="Comparable Company Analysis"
        description="Valuation range based on peer trading multiples"
      />

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FinancialInput
          label="EBITDA"
          value={ebitda}
          onChange={setEbitda}
          suffix="$M"
        />
        <FinancialInput
          label="Net Debt"
          value={netDebt}
          onChange={setNetDebt}
          suffix="$M"
        />
        <FinancialInput
          label="Shares Outstanding"
          value={shares}
          onChange={setShares}
          suffix="M"
        />
      </div>

      {/* Run Button */}
      <button
        onClick={runAnalysis}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white"
      >
        {loading ? "Running..." : "Run Comps"}
      </button>

      {/* Results */}
      {result && ev && price && (
        <>
          <div className="bg-slate-900 p-6 rounded-xl space-y-4 border border-slate-800">
            <div>
              <div className="font-semibold text-slate-400">
                Implied Enterprise Value ($M)
              </div>
              <div className="text-lg font-bold text-white">
                {Number(ev.min).toFixed(0)} —{" "}
                {Number(ev.median).toFixed(0)} —{" "}
                {Number(ev.max).toFixed(0)}
              </div>
            </div>

            <div>
              <div className="font-semibold text-slate-400">
                Implied Share Price ($)
              </div>
              <div className="text-lg font-bold text-emerald-400">
                {Number(price.min).toFixed(2)} —{" "}
                {Number(price.median).toFixed(2)} —{" "}
                {Number(price.max).toFixed(2)}
              </div>
            </div>
          </div>

          {/* 🏈 Football Field (REAL DATA) */}
          {dcfEV && (
            <FootballField
              dcfValue={dcfEV}
              compsMin={Number(ev.min)}
              compsMedian={Number(ev.median)}
              compsMax={Number(ev.max)}
            />
          )}

          {/* 📄 Export PDF */}
          {dcfEV && (
            <button
              onClick={() =>
                exportPDF({
                  dcf: {
                    enterprise_value: dcfEV,
                    equity_value: dcfEV - netDebt,
                    share_price: (dcfEV - netDebt) / shares,
                  },
                  comps: {
                    ev_min: ev.min,
                    ev_median: ev.median,
                    ev_max: ev.max,
                    px_min: price.min,
                    px_median: price.median,
                    px_max: price.max,
                  },
                })
              }
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-white"
            >
              Export PDF
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default CompsView;

