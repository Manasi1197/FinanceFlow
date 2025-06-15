
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';
import AuthForm from '@/components/auth/AuthForm';
import AuthNavigation from '@/components/auth/AuthNavigation';
import { usePasswordReset } from '@/hooks/usePasswordReset';
import { useAuthSubmit } from '@/hooks/useAuthSubmit';
import { getAuthTitle, getAuthDescription } from '@/utils/authHelpers';
import { AuthMode } from '@/types/auth';

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState('');

  // Custom hooks for password reset detection and form submission
  usePasswordReset({ setMode, setEmail });
  const { handleSubmit, loading } = useAuthSubmit({
    mode,
    email,
    password,
    confirmPassword,
    fullName,
    country,
    setMode
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-sm sm:max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="text-center space-y-3 px-4 sm:px-6 pt-6 pb-4">
          <CardTitle className="flex items-center justify-center space-x-2 text-xl sm:text-2xl">
            <DollarSign className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600" />
            <span>{getAuthTitle(mode)}</span>
          </CardTitle>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            {getAuthDescription(mode)}
          </p>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6">
          <AuthForm
            mode={mode}
            email={email}
            password={password}
            confirmPassword={confirmPassword}
            fullName={fullName}
            country={country}
            loading={loading}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onConfirmPasswordChange={setConfirmPassword}
            onFullNameChange={setFullName}
            onCountryChange={setCountry}
            onSubmit={handleSubmit}
          />
          
          <AuthNavigation mode={mode} onModeChange={setMode} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
