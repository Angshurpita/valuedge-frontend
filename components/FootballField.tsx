import Plot from "react-plotly.js";

interface FootballFieldProps {
  dcfValue: number; // Enterprise Value ($M)
  compsMin: number;
  compsMedian: number;
  compsMax: number;
}

const FootballField = ({
  dcfValue,
  compsMin,
  compsMedian,
  compsMax,
}: FootballFieldProps) => {
  const format = (v: number) =>
    `$${Number(v).toLocaleString(undefined, { maximumFractionDigits: 0 })}M`;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <Plot
        data={[
          // COMPS RANGE (BAR)
          {
            type: "bar",
            orientation: "h",
            y: ["Comparable Companies"],
            x: [compsMax - compsMin],
            base: [compsMin],
            marker: { color: "#22c55e" },
            hovertemplate:
              `COMPS Range<br>${format(compsMin)} – ${format(compsMax)}<extra></extra>`,
          },
          // COMPS MEDIAN (MARKER)
          {
            type: "scatter",
            mode: "markers",
            y: ["Comparable Companies"],
            x: [compsMedian],
            marker: { color: "#16a34a", size: 10 },
            hovertemplate:
              `COMPS Median<br>${format(compsMedian)}<extra></extra>`,
          },
          // DCF POINT
          {
            type: "scatter",
            mode: "markers",
            y: ["DCF Valuation"],
            x: [dcfValue],
            marker: { color: "#3b82f6", size: 12, symbol: "line-ns" },
            hovertemplate:
              `DCF Value<br>${format(dcfValue)}<extra></extra>`,
          },
        ]}
        layout={{
          title: "Valuation Football Field (Enterprise Value)",
          paper_bgcolor: "#020617",
          plot_bgcolor: "#020617",
          font: { color: "#e5e7eb" },
          xaxis: { title: "Enterprise Value ($M)", zeroline: false },
          yaxis: { automargin: true },
          barmode: "overlay",
          height: 300,
          margin: { l: 140, r: 40, t: 50, b: 50 },
        }}
        config={{ displayModeBar: false }}
      />
    </div>
  );
};

export default FootballField;

