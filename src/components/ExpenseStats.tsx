import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { IndianRupeeIcon, TrendingUp, CreditCard } from 'lucide-react';
import type { Expense, ExpenseCategory } from '../types/expense';

interface ExpenseStatsProps {
  expenses: Expense[];
}

export function ExpenseStats({ expenses }: ExpenseStatsProps) {
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averageAmount = expenses.length > 0 ? totalAmount / expenses.length : 0;

  const categoryData = Object.entries(
    expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<ExpenseCategory, number>)
  ).map(([category, amount]) => ({
    category,
    amount,
  }));

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Expenses</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                ₹{totalAmount.toFixed(2)}
              </h3>
            </div>
            <div className="bg-blue-400 p-3 rounded-lg">
              <IndianRupeeIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Average Expense</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                ₹{averageAmount.toFixed(2)}
              </h3>
            </div>
            <div className="bg-purple-400 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100">Total Categories</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {categoryData.length}
              </h3>
            </div>
            <div className="bg-emerald-400 p-3 rounded-lg">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
      >
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Expenses by Category</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}>
              <XAxis
                dataKey="category"
                tick={{ fill: '#4B5563', fontSize: 12 }}
                tickLine={{ stroke: '#4B5563' }}
                stroke="#4B5563"
              />
              <YAxis
                tick={{ fill: '#4B5563', fontSize: 12 }}
                tickLine={{ stroke: '#4B5563' }}
                stroke="#4B5563"
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip
                formatter={(value) => [`₹${value}`, 'Amount']}
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
                  color: '#F3F4F6',
                }}
                itemStyle={{ color: '#F3F4F6' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Bar
                dataKey="amount"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}