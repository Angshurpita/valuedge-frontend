import React, { useState } from "react";
import Plot from "react-plotly.js";
import { runSensitivity } from "../geminiService";
import { FinancialInput, FinancialSectionHeader } from "./Common";

const SensitivityView: React.FC = () => {
  // -------------------------------
  // STATE
  // -------------------------------
  const [inputs, setInputs] = useState({
    revenue: 1200,
    revenue_growth: 0.12,
    ebitda_margin: 0.25,
    tax_rate: 0.21,
    capex_percent: 0.05,
    wc_percent: 0.02,
    wacc: 0.085,
    terminal_growth: 0.02,
    years: 5,
  });

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"EV" | "EQ">("EV");

  // -------------------------------
  // RUN SENSITIVITY
  // -------------------------------
  const runHeatmap = async () => {
    try {
      setLoading(true);
      const result = await runSensitivity(inputs);
      setData(result);
    } catch (e) {
      console.error(e);
      alert("Sensitivity analysis failed");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // MATRIX SELECTION (EV / EQ)
  // -------------------------------
  const NET_DEBT = 450; // can be made dynamic later

  const zMatrix =
    mode === "EV"
      ? data?.enterprise_value_matrix
      : data?.enterprise_value_matrix?.map((row: number[]) =>
          row.map((ev) => (ev !== null ? ev - NET_DEBT : null))
        );

  // -------------------------------
  // RENDER
  // -------------------------------
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <FinancialSectionHeader
        title="DCF Sensitivity Analysis"
        description="Value sensitivity to WACC and terminal growth"
      />

      {/* EV / Equity Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode("EV")}
          className={`px-4 py-1.5 rounded-lg font-semibold ${
            mode === "EV"
              ? "bg-blue-600 text-white"
              : "bg-slate-700 text-slate-300"
          }`}
        >
          Enterprise Value
        </button>

        <button
          onClick={() => setMode("EQ")}
          className={`px-4 py-1.5 rounded-lg font-semibold ${
            mode === "EQ"
              ? "bg-blue-600 text-white"
              : "bg-slate-700 text-slate-300"
          }`}
        >
          Equity Value
        </button>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FinancialInput
          label="WACC"
          value={inputs.wacc * 100}
          onChange={(v) => setInputs({ ...inputs, wacc: v / 100 })}
          suffix="%"
        />
        <FinancialInput
          label="Terminal Growth"
          value={inputs.terminal_growth * 100}
          onChange={(v) =>
            setInputs({ ...inputs, terminal_growth: v / 100 })
          }
          suffix="%"
        />
        <button
          onClick={runHeatmap}
          className="mt-6 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500"
        >
          {loading ? "Running..." : "Run Sensitivity"}
        </button>
      </div>

      {/* Heatmap */}
      {data && (
        <Plot
          data={[
            {
              z: zMatrix,
              x: data.wacc_values.map((w: number) =>
                (w * 100).toFixed(1) + "%"
              ),
              y: data.terminal_growth_values.map((g: number) =>
                (g * 100).toFixed(1) + "%"
              ),
              type: "heatmap",
              colorscale: "Viridis",
              hovertemplate: `${mode}: $%{z:,.0f}<br>WACC: %{x}<br>g: %{y}<extra></extra>`,
            },
          ]}
          layout={{
            title: `${mode === "EV" ? "Enterprise" : "Equity"} Value Sensitivity`,
            paper_bgcolor: "#020617",
            plot_bgcolor: "#020617",
            font: { color: "#e5e7eb" },
            xaxis: { title: "WACC" },
            yaxis: { title: "Terminal Growth" },
          }}
          style={{ width: "100%", height: "520px" }}
        />
      )}
    </div>
  );
};

export default SensitivityView;


