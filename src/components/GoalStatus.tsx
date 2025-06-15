
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, Target } from 'lucide-react';
import { useSpendingGoal } from '../contexts/SpendingGoalContext';

interface GoalStatusProps {
  monthlySpent: number;
  yearlySpent: number;
}

const GoalStatus = ({ monthlySpent, yearlySpent }: GoalStatusProps) => {
  const { goals } = useSpendingGoal();

  const monthlyProgress = goals.monthly > 0 ? (monthlySpent / goals.monthly) * 100 : 0;
  const yearlyProgress = goals.yearly > 0 ? (yearlySpent / goals.yearly) * 100 : 0;

  const getStatusIcon = (progress: number) => {
    if (progress <= 80) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (progress <= 100) return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    return <AlertTriangle className="w-5 h-5 text-red-600" />;
  };

  const getStatusMessage = (progress: number, period: string) => {
    if (progress <= 80) return `Great! You're on track with your ${period} goal.`;
    if (progress <= 100) return `Getting close to your ${period} limit. Consider reducing spending.`;
    return `You've exceeded your ${period} goal. Time to review your expenses.`;
  };

  const getProgressColor = (progress: number) => {
    if (progress <= 80) return 'bg-green-500';
    if (progress <= 100) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (!goals.monthly && !goals.yearly) return null;

  return (
    <div className="space-y-4">
      {goals.monthly > 0 && (
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getStatusIcon(monthlyProgress)}
                <span className="font-semibold text-gray-900">Monthly Goal</span>
              </div>
              <span className="text-sm text-gray-600">
                ${monthlySpent.toFixed(0)} / ${goals.monthly.toFixed(0)}
              </span>
            </div>
            <Progress 
              value={Math.min(monthlyProgress, 100)} 
              className="h-2 mb-2"
            />
            <p className="text-xs text-gray-600">
              {getStatusMessage(monthlyProgress, 'monthly')}
            </p>
          </CardContent>
        </Card>
      )}

      {goals.yearly > 0 && (
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getStatusIcon(yearlyProgress)}
                <span className="font-semibold text-gray-900">Yearly Goal</span>
              </div>
              <span className="text-sm text-gray-600">
                ${yearlySpent.toFixed(0)} / ${goals.yearly.toFixed(0)}
              </span>
            </div>
            <Progress 
              value={Math.min(yearlyProgress, 100)} 
              className="h-2 mb-2"
            />
            <p className="text-xs text-gray-600">
              {getStatusMessage(yearlyProgress, 'yearly')}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GoalStatus;
