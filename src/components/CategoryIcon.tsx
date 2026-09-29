import React from 'react';
import {
  Utensils,
  ShoppingCart,
  Car,
  Home,
  Film,
  HeartPulse,
  ShoppingBag,
  ReceiptText,
  GraduationCap,
  Layers,
} from 'lucide-react';
import { ExpenseCategory } from '../types/expense';

interface CategoryIconProps {
  category: ExpenseCategory;
  className?: string;
  size?: number;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category, className = 'w-4 h-4', size = 16 }) => {
  switch (category) {
    case 'Food & Dining':
      return <Utensils className={className} size={size} />;
    case 'Groceries':
      return <ShoppingCart className={className} size={size} />;
    case 'Transportation':
      return <Car className={className} size={size} />;
    case 'Housing & Utilities':
      return <Home className={className} size={size} />;
    case 'Entertainment':
      return <Film className={className} size={size} />;
    case 'Health & Medical':
      return <HeartPulse className={className} size={size} />;
    case 'Shopping':
      return <ShoppingBag className={className} size={size} />;
    case 'Bills & Subscriptions':
      return <ReceiptText className={className} size={size} />;
    case 'Work & Education':
      return <GraduationCap className={className} size={size} />;
    case 'Other':
    default:
      return <Layers className={className} size={size} />;
  }
};
