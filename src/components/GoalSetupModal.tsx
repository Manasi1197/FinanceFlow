
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Target, DollarSign } from 'lucide-react';
import { useSpendingGoal } from '../contexts/SpendingGoalContext';

interface GoalSetupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GoalSetupModal = ({ open, onOpenChange }: GoalSetupModalProps) => {
  const { goals, setGoals } = useSpendingGoal();
  const [monthlyGoal, setMonthlyGoal] = useState(goals.monthly.toString());
  const [yearlyGoal, setYearlyGoal] = useState(goals.yearly.toString());

  const handleSave = () => {
    const monthly = parseFloat(monthlyGoal) || 0;
    const yearly = parseFloat(yearlyGoal) || 0;
    setGoals({ monthly, yearly });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-emerald-600" />
            <span>Set Your Spending Goals</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="monthly-goal">Monthly Spending Goal</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="monthly-goal"
                type="number"
                placeholder="2000"
                value={monthlyGoal}
                onChange={(e) => setMonthlyGoal(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="yearly-goal">Yearly Spending Goal</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="yearly-goal"
                type="number"
                placeholder="24000"
                value={yearlyGoal}
                onChange={(e) => setYearlyGoal(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <Button onClick={handleSave} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
              Save Goals
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GoalSetupModal;
