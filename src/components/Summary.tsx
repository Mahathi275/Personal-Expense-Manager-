import React from 'react';
import { Wallet, TrendingUp, Receipt, Award } from 'lucide-react';
import { Expense } from '../types/expense';
import { formatCurrency, calculateCategoryTotals } from '../utils/formatters';

interface SummaryProps {
  expenses: Expense[];
  filteredExpenses: Expense[];
  currency: string;
  monthlyBudget: number;
  onUpdateBudget: (newBudget: number) => void;
}

export const Summary: React.FC<SummaryProps> = ({
  expenses,
  filteredExpenses,
  currency,
  monthlyBudget,
  onUpdateBudget,
}) => {
  // Overall total
  const totalAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Filtered total (if user searched or filtered)
  const filteredTotal = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const isFiltered = expenses.length !== filteredExpenses.length;

  // Average expense calculation
  const averageExpense = expenses.length > 0 ? totalAmount / expenses.length : 0;

  // Top spending category
  const categoryTotals = calculateCategoryTotals(expenses, totalAmount);
  const topCategory = categoryTotals.length > 0 ? categoryTotals[0] : null;

  // Budget calculations
  const budgetPercent = monthlyBudget > 0 ? Math.min(100, Math.round((totalAmount / monthlyBudget) * 100)) : 0;
  const isOverBudget = monthlyBudget > 0 && totalAmount > monthlyBudget;

  return (
    <div className="space-y-4">
      {/* 4 Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Spending */}
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium tracking-wide">Total Expenses</span>
            <span className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-700 dark:text-slate-300">
              <Wallet size={15} />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {formatCurrency(totalAmount, currency)}
            </h3>
          </div>
          {isFiltered && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono tabular-nums">
              Filtered: {formatCurrency(filteredTotal, currency)}
            </p>
          )}
        </div>

        {/* Transactions Count */}
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium tracking-wide">Total Transactions</span>
            <span className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-700 dark:text-slate-300">
              <Receipt size={15} />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {expenses.length}
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">entries recorded</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isFiltered ? `${filteredExpenses.length} matching current filter` : 'Active records in database'}
          </p>
        </div>

        {/* Average Transaction */}
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium tracking-wide">Average Transaction</span>
            <span className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-700 dark:text-slate-300">
              <TrendingUp size={15} />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {formatCurrency(averageExpense, currency)}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Per recorded purchase
          </p>
        </div>

        {/* Top Spending Category */}
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium tracking-wide">Top Category</span>
            <span className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-700 dark:text-slate-300">
              <Award size={15} />
            </span>
          </div>
          {topCategory ? (
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                {topCategory.category}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono tabular-nums">
                {formatCurrency(topCategory.total, currency)} ({topCategory.percentage.toFixed(1)}% of total)
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-400 mt-2">No category data yet</p>
          )}
        </div>
      </div>

      {/* Budget Progress Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Monthly Budget Tracking</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
              ({formatCurrency(totalAmount, currency)} of {formatCurrency(monthlyBudget, currency)})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">Budget Limit:</span>
            <input
              type="number"
              min="100"
              step="50"
              value={monthlyBudget}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val) && val >= 0) onUpdateBudget(val);
              }}
              className="w-24 px-2 py-0.5 text-xs font-mono tabular-nums bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              title="Change monthly budget limit"
            />
          </div>
        </div>

        {/* Progress bar line */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              isOverBudget
                ? 'bg-rose-500'
                : budgetPercent > 80
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, (totalAmount / (monthlyBudget || 1)) * 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
          <span>
            {isOverBudget ? (
              <span className="text-rose-600 dark:text-rose-400 font-medium">
                Over budget by {formatCurrency(totalAmount - monthlyBudget, currency)}
              </span>
            ) : (
              <span>
                {formatCurrency(Math.max(0, monthlyBudget - totalAmount), currency)} remaining
              </span>
            )}
          </span>
          <span className="font-mono tabular-nums font-medium">
            {((totalAmount / (monthlyBudget || 1)) * 100).toFixed(1)}% utilized
          </span>
        </div>
      </div>
    </div>
  );
};
