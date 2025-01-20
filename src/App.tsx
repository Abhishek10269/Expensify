import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Plus, Download } from 'lucide-react';
import axios from 'axios';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseFilters } from './components/ExpenseFilters';
import { ExpenseStats } from './components/ExpenseStats';
import { BudgetGoals } from './components/BudgetGoals';
import { ExpenseInsights } from './components/ExpenseInsights';
import { ThemeToggle } from './components/ThemeToggle';
import type { Expense, ExpenseCategory, Budget } from './types/expense';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [budgets, setBudgets] = useState<Budget[]>([
    { category: 'food', limit: 500 },
    { category: 'entertainment', limit: 200 },
    { category: 'transportation', limit: 300 },
  ]);
  const [filters, setFilters] = useState({
    dateRange: {
      startDate: '',
      endDate: '',
    },
    category: 'all' as ExpenseCategory | 'all',
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/expenses`);
      setExpenses(response.data.map((expense: any) => ({
        id: expense._id,
        title: expense.title,
        amount: expense.amount,
        date: expense.date,
        category: expense.category,
      })));
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddExpense = async (newExpense: Omit<Expense, 'id'>) => {
    try {
      const response = await axios.post(`${API_URL}/expenses`, newExpense);
      const expense: Expense = {
        ...newExpense,
        id: response.data._id,
      };
      setExpenses([expense, ...expenses]);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleUpdateExpense = async (updatedExpense: Omit<Expense, 'id'>) => {
    if (!selectedExpense) return;
    
    try {
      await axios.put(`${API_URL}/expenses/${selectedExpense.id}`, updatedExpense);
      setExpenses(expenses.map(expense => 
        expense.id === selectedExpense.id
          ? { ...updatedExpense, id: selectedExpense.id }
          : expense
      ));
      setSelectedExpense(null);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/expenses/${id}`);
      setExpenses(expenses.filter((expense) => expense.id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsFormOpen(true);
  };

  const handleExportData = () => {
    const data = JSON.stringify(expenses, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedExpense(null);
  };

  const filteredExpenses = expenses.filter((expense) => {
    const matchesCategory = filters.category === 'all' || expense.category === filters.category;
    const matchesDateRange =
      (!filters.dateRange.startDate || expense.date >= filters.dateRange.startDate) &&
      (!filters.dateRange.endDate || expense.date <= filters.dateRange.endDate);
    return matchesCategory && matchesDateRange;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl text-gray-600 dark:text-gray-400"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200`}>
      <div className="container mx-auto px-4 py-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-12"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Wallet className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              Expense Tracker
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Track your expenses with ease</p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle isDark={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExportData}
              className="bg-green-600 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-green-700 transition-colors shadow-lg"
            >
              <Download className="w-5 h-5" />
              Export
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsFormOpen(true)}
              className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Expense
            </motion.button>
          </div>
        </motion.header>

        <ExpenseStats expenses={filteredExpenses} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <BudgetGoals
            budgets={budgets}
            expenses={expenses}
            onBudgetChange={(category, limit) => {
              setBudgets(budgets.map(b => 
                b.category === category ? { ...b, limit } : b
              ));
            }}
          />
          <ExpenseInsights expenses={expenses} />
        </div>

        <div className="mt-8">
          <ExpenseFilters
            dateRange={filters.dateRange}
            category={filters.category}
            onDateRangeChange={(dateRange) =>
              setFilters({ ...filters, dateRange })
            }
            onCategoryChange={(category) =>
              setFilters({ ...filters, category })
            }
          />
          <ExpenseList
            expenses={filteredExpenses}
            onDelete={handleDeleteExpense}
            onEdit={handleEditExpense}
          />
        </div>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={handleFormClose}
              className="fixed inset-0 bg-black cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 flex items-center justify-center pointer-events-none p-4"
            >
              <div className="w-full max-w-lg pointer-events-auto">
                <ExpenseForm
                  onSubmit={selectedExpense ? handleUpdateExpense : handleAddExpense}
                  onCancel={handleFormClose}
                  initialData={selectedExpense || undefined}
                  mode={selectedExpense ? 'edit' : 'create'}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;