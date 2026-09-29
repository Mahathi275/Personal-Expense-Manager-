import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Expense, CATEGORIES } from '../types/expense';
import { CategoryIcon } from './CategoryIcon';
import { formatCurrency, formatDate } from '../utils/formatters';

interface ExpenseItemProps {
  expense: Expense;
  currency: string;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string, title: string) => void;
}

export const ExpenseItem: React.FC<ExpenseItemProps> = ({
  expense,
  currency,
  onEdit,
  onDelete,
}) => {
  const catMeta = CATEGORIES.find((c) => c.name === expense.category) || CATEGORIES[CATEGORIES.length - 1];

  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs transition-all duration-150 gap-4">
      {/* Left side: Icon, Title, and Unboxed Metadata */}
      <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
        <div
          className={`flex items-center justify-center w-10 h-10 rounded-lg shrink-0 ${catMeta.bgLight} ${catMeta.accentColor} border ${catMeta.borderLight}`}
          title={expense.category}
        >
          <CategoryIcon category={expense.category} size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
              {expense.title}
            </h4>
          </div>

          {/* Zero-Pill & Metadata Discipline: Unboxed clean text with typographic separators */}
          <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-700 dark:text-slate-300">{expense.category}</span>
            <span aria-hidden="true">·</span>
            <span>{formatDate(expense.date)}</span>
            {expense.notes && (
              <>
                <span aria-hidden="true">·</span>
                <span className="truncate max-w-[240px] text-slate-400 dark:text-slate-500 italic">
                  {expense.notes}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right side: Amount (tabular figures) & Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
        <span className="text-base font-semibold font-mono tabular-nums text-slate-900 dark:text-white">
          {formatCurrency(expense.amount, currency)}
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(expense)}
            className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title={`Edit ${expense.title}`}
            aria-label={`Edit ${expense.title}`}
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(expense.id, expense.title)}
            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
            title={`Delete ${expense.title}`}
            aria-label={`Delete ${expense.title}`}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
