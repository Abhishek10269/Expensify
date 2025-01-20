import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, IndianRupeeIcon, Tag, Trash2, Edit } from 'lucide-react';
import type { Expense } from '../types/expense';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
}

export function ExpenseList({ expenses, onDelete, onEdit }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8 text-gray-500 dark:text-gray-400"
      >
        No expenses found. Add some expenses to get started!
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {expenses.map((expense) => (
          <motion.div
            key={expense.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{expense.title}</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <IndianRupeeIcon className="w-4 h-4 mr-2 text-blue-500" />
                    <span className="font-medium">₹{expense.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                    <span>{new Date(expense.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Tag className="w-4 h-4 mr-2 text-emerald-500" />
                    <span className="capitalize">{expense.category}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onEdit(expense)}
                  className="text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 transition-colors duration-200 p-2 rounded-full hover:bg-amber-50 dark:hover:bg-amber-900/20"
                >
                  <Edit className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onDelete(expense.id)}
                  className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors duration-200 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}