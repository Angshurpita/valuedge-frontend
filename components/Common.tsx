
import React from 'react';

/**
 * Reusable Numeric Input field tailored for financial modeling.
 * Supports prefixes ($), suffixes (%), and localized numeric formatting.
 */
interface FinancialInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  prefix?: string;
  suffix?: string;
  step?: string;
  placeholder?: string;
}

export const FinancialInput: React.FC<FinancialInputProps> = ({
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = "0.01",
  placeholder
}) => {
  return (
    <div className="space-y-1.5 w-full">
      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
        {label}
      </label>
      <div className="relative group">
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-slate-500 text-xs font-mono">{prefix}</span>
          </div>
        )}
        <input
          type="number"
          step={step}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className={`w-full bg-slate-900 border border-slate-800 rounded-lg py-2 text-sm mono text-white transition-all
            focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500
            ${prefix ? 'pl-7' : 'pl-3'} ${suffix ? 'pr-8' : 'pr-3'}`}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-slate-500 text-xs font-mono">{suffix}</span>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Metric card for high-level financial KPIs.
 */
interface FinancialMetricCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  variant?: 'blue' | 'emerald' | 'slate' | 'rose';
  icon?: React.ReactNode;
}

export const FinancialMetricCard: React.FC<FinancialMetricCardProps> = ({
  title,
  value,
  subtext,
  variant = 'slate',
  icon
}) => {
  const colorMap = {
    blue: 'border-blue-500/30 bg-blue-500/5 text-blue-400',
    emerald: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400',
    rose: 'border-rose-500/30 bg-rose-500/5 text-rose-400',
    slate: 'border-slate-800 bg-slate-900 text-white',
  };

  return (
    <div className={`p-5 rounded-xl border shadow-sm transition-all hover:shadow-md ${colorMap[variant]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">
          {title}
        </span>
        {icon && <div className="opacity-80">{icon}</div>}
      </div>
      <div className="text-2xl font-bold mono truncate">
        {value}
      </div>
      {subtext && (
        <p className="text-[10px] mt-2 opacity-50 italic">
          {subtext}
        </p>
      )}
    </div>
  );
};

/**
 * Enhanced Table Row with highlight support for median/mean or focused data points.
 */
interface FinancialTableRowProps {
  children: React.ReactNode;
  isHighlighted?: boolean;
  className?: string;
}

export const FinancialTableRow: React.FC<FinancialTableRowProps> = ({
  children,
  isHighlighted = false,
  className = ""
}) => {
  return (
    <tr className={`transition-colors border-b border-slate-800/50 
      ${isHighlighted ? 'bg-slate-800 font-bold' : 'hover:bg-slate-900/60'} 
      ${className}`}>
      {children}
    </tr>
  );
};

/**
 * Section Header / Divider with title for organizing complex financial dashboards.
 */
interface FinancialSectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const FinancialSectionHeader: React.FC<FinancialSectionHeaderProps> = ({
  title,
  description,
  action
}) => {
  return (
    <div className="flex items-end justify-between border-b border-slate-800 pb-4 mb-6">
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
        {description && <p className="text-xs text-slate-500 uppercase tracking-widest">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};
