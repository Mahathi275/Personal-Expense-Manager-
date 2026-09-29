import React from 'react';
import { PieChart, ChevronRight } from 'lucide-react';
import { Expense, ExpenseCategory, CATEGORIES } from '../types/expense';
import { CategoryIcon } from './CategoryIcon';
import { formatCurrency, calculateCategoryTotals } from '../utils/formatters';

interface CategoryBreakdownProps {
  expenses: Expense[];
  currency: string;
  selectedCategory: ExpenseCategory | 'All';
  onSelectCategory: (category: ExpenseCategory | 'All') => void;
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  expenses,
  currency,
  selectedCategory,
  onSelectCategory,
}) => {
  const totalAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const categoryTotals = calculateCategoryTotals(expenses, totalAmount);

  if (expenses.length === 0) {
    return null;
  }

  return (
    <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <PieChart size={16} className="text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Spending by Category
          </h3>
        </div>
        {selectedCategory !== 'All' && (
          <button
            type="button"
            onClick={() => onSelectCategory('All')}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Show All Categories
          </button>
        )}
      </div>

      <div className="space-y-3">
        {categoryTotals.map((item) => {
          const catMeta = CATEGORIES.find((c) => c.name === item.category);
          const isSelected = selectedCategory === item.category;

          return (
            <button
              key={item.category}
              type="button"
              onClick={() => onSelectCategory(isSelected ? 'All' : item.category)}
              className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                isSelected
                  ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 shadow-xs'
                  : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-md ${
                      catMeta?.bgLight || 'bg-slate-100'
                    } ${catMeta?.accentColor || 'text-slate-700'}`}
                  >
                    <CategoryIcon category={item.category} size={13} />
                  </div>
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                    {item.category}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500 font-mono">
                    ({item.count})
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-semibold font-mono tabular-nums text-slate-900 dark:text-white">
                    {formatCurrency(item.total, currency)}
                  </span>
                  <span className="text-slate-400 font-mono tabular-nums w-12 text-right">
                    {item.percentage.toFixed(1)}%
                  </span>
                  <ChevronRight size={14} className="text-slate-400" />
                </div>
              </div>

              {/* Visual distribution bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-900 dark:bg-slate-200 rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(2, item.percentage)}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
