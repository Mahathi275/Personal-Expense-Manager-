import { Expense, ExpenseCategory, CATEGORIES } from '../types/expense';

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export interface CategorySummary {
  category: ExpenseCategory;
  total: number;
  count: number;
  percentage: number;
  color: string;
}

export const calculateCategoryTotals = (expenses: Expense[], totalOverall: number): CategorySummary[] => {
  const map: Partial<Record<ExpenseCategory, { total: number; count: number }>> = {};

  expenses.forEach((item) => {
    if (!map[item.category]) {
      map[item.category] = { total: 0, count: 0 };
    }
    const cur = map[item.category]!;
    cur.total += item.amount;
    cur.count += 1;
  });

  const summaries: CategorySummary[] = Object.entries(map).map(([cat, data]) => {
    const category = cat as ExpenseCategory;
    const catMeta = CATEGORIES.find((c) => c.name === category);
    return {
      category,
      total: data.total,
      count: data.count,
      percentage: totalOverall > 0 ? (data.total / totalOverall) * 100 : 0,
      color: catMeta?.accentColor || 'text-slate-600',
    };
  });

  // Sort descending by total
  return summaries.sort((a, b) => b.total - a.total);
};

export const exportExpensesToCSV = (expenses: Expense[]): void => {
  const headers = ['ID', 'Title', 'Amount', 'Category', 'Date', 'Notes'];
  const rows = expenses.map((e) => [
    `"${e.id}"`,
    `"${e.title.replace(/"/g, '""')}"`,
    e.amount.toFixed(2),
    `"${e.category}"`,
    `"${e.date}"`,
    `"${(e.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `personal-expenses-${getTodayDateString()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
