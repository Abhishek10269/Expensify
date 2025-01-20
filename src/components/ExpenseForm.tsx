import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, X, Edit2 } from 'lucide-react';
import type { ExpenseCategory, Expense } from '../types/expense';

interface ExpenseFormProps {
  onSubmit: (expense: {
    title: string;
    amount: number;
    date: string;
    category: ExpenseCategory;
  }) => void;
  onCancel: () => void;
  initialData?: Expense;
  mode?: 'create' | 'edit';
}

export function ExpenseForm({ onSubmit, onCancel, initialData, mode = 'create' }: ExpenseFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [amount, setAmount] = useState(initialData?.amount.toString() || '');
  const [date, setDate] = useState(initialData?.date || '');
  const [category, setCategory] = useState<ExpenseCategory>(initialData?.category || 'other');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setAmount(initialData.amount.toString());
      setDate(initialData.date);
      setCategory(initialData.category);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      amount: parseFloat(amount),
      date,
      category,
    });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-xl relative dark:bg-gray-800"
    >
      <button
        type="button"
        onClick={onCancel}
        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors dark:hover:text-gray-300"
      >
        <X className="w-6 h-6" />
      </button>

      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
        {mode === 'create' ? (
          <>
            <PlusCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Add New Expense
          </>
        ) : (
          <>
            <Edit2 className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            Edit Expense
          </>
        )}
      </h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Expense title"
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Amount (₹)
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="0.00"
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
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

      <div className="mt-6 flex gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className={`flex-1 text-white py-2 px-4 rounded-lg transition-all duration-200 font-medium shadow-md ${
            mode === 'create'
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
              : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800'
          }`}
        >
          {mode === 'create' ? 'Add Expense' : 'Update Expense'}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          Cancel
        </motion.button>
      </div>
    </motion.form>
  );
}