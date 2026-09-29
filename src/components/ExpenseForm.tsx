import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, Tag, FileText, Check } from 'lucide-react';
import { Expense, ExpenseCategory, CATEGORIES } from '../types/expense';
import { getTodayDateString } from '../utils/formatters';

interface ExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (expenseData: Omit<Expense, 'id' | 'createdAt'>) => void;
  initialData?: Expense | null;
  currency: string;
}

interface FormErrors {
  title?: string;
  amount?: string;
  category?: string;
  date?: string;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  currency,
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Food & Dining');
  const [date, setDate] = useState(getTodayDateString());
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  // Reset or fill data when modal opens or initialData changes
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setAmount(initialData.amount.toString());
      setCategory(initialData.category);
      setDate(initialData.date);
      setNotes(initialData.notes || '');
    } else {
      setTitle('');
      setAmount('');
      setCategory('Food & Dining');
      setDate(getTodayDateString());
      setNotes('');
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Expense title is required';
    } else if (title.trim().length < 2) {
      newErrors.title = 'Title must be at least 2 characters';
    }

    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount)) {
      newErrors.amount = 'Please enter a valid amount';
    } else if (numAmount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (numAmount > 1000000) {
      newErrors.amount = 'Amount cannot exceed 1,000,000';
    }

    if (!date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: title.trim(),
      amount: parseFloat(parseFloat(amount).toFixed(2)),
      category,
      date,
      notes: notes.trim() ? notes.trim() : undefined,
    });

    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="expense-form-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 id="expense-form-title" className="text-base font-semibold text-slate-900 dark:text-white">
              {initialData ? 'Edit Expense Record' : 'Record New Expense'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {initialData ? 'Update details of your existing expense' : 'Log your daily spending with date and category'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title Field */}
          <div>
            <label htmlFor="expense-title" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Expense Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="expense-title"
              type="text"
              autoFocus
              placeholder="e.g. Grocery Run, Coffee, Train Ticket"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              className={`w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:bg-white transition-all ${
                errors.title ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 dark:border-slate-700'
              }`}
            />
            {errors.title && <p className="mt-1 text-xs text-rose-500">{errors.title}</p>}
          </div>

          {/* Amount and Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Amount Field */}
            <div>
              <label htmlFor="expense-amount" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Amount ({currency}) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <DollarSign size={15} />
                </span>
                <input
                  id="expense-amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
                  }}
                  className={`w-full pl-8 pr-3.5 py-2 text-sm font-mono tabular-nums bg-slate-50 dark:bg-slate-800/80 border rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:bg-white transition-all ${
                    errors.amount ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
              </div>
              {errors.amount && <p className="mt-1 text-xs text-rose-500">{errors.amount}</p>}
            </div>

            {/* Date Field */}
            <div>
              <label htmlFor="expense-date" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Calendar size={15} />
                </span>
                <input
                  id="expense-date"
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }));
                  }}
                  className={`w-full pl-8 pr-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:bg-white transition-all ${
                    errors.date ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
              </div>
              {errors.date && <p className="mt-1 text-xs text-rose-500">{errors.date}</p>}
            </div>
          </div>

          {/* Category Selector */}
          <div>
            <label htmlFor="expense-category" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Category <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Tag size={15} />
              </span>
              <select
                id="expense-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full pl-8 pr-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:bg-white transition-all appearance-none cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes (Optional) */}
          <div>
            <label htmlFor="expense-notes" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Notes <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <div className="relative">
              <span className="absolute top-2.5 left-3 pointer-events-none text-slate-400">
                <FileText size={15} />
              </span>
              <textarea
                id="expense-notes"
                rows={2}
                placeholder="Additional details, merchant info, or memo..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full pl-8 pr-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:bg-white transition-all resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white rounded-lg shadow-xs transition-colors"
            >
              <Check size={14} />
              {initialData ? 'Update Expense' : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
