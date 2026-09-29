import React from 'react';
import { Search, X, ArrowUpDown, Filter, Plus, RotateCcw } from 'lucide-react';
import { Expense, ExpenseCategory, SortField, CATEGORIES } from '../types/expense';
import { ExpenseItem } from './ExpenseItem';

interface ExpenseListProps {
  expenses: Expense[];
  currency: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: ExpenseCategory | 'All';
  onCategoryChange: (category: ExpenseCategory | 'All') => void;
  sortOption: SortField;
  onSortChange: (sort: SortField) => void;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string, title: string) => void;
  onOpenAddModal: () => void;
  onResetFilters: () => void;
  onRestoreSampleData: () => void;
  totalUnfilteredCount: number;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  currency,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortOption,
  onSortChange,
  onEdit,
  onDelete,
  onOpenAddModal,
  onResetFilters,
  onRestoreSampleData,
  totalUnfilteredCount,
}) => {
  const isFiltering = searchQuery.trim() !== '' || selectedCategory !== 'All';

  return (
    <div className="space-y-4">
      {/* Control Bar: Search, Category Filter, and Sort */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search size={15} />
            </span>
            <input
              type="text"
              placeholder="Search expenses by title or note..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Category Dropdown */}
            <div className="relative flex-1 sm:flex-initial sm:w-48">
              <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                <Filter size={14} />
              </span>
              <select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value as ExpenseCategory | 'All')}
                className="w-full pl-8 pr-7 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:bg-white transition-all appearance-none cursor-pointer"
                aria-label="Filter by category"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex-1 sm:flex-initial sm:w-44">
              <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                <ArrowUpDown size={14} />
              </span>
              <select
                value={sortOption}
                onChange={(e) => onSortChange(e.target.value as SortField)}
                className="w-full pl-8 pr-7 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:bg-white transition-all appearance-none cursor-pointer"
                aria-label="Sort expenses"
              >
                <option value="date-desc">Date: Newest First</option>
                <option value="date-asc">Date: Oldest First</option>
                <option value="amount-desc">Amount: High to Low</option>
                <option value="amount-asc">Amount: Low to High</option>
                <option value="title-asc">Title: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter status & quick reset */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
          <div className="flex items-center gap-2">
            <span>
              Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{expenses.length}</span> of{' '}
              <span className="font-semibold text-slate-800 dark:text-slate-200">{totalUnfilteredCount}</span> expenses
            </span>
            {isFiltering && (
              <span className="text-slate-400">
                (filtered)
              </span>
            )}
          </div>

          {isFiltering && (
            <button
              type="button"
              onClick={onResetFilters}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Expense List Items or Empty State */}
      {expenses.length > 0 ? (
        <div className="space-y-2.5">
          {expenses.map((expense) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              currency={currency}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="p-10 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <Search size={20} />
          </div>
          <div className="max-w-sm mx-auto">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              {totalUnfilteredCount === 0 ? 'No expenses recorded yet' : 'No matching expenses found'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {totalUnfilteredCount === 0
                ? 'Start tracking your daily personal budget by recording your first expense entry.'
                : 'Try adjusting your search terms or resetting the category filter to view more results.'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            {totalUnfilteredCount === 0 ? (
              <>
                <button
                  type="button"
                  onClick={onOpenAddModal}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <Plus size={14} />
                  Record First Expense
                </button>
                <button
                  type="button"
                  onClick={onRestoreSampleData}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <RotateCcw size={14} />
                  Load Sample Data
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onResetFilters}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Reset Search & Filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
