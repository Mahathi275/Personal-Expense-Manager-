/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { Summary } from './components/Summary';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { CategoryBreakdown } from './components/CategoryBreakdown';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { Expense, ExpenseCategory, SortField, INITIAL_EXPENSES } from './types/expense';
import { exportExpensesToCSV } from './utils/formatters';

const STORAGE_KEY = 'personal_expense_manager_data_v1';
const BUDGET_STORAGE_KEY = 'personal_expense_manager_budget_v1';
const CURRENCY_STORAGE_KEY = 'personal_expense_manager_currency_v1';

export default function App() {
  // 1. Initialize expenses from localStorage or fall back to default seed data
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // LocalStorage unavailable or corrupt
    }
    return INITIAL_EXPENSES;
  });

  // 2. Budget and Currency preferences
  const [monthlyBudget, setMonthlyBudget] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(BUDGET_STORAGE_KEY);
      if (saved) return parseFloat(saved);
    } catch {
      // Fallback
    }
    return 1500;
  });

  const [currency, setCurrency] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(CURRENCY_STORAGE_KEY);
      if (saved) return saved;
    } catch {
      // Fallback
    }
    return 'USD';
  });

  // 3. Search, Filter & Sort states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'All'>('All');
  const [sortOption, setSortOption] = useState<SortField>('date-desc');

  // 4. Modal and editing state
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string; title: string }>({
    isOpen: false,
    id: '',
    title: '',
  });

  // Persist expenses
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    } catch {
      // Ignored if storage full
    }
  }, [expenses]);

  // Persist budget
  useEffect(() => {
    try {
      localStorage.setItem(BUDGET_STORAGE_KEY, monthlyBudget.toString());
    } catch {
      // Ignored
    }
  }, [monthlyBudget]);

  // Persist currency
  useEffect(() => {
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
    } catch {
      // Ignored
    }
  }, [currency]);

  // Filter and sort using JavaScript array methods
  const filteredAndSortedExpenses = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return expenses
      .filter((expense) => {
        // Search filter: check title and notes
        const matchesSearch =
          q === '' ||
          expense.title.toLowerCase().includes(q) ||
          (expense.notes && expense.notes.toLowerCase().includes(q));

        // Category filter
        const matchesCategory =
          selectedCategory === 'All' || expense.category === selectedCategory;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        switch (sortOption) {
          case 'date-desc':
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          case 'date-asc':
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          case 'amount-desc':
            return b.amount - a.amount;
          case 'amount-asc':
            return a.amount - b.amount;
          case 'title-asc':
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
  }, [expenses, searchQuery, selectedCategory, sortOption]);

  // Add or Edit Expense Handler
  const handleSaveExpense = (data: Omit<Expense, 'id' | 'createdAt'>) => {
    if (editingExpense) {
      // Edit existing expense using Array.map
      setExpenses((prev) =>
        prev.map((item) =>
          item.id === editingExpense.id
            ? { ...item, ...data }
            : item
        )
      );
      setEditingExpense(null);
    } else {
      // Create new expense with unique ID and current timestamp
      const newExpense: Expense = {
        ...data,
        id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        createdAt: Date.now(),
      };
      setExpenses((prev) => [newExpense, ...prev]);
    }
  };

  // Trigger Edit Form
  const handleOpenEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  // Trigger Delete Confirmation
  const handlePromptDelete = (id: string, title: string) => {
    setDeleteModal({
      isOpen: true,
      id,
      title,
    });
  };

  // Confirm Delete using Array.filter
  const handleConfirmDelete = () => {
    if (!deleteModal.id) return;
    setExpenses((prev) => prev.filter((item) => item.id !== deleteModal.id));
    setDeleteModal({ isOpen: false, id: '', title: '' });
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortOption('date-desc');
  };

  // Restore Sample Seed Data
  const handleRestoreSampleData = () => {
    setExpenses(INITIAL_EXPENSES);
    handleResetFilters();
  };

  // Export to CSV
  const handleExportCSV = () => {
    exportExpensesToCSV(filteredAndSortedExpenses.length > 0 ? filteredAndSortedExpenses : expenses);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Top Bar Navigation */}
      <Header
        onOpenAddModal={() => {
          setEditingExpense(null);
          setIsFormOpen(true);
        }}
        onExportCSV={handleExportCSV}
        onRestoreSampleData={handleRestoreSampleData}
        currency={currency}
        onCurrencyChange={setCurrency}
      />

      {/* Main Content Workspace Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Executive Summary & Metrics */}
        <section aria-labelledby="summary-heading">
          <h2 id="summary-heading" className="sr-only">Expense Summary & Totals</h2>
          <Summary
            expenses={expenses}
            filteredExpenses={filteredAndSortedExpenses}
            currency={currency}
            monthlyBudget={monthlyBudget}
            onUpdateBudget={setMonthlyBudget}
          />
        </section>

        {/* Two-column layout on desktop: Left = Expense List & Controls, Right = Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Column: Controls and Expense List (2 cols on lg) */}
          <section className="lg:col-span-2 space-y-4" aria-labelledby="expenses-list-heading">
            <div className="flex items-center justify-between">
              <div>
                <h3 id="expenses-list-heading" className="text-base font-semibold text-slate-900 dark:text-white">
                  Expense Records
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage, filter, search, and edit your daily transaction logs
                </p>
              </div>
            </div>

            <ExpenseList
              expenses={filteredAndSortedExpenses}
              currency={currency}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              sortOption={sortOption}
              onSortChange={setSortOption}
              onEdit={handleOpenEdit}
              onDelete={handlePromptDelete}
              onOpenAddModal={() => {
                setEditingExpense(null);
                setIsFormOpen(true);
              }}
              onResetFilters={handleResetFilters}
              onRestoreSampleData={handleRestoreSampleData}
              totalUnfilteredCount={expenses.length}
            />
          </section>

          {/* Right Column: Category Breakdown & Insights */}
          <aside className="space-y-6" aria-label="Category Spending Breakdown">
            <CategoryBreakdown
              expenses={expenses}
              currency={currency}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* Quick Tips / Keyboard & Efficiency Box */}
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-500 dark:text-slate-400 space-y-2">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                Quick Guidance
              </h4>
              <ul className="space-y-1.5 list-disc list-inside">
                <li>Click any category above to immediately filter the expense list.</li>
                <li>Edit or remove any record with the action icons on each row.</li>
                <li>Adjust your monthly budget anytime to track real-time utilization.</li>
                <li>Export your ledger anytime as a standard CSV spreadsheet file.</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>

      {/* Add / Edit Expense Modal Dialog */}
      <ExpenseForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingExpense(null);
        }}
        onSubmit={handleSaveExpense}
        initialData={editingExpense}
        currency={currency}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        expenseTitle={deleteModal.title}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, id: '', title: '' })}
      />

      {/* Clean Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Personal Expense Manager · Track everyday spending with precision</span>
          <span>Local storage enabled · No backend required</span>
        </div>
      </footer>
    </div>
  );
}
