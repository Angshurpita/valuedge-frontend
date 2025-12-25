import React, { useState } from "react";
import { runDCF } from "../geminiService";
import ValuationResults, { Projection } from "./ValuationResults";
import { FinancialInput, FinancialSectionHeader } from "./Common";

/* -----------------------------
   TYPES
------------------------------ */

interface DCFInputs {
  baseRevenue: number;
  revenueGrowth: number;
  ebitdaMargin: number;
  taxRate: number;
  capexPercent: number;
  nwcPercent: number;
  wacc: number;
  terminalGrowth: number;
  netDebt: number;
  sharesOutstanding: number;
}

interface DCFViewProps {
  onResult?: (res: {
    enterpriseValue: number;
    impliedSharePrice: number;
  }) => void;
}

/* -----------------------------
   COMPONENT
------------------------------ */

const DCFView: React.FC<DCFViewProps> = ({ onResult }) => {
  const [inputs, setInputs] = useState<DCFInputs>({
    baseRevenue: 1200,
    revenueGrowth: 0.12,
    ebitdaMargin: 0.25,
    taxRate: 0.21,
    capexPercent: 0.05,
    nwcPercent: 0.02,
    wacc: 0.085,
    terminalGrowth: 0.02,
    netDebt: 450,
    sharesOutstanding: 100,
  });

  const [isCalculating, setIsCalculating] = useState(false);
  const [valuationResult, setValuationResult] = useState<any>(null);

  /* -----------------------------
     RUN DCF (BACKEND)
  ------------------------------ */

  const handleRunValuation = async () => {
    try {
      setIsCalculating(true);

      const payload = {
        revenue: inputs.baseRevenue,
        revenue_growth: inputs.revenueGrowth,
        ebitda_margin: inputs.ebitdaMargin,
        tax_rate: inputs.taxRate,
        capex_percent: inputs.capexPercent,
        wc_percent: inputs.nwcPercent,
        wacc: inputs.wacc,
        terminal_growth: inputs.terminalGrowth,
        years: 5,
      };

      const result = await runDCF(payload);
      setValuationResult(result);

      // 🔗 EMIT REAL RESULTS UPWARD
      const enterpriseValue = Number(result.valuation.enterprise_value);
      const equityValue = enterpriseValue - inputs.netDebt;
      const impliedSharePrice =
        inputs.sharesOutstanding > 0
          ? equityValue / inputs.sharesOutstanding
          : 0;

      onResult?.({
        enterpriseValue,
        impliedSharePrice,
      });
    } catch (error) {
      console.error(error);
      alert("DCF valuation failed");
    } finally {
      setIsCalculating(false);
    }
  };

  /* -----------------------------
     DERIVED DISPLAY VALUES
  ------------------------------ */

  const enterpriseValue = Number(
    valuationResult?.valuation?.enterprise_value ?? 0
  );

  const equityValue = enterpriseValue - inputs.netDebt;

  const impliedSharePrice =
    inputs.sharesOutstanding > 0
      ? equityValue / inputs.sharesOutstanding
      : 0;

  const projections: Projection[] =
    valuationResult?.fcffs?.map((fcf: number, i: number) => ({
      year: `${2025 + i}E`,
      revenue: 0,
      ebitda: 0,
      fcf,
      dfcf: valuationResult.valuation.discounted_fcffs[i],
    })) ?? [];

  /* -----------------------------
     RENDER
  ------------------------------ */

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <FinancialSectionHeader
        title="Discounted Cash Flow Parameters"
        description="Unlevered free cash flow valuation powered by backend model"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Operating */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Operating</h3>
          <div className="space-y-5">
            <FinancialInput
              label="Revenue (LTM)"
              value={inputs.baseRevenue}
              onChange={(v) => setInputs({ ...inputs, baseRevenue: v })}
              suffix="$M"
            />
            <FinancialInput
              label="Revenue Growth"
              value={inputs.revenueGrowth * 100}
              onChange={(v) =>
                setInputs({ ...inputs, revenueGrowth: v / 100 })
              }
              suffix="%"
            />
            <FinancialInput
              label="EBITDA Margin"
              value={inputs.ebitdaMargin * 100}
              onChange={(v) =>
                setInputs({ ...inputs, ebitdaMargin: v / 100 })
              }
              suffix="%"
            />
          </div>
        </div>

        {/* Capital Structure */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">
            Capital Structure
          </h3>
          <div className="space-y-5">
            <FinancialInput
              label="Tax Rate"
              value={inputs.taxRate * 100}
              onChange={(v) => setInputs({ ...inputs, taxRate: v / 100 })}
              suffix="%"
            />
            <FinancialInput
              label="Net Debt"
              value={inputs.netDebt}
              onChange={(v) => setInputs({ ...inputs, netDebt: v })}
              suffix="$M"
            />
            <FinancialInput
              label="Shares Outstanding"
              value={inputs.sharesOutstanding}
              onChange={(v) =>
                setInputs({ ...inputs, sharesOutstanding: v })
              }
              suffix="M"
            />
          </div>
        </div>

        {/* Valuation */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Valuation</h3>
          <div className="space-y-5">
            <FinancialInput
              label="WACC"
              value={inputs.wacc * 100}
              onChange={(v) => setInputs({ ...inputs, wacc: v / 100 })}
              suffix="%"
            />
            <FinancialInput
              label="Terminal Growth"
              value={inputs.terminalGrowth * 100}
              onChange={(v) =>
                setInputs({ ...inputs, terminalGrowth: v / 100 })
              }
              suffix="%"
            />

            <button
              onClick={handleRunValuation}
              disabled={isCalculating}
              className="w-full mt-4 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700"
            >
              {isCalculating ? "Calculating..." : "Run Valuation"}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {valuationResult ? (
        <ValuationResults
          enterpriseValue={enterpriseValue}
          equityValue={equityValue}
          impliedSharePrice={impliedSharePrice}
          sharesOutstanding={inputs.sharesOutstanding}
          netDebt={inputs.netDebt}
          projections={projections}
        />
      ) : (
        <div className="text-center text-slate-500 italic py-20">
          Enter assumptions and run valuation
        </div>
      )}
    </div>
  );
};

export default DCFView;

