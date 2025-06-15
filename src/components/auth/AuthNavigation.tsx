
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { AuthMode } from '@/types/auth';

interface AuthNavigationProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
}

const AuthNavigation = ({ mode, onModeChange }: AuthNavigationProps) => {
  if (mode === 'reset') {
    return null;
  }

  return (
    <div className="mt-4 sm:mt-6 space-y-2 text-center">
      {mode === 'forgot' ? (
        <Button
          variant="ghost"
          onClick={() => onModeChange('signin')}
          className="text-emerald-600 hover:text-emerald-700 text-sm sm:text-base p-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to sign in
        </Button>
      ) : (
        <>
          <Button
            variant="ghost"
            onClick={() => onModeChange(mode === 'signin' ? 'signup' : 'signin')}
            className="text-emerald-600 hover:text-emerald-700 text-sm sm:text-base p-2"
          >
            {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </Button>
          
          {mode === 'signin' && (
            <Button
              variant="ghost"
              onClick={() => onModeChange('forgot')}
              className="text-gray-600 hover:text-gray-700 text-sm sm:text-base p-2"
            >
              Forgot your password?
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default AuthNavigation;
