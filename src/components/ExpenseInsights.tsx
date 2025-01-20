import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import type { Expense } from '../types/expense';

interface ExpenseInsightsProps {
  expenses: Expense[];
}

export function ExpenseInsights({ expenses }: ExpenseInsightsProps) {
  const monthlyData = expenses.reduce((acc, expense) => {
    const month = expense.date.substring(0, 7); // YYYY-MM
    acc[month] = (acc[month] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const trendData = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, amount]) => ({
      month,
      amount,
    }));

  const getInsightMessage = () => {
    if (trendData.length < 2) return "Start tracking your expenses to see insights!";
    
    const lastMonth = trendData[trendData.length - 1].amount;
    const previousMonth = trendData[trendData.length - 2].amount;
    const difference = ((lastMonth - previousMonth) / previousMonth) * 100;
    
    if (difference > 0) {
      return `Spending increased by ${difference.toFixed(1)}% compared to last month`;
    } else {
      return `Spending decreased by ${Math.abs(difference).toFixed(1)}% compared to last month`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-lg dark:bg-gray-800"
    >
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-emerald-500" />
        Spending Trends
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 mb-4">{getInsightMessage()}</p>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <XAxis
              dataKey="month"
              tick={{ fill: '#4B5563' }}
              tickLine={{ stroke: '#4B5563' }}
            />
            <YAxis
              tick={{ fill: '#4B5563' }}
              tickLine={{ stroke: '#4B5563' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFF',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ fill: '#10B981', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}