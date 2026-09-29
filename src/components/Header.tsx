import React from 'react';
import { Plus, Download, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onOpenAddModal: () => void;
  onExportCSV: () => void;
  onRestoreSampleData: () => void;
  currency: string;
  onCurrencyChange: (newCurrency: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddModal,
  onExportCSV,
  onRestoreSampleData,
  currency,
  onCurrencyChange,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand title wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap"
          >
            Personal Expense Manager
          </a>
        </div>

        {/* Zone 2: Clean navigation context / controls */}
        <div className="hidden md:flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span>Currency:</span>
          <select
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value)}
            className="px-2 py-1 text-xs font-mono font-medium bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
            aria-label="Select currency"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="INR">INR (₹)</option>
            <option value="CAD">CAD ($)</option>
            <option value="AUD">AUD ($)</option>
            <option value="JPY">JPY (¥)</option>
          </select>

          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">|</span>

          <button
            type="button"
            onClick={onRestoreSampleData}
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            title="Reload default sample expenses"
          >
            <RotateCcw size={12} />
            <span>Reset Demo Data</span>
          </button>
        </div>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-lg transition-colors whitespace-nowrap"
            title="Download CSV ledger"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            <Plus size={15} />
            <span>Add Expense</span>
          </button>
        </div>
      </div>
    </header>
  );
};
