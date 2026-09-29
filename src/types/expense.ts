export type ExpenseCategory =
  | 'Food & Dining'
  | 'Groceries'
  | 'Transportation'
  | 'Housing & Utilities'
  | 'Entertainment'
  | 'Health & Medical'
  | 'Shopping'
  | 'Bills & Subscriptions'
  | 'Work & Education'
  | 'Other';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // ISO format YYYY-MM-DD
  notes?: string;
  createdAt: number;
}

export interface CategoryMeta {
  name: ExpenseCategory;
  icon: string;
  accentColor: string; // Tailwind color token
  bgLight: string;
  borderLight: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    name: 'Food & Dining',
    icon: 'Utensils',
    accentColor: 'text-amber-700 dark:text-amber-400',
    bgLight: 'bg-amber-50 dark:bg-amber-950/40',
    borderLight: 'border-amber-200 dark:border-amber-800/60',
  },
  {
    name: 'Groceries',
    icon: 'ShoppingCart',
    accentColor: 'text-emerald-700 dark:text-emerald-400',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderLight: 'border-emerald-200 dark:border-emerald-800/60',
  },
  {
    name: 'Transportation',
    icon: 'Car',
    accentColor: 'text-blue-700 dark:text-blue-400',
    bgLight: 'bg-blue-50 dark:bg-blue-950/40',
    borderLight: 'border-blue-200 dark:border-blue-800/60',
  },
  {
    name: 'Housing & Utilities',
    icon: 'Home',
    accentColor: 'text-indigo-700 dark:text-indigo-400',
    bgLight: 'bg-indigo-50 dark:bg-indigo-950/40',
    borderLight: 'border-indigo-200 dark:border-indigo-800/60',
  },
  {
    name: 'Entertainment',
    icon: 'Film',
    accentColor: 'text-purple-700 dark:text-purple-400',
    bgLight: 'bg-purple-50 dark:bg-purple-950/40',
    borderLight: 'border-purple-200 dark:border-purple-800/60',
  },
  {
    name: 'Health & Medical',
    icon: 'HeartPulse',
    accentColor: 'text-rose-700 dark:text-rose-400',
    bgLight: 'bg-rose-50 dark:bg-rose-950/40',
    borderLight: 'border-rose-200 dark:border-rose-800/60',
  },
  {
    name: 'Shopping',
    icon: 'ShoppingBag',
    accentColor: 'text-pink-700 dark:text-pink-400',
    bgLight: 'bg-pink-50 dark:bg-pink-950/40',
    borderLight: 'border-pink-200 dark:border-pink-800/60',
  },
  {
    name: 'Bills & Subscriptions',
    icon: 'ReceiptText',
    accentColor: 'text-cyan-700 dark:text-cyan-400',
    bgLight: 'bg-cyan-50 dark:bg-cyan-950/40',
    borderLight: 'border-cyan-200 dark:border-cyan-800/60',
  },
  {
    name: 'Work & Education',
    icon: 'GraduationCap',
    accentColor: 'text-teal-700 dark:text-teal-400',
    bgLight: 'bg-teal-50 dark:bg-teal-950/40',
    borderLight: 'border-teal-200 dark:border-teal-800/60',
  },
  {
    name: 'Other',
    icon: 'Layers',
    accentColor: 'text-slate-700 dark:text-slate-400',
    bgLight: 'bg-slate-100 dark:bg-slate-800',
    borderLight: 'border-slate-200 dark:border-slate-700',
  },
];

export type SortField = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc' | 'title-asc';

export type TimeFilter = 'all' | 'this-month' | 'last-30-days' | 'last-month';

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    title: 'Whole Foods Market',
    amount: 128.45,
    category: 'Groceries',
    date: '2026-09-28',
    notes: 'Weekly fresh produce, organic milk, and pantry staples',
    createdAt: 1759080000000,
  },
  {
    id: 'exp-2',
    title: 'Metro Pass Monthly Reload',
    amount: 85.0,
    category: 'Transportation',
    date: '2026-09-27',
    notes: 'Subway & city bus unlimited monthly card',
    createdAt: 1758993600000,
  },
  {
    id: 'exp-3',
    title: 'Electric & Gas Utility Bill',
    amount: 142.18,
    category: 'Housing & Utilities',
    date: '2026-09-25',
    notes: 'September residential utility service',
    createdAt: 1758820800000,
  },
  {
    id: 'exp-4',
    title: 'Artisan Coffee Roasters',
    amount: 16.75,
    category: 'Food & Dining',
    date: '2026-09-25',
    notes: 'Cold brew and almond croissant with colleague',
    createdAt: 1758810000000,
  },
  {
    id: 'exp-5',
    title: 'Streaming & Cloud Storage',
    amount: 29.98,
    category: 'Bills & Subscriptions',
    date: '2026-09-22',
    notes: 'Netflix Standard and Google One 2TB backup',
    createdAt: 1758552000000,
  },
  {
    id: 'exp-6',
    title: 'Prescription & Pharmacy',
    amount: 45.2,
    category: 'Health & Medical',
    date: '2026-09-20',
    notes: 'Allergy medication and multivitamin replenishment',
    createdAt: 1758379200000,
  },
  {
    id: 'exp-7',
    title: 'Weekend Cinema Tickets',
    amount: 38.5,
    category: 'Entertainment',
    date: '2026-09-18',
    notes: 'Two IMAX tickets for evening screening',
    createdAt: 1758206400000,
  },
  {
    id: 'exp-8',
    title: 'Online Technical Book & Course',
    amount: 49.0,
    category: 'Work & Education',
    date: '2026-09-15',
    notes: 'TypeScript Design Patterns reference book',
    createdAt: 1757947200000,
  },
  {
    id: 'exp-9',
    title: 'Running Shoes & Sports Socks',
    amount: 119.99,
    category: 'Shopping',
    date: '2026-09-12',
    notes: 'Road running sneakers for autumn training',
    createdAt: 1757688000000,
  },
  {
    id: 'exp-10',
    title: 'Dinner at Bistro Bella',
    amount: 78.5,
    category: 'Food & Dining',
    date: '2026-09-08',
    notes: 'Pasta dinner with friends',
    createdAt: 1757342400000,
  },
];
