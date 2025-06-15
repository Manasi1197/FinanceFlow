
import { AuthMode } from '@/types/auth';

export const getAuthTitle = (mode: AuthMode): string => {
  switch (mode) {
    case 'signup': return 'Create Account';
    case 'forgot': return 'Reset Password';
    case 'reset': return 'Set New Password';
    default: return 'Welcome Back';
  }
};

export const getAuthDescription = (mode: AuthMode): string => {
  switch (mode) {
    case 'signup': return 'Join FinanceFlow to track your expenses';
    case 'forgot': return 'Enter your email to reset your password';
    case 'reset': return 'Enter your new password below';
    default: return 'Sign in to your FinanceFlow account';
  }
};
