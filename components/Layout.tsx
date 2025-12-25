import React from "react";

type View = "DCF" | "SENSITIVITY" | "COMPS" | "REPORTS";

interface LayoutProps {
  children: React.ReactNode;
  activeView: View;
  setActiveView: (view: View) => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  activeView,
  setActiveView,
}) => {
  const tabClass = (view: View) =>
    `px-4 py-2 rounded-lg font-semibold transition ${
      activeView === view
        ? "bg-blue-600 text-white"
        : "text-slate-300 hover:text-white"
    }`;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top Navigation */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <div className="flex items-center gap-2 font-bold text-lg">
          <span className="text-blue-500">V</span>
          ValuEdgePro
        </div>

        <div className="flex gap-2">
          <button className={tabClass("DCF")} onClick={() => setActiveView("DCF")}>
            DCF Valuation
          </button>
          <button
            className={tabClass("COMPS")}
            onClick={() => setActiveView("COMPS")}
          >
            Comparable Analysis
          </button>
          <button
            className={tabClass("SENSITIVITY")}
            onClick={() => setActiveView("SENSITIVITY")}
          >
            Sensitivity Analysis
          </button>
          <button
            className={tabClass("REPORTS")}
            onClick={() => setActiveView("REPORTS")}
          >
            Reports
          </button>
        </div>
      </div>

      {/* Page Content */}
      <div className="px-6 py-8">{children}</div>
    </div>
  );
};

export default Layout;

