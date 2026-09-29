import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  expenseTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  expenseTitle,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-sm shadow-xl p-5">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 id="delete-dialog-title" className="text-sm font-semibold text-slate-900 dark:text-white">
              Delete Expense Record?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Are you sure you want to delete <span className="font-semibold text-slate-800 dark:text-slate-200">"{expenseTitle}"</span>? This action cannot be undone.
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2.5 mt-5">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors"
          >
            <Trash2 size={13} />
            Delete Record
          </button>
        </div>
      </div>
    </div>
  );
};
