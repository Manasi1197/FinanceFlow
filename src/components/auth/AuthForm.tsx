
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LogIn, UserPlus, ArrowLeft, Lock } from 'lucide-react';
import { AuthMode, countries } from '@/types/auth';

interface AuthFormProps {
  mode: AuthMode;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  country: string;
  loading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onFullNameChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const AuthForm = ({
  mode,
  email,
  password,
  confirmPassword,
  fullName,
  country,
  loading,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onFullNameChange,
  onCountryChange,
  onSubmit
}: AuthFormProps) => {
  const getButtonText = () => {
    switch (mode) {
      case 'signup': return 'Create Account';
      case 'forgot': return 'Send Reset Email';
      case 'reset': return 'Update Password';
      default: return 'Sign In';
    }
  };

  const getButtonIcon = () => {
    switch (mode) {
      case 'signup': return <UserPlus className="w-4 h-4 mr-2" />;
      case 'signin': return <LogIn className="w-4 h-4 mr-2" />;
      case 'forgot': return <ArrowLeft className="w-4 h-4 mr-2" />;
      case 'reset': return <Lock className="w-4 h-4 mr-2" />;
      default: return null;
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
      {mode === 'signup' && (
        <div className="space-y-2">
          <Label htmlFor="auth-fullName" className="text-sm font-medium">Full Name</Label>
          <Input
            id="auth-fullName"
            type="text"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => onFullNameChange(e.target.value)}
            required
            className="h-10 sm:h-11 text-base"
          />
        </div>
      )}
      
      {mode !== 'reset' && (
        <div className="space-y-2">
          <Label htmlFor="auth-email" className="text-sm font-medium">Email</Label>
          <Input
            id="auth-email"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            required
            className="h-10 sm:h-11 text-base"
            disabled={mode === 'reset'}
          />
        </div>
      )}

      {mode === 'reset' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="auth-email-display" className="text-sm font-medium">Email</Label>
            <Input
              id="auth-email-display"
              type="email"
              value={email}
              disabled
              className="h-10 sm:h-11 text-base bg-gray-50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="auth-password" className="text-sm font-medium">New Password</Label>
            <Input
              id="auth-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              required
              className="h-10 sm:h-11 text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="auth-confirm-password" className="text-sm font-medium">Confirm New Password</Label>
            <Input
              id="auth-confirm-password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => onConfirmPasswordChange(e.target.value)}
              required
              className="h-10 sm:h-11 text-base"
            />
          </div>
        </>
      )}
      
      {(mode === 'signin' || mode === 'signup') && (
        <div className="space-y-2">
          <Label htmlFor="auth-password" className="text-sm font-medium">Password</Label>
          <Input
            id="auth-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            required
            className="h-10 sm:h-11 text-base"
          />
        </div>
      )}

      {mode === 'signup' && (
        <div className="space-y-2">
          <Label htmlFor="auth-country" className="text-sm font-medium">Country</Label>
          <Select value={country} onValueChange={onCountryChange} required>
            <SelectTrigger id="auth-country" className="h-10 sm:h-11 text-base">
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent className="max-h-48 sm:max-h-60">
              {countries.map((c) => (
                <SelectItem key={c.code} value={c.code} className="text-sm sm:text-base">
                  {c.name} - {c.currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-emerald-600 hover:bg-emerald-700 h-10 sm:h-11 text-base font-medium mt-6"
        disabled={loading}
      >
        {loading ? (
          'Loading...'
        ) : (
          <>
            {getButtonIcon()}
            {getButtonText()}
          </>
        )}
      </Button>
    </form>
  );
};

export default AuthForm;
