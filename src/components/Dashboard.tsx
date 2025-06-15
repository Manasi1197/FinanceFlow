
import React, { useMemo } from 'react';
import { DollarSign, TrendingDown, Calendar, PieChart, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SpendingChart from './SpendingChart';
import CategoryBreakdown from './CategoryBreakdown';
import GoalStatus from './GoalStatus';
import { Expense } from '../pages/Index';
import { useSpendingGoal } from '../contexts/SpendingGoalContext';

interface DashboardProps {
  expenses: Expense[];
  totalSpent: number;
  onSetupGoals: () => void;
}

const Dashboard = ({ expenses, totalSpent, onSetupGoals }: DashboardProps) => {
  const { hasGoals } = useSpendingGoal();

  // Filter expenses to current year only
  const currentYearExpenses = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return expenses.filter(expense => {
      const expenseYear = new Date(expense.date).getFullYear();
      return expenseYear === currentYear;
    });
  }, [expenses]);

  const thisMonth = useMemo(() => {
    const now = new Date();
    return currentYearExpenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === now.getMonth() && 
             expenseDate.getFullYear() === now.getFullYear();
    });
  }, [currentYearExpenses]);

  const yearlySpent = useMemo(() => {
    return currentYearExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [currentYearExpenses]);

  const monthlySpent = useMemo(() => {
    return thisMonth.reduce((sum, expense) => sum + expense.amount, 0);
  }, [thisMonth]);

  const averageDaily = useMemo(() => {
    const daysInMonth = new Date().getDate();
    return monthlySpent / daysInMonth;
  }, [monthlySpent]);

  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-8">
      {/* Goal Setup Section */}
      {!hasGoals && (
        <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <Target className="w-8 h-8 text-emerald-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Set Your Spending Goals</h3>
                  <p className="text-gray-600">Track your progress and stay on budget</p>
                </div>
              </div>
              <Button 
                onClick={onSetupGoals}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Set Goals
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goal Status */}
      {hasGoals && (
        <GoalStatus monthlySpent={monthlySpent} yearlySpent={yearlySpent} />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">This Year ({currentYear})</CardTitle>
            <Calendar className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">${yearlySpent.toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-1">{currentYearExpenses.length} transactions</p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">${totalSpent.toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-1">All time expenses</p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">${monthlySpent.toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-1">{thisMonth.length} transactions</p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Daily Average</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-600" />
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
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <PieChart className="w-5 h-5 text-emerald-600" />
                <span>Spending by Category</span>
              </div>
              {hasGoals && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onSetupGoals}
                  className="text-xs"
                >
                  Edit Goals
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryBreakdown expenses={currentYearExpenses} />
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingDown className="w-5 h-5 text-blue-600" />
              <span>Spending Trend ({currentYear})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SpendingChart expenses={currentYearExpenses} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
