import React from 'react';
import { motion } from 'framer-motion';
import type { ExpenseCategory } from '../types/expense';

interface ExpenseFiltersProps {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  category: ExpenseCategory | 'all';
  onDateRangeChange: (range: { startDate: string; endDate: string }) => void;
  onCategoryChange: (category: ExpenseCategory | 'all') => void;
}

export function ExpenseFilters({
  dateRange,
  category,
  onDateRangeChange,
  onCategoryChange,
}: ExpenseFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-6"
    >
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Filter Expenses</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Start Date
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="date"
            id="startDate"
            value={dateRange.startDate}
            onChange={(e) =>
              onDateRangeChange({ ...dateRange, startDate: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            End Date
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="date"
            id="endDate"
            value={dateRange.endDate}
            onChange={(e) =>
              onDateRangeChange({ ...dateRange, endDate: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <motion.select
            whileFocus={{ scale: 1.01 }}
            id="category"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value as ExpenseCategory | 'all')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Categories</option>
            <option value="food">Food</option>
            <option value="transportation">Transportation</option>
            <option value="housing">Housing</option>
            <option value="utilities">Utilities</option>
            <option value="entertainment">Entertainment</option>
            <option value="healthcare">Healthcare</option>
            <option value="other">Other</option>
          </motion.select>
        </div>
      </div>
    </motion.div>
  );
}