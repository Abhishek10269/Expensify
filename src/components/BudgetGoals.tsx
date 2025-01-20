import React from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import type { Budget, Expense, ExpenseCategory } from '../types/expense';
import { categoryColors } from '../types/expense';

interface BudgetGoalsProps {
  budgets: Budget[];
  expenses: Expense[];
  onBudgetChange: (category: ExpenseCategory, limit: number) => void;
}

export function BudgetGoals({ budgets, expenses, onBudgetChange }: BudgetGoalsProps) {
  const getCategoryTotal = (category: ExpenseCategory) => {
    return expenses
      .filter((e) => e.category === category)
      .reduce((sum, e) => sum + e.amount, 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-lg dark:bg-gray-800"
    >
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <Target className="w-6 h-6 text-purple-500" />
        Budget Goals
      </h3>
      <div className="space-y-4">
        {budgets.map((budget) => {
          const spent = getCategoryTotal(budget.category);
          const percentage = (spent / budget.limit) * 100;
          const isOverBudget = percentage > 100;

          return (
            <div key={budget.category} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="capitalize text-gray-700 dark:text-gray-300">
                  {budget.category}
                </span>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                ₹{spent.toFixed(2)} / ₹{budget.limit.toFixed(2)}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(percentage, 100)}%` }}
                  className={`h-full rounded-full ${
                    isOverBudget ? 'bg-red-500' : 'bg-green-500'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}