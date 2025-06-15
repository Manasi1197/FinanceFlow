
import React, { useMemo } from 'react';
import { DollarSign, TrendingDown, Calendar, PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SpendingChart from './SpendingChart';
import CategoryBreakdown from './CategoryBreakdown';
import { Expense } from '../pages/Index';

interface DashboardProps {
  expenses: Expense[];
  totalSpent: number;
}

const Dashboard = ({ expenses, totalSpent }: DashboardProps) => {
  const thisMonth = useMemo(() => {
    const now = new Date();
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === now.getMonth() && 
             expenseDate.getFullYear() === now.getFullYear();
    });
  }, [expenses]);

  const monthlySpent = useMemo(() => {
    return thisMonth.reduce((sum, expense) => sum + expense.amount, 0);
  }, [thisMonth]);

  const averageDaily = useMemo(() => {
    const daysInMonth = new Date().getDate();
    return monthlySpent / daysInMonth;
  }, [monthlySpent]);

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">${totalSpent.toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-1">All time expenses</p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">${monthlySpent.toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-1">{thisMonth.length} transactions</p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Daily Average</CardTitle>
            <TrendingDown className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">${averageDaily.toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-1">Per day this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="w-5 h-5 text-emerald-600" />
              <span>Spending by Category</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryBreakdown expenses={expenses} />
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingDown className="w-5 h-5 text-blue-600" />
              <span>Spending Trend</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SpendingChart expenses={expenses} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
