import { useState } from "react";
import Layout from "./components/Layout";
import DCFView from "./components/DCFView";
import SensitivityView from "./components/SensitivityView";
import CompsView from "./components/CompsView";
import ReportsView from "./components/ReportsView";

type View = "DCF" | "SENSITIVITY" | "COMPS" | "REPORTS";

function App() {
  const [activeView, setActiveView] = useState<View>("DCF");

  // 🔗 GLOBAL CONNECTED STATE
  const [dcfEV, setDcfEV] = useState<number | null>(null);
  const [dcfSharePrice, setDcfSharePrice] = useState<number | null>(null);
  const [compsMedianEV, setCompsMedianEV] = useState<number | null>(null);

  // ✅ SAFE UNLOCK CONDITIONS
  const hasDCF = dcfEV !== null && dcfSharePrice !== null;
  const hasComps = compsMedianEV !== null;

  return (
    <Layout activeView={activeView} setActiveView={setActiveView}>
      {activeView === "DCF" && (
        <DCFView
          onResult={(res) => {
            setDcfEV(res.enterpriseValue);
            setDcfSharePrice(res.impliedSharePrice);
          }}
        />
      )}

      {activeView === "SENSITIVITY" && <SensitivityView />}

      {activeView === "COMPS" && (
        <CompsView
          dcfEV={dcfEV ?? undefined}
          onResult={(res) => {
            setCompsMedianEV(res.enterprise_value.median);
          }}
        />
      )}

      {/* ✅ REPORTS (CONNECTED & SAFE) */}
      {activeView === "REPORTS" && hasDCF && hasComps && (
        <ReportsView
          dcfEV={dcfEV!}
          compsMedianEV={compsMedianEV!}
          sharePriceDCF={dcfSharePrice!}
        />
      )}

      {/* ❌ FALLBACK MESSAGE */}
      {activeView === "REPORTS" && (!hasDCF || !hasComps) && (
        <div className="text-center text-slate-400 py-20">
          Please run{" "}
          <span className="font-semibold text-white">DCF</span> and{" "}
          <span className="font-semibold text-white">COMPS</span> first to
          generate the investment report.
        </div>
      )}
    </Layout>
  );
}

export default App;


