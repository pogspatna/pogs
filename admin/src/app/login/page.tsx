'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Lock, Mail, Stethoscope, AlertCircle, CheckCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { login, error, isFirebaseConfigured, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFirebaseConfigured || !email || !password) {
      return;
    }
    
    setIsLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = email && password && isFirebaseConfigured;
  const showConfigError = mounted && !loading && !isFirebaseConfigured;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8 opacity-0 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform duration-300">
              <Stethoscope className="text-white w-10 h-10" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">POGS Admin</h1>
          <p className="text-gray-600 text-lg">Welcome back! Please sign in to continue.</p>
        </div>

        {/* Configuration Status */}
        {mounted && !loading && (
          <div className="mb-6">
            {isFirebaseConfigured ? (
              <div className="flex items-center justify-center space-x-2 text-green-600 bg-green-50 rounded-lg p-3 border border-green-200">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Authentication service ready</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2 text-amber-600 bg-amber-50 rounded-lg p-3 border border-amber-200">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Authentication service unavailable</span>
              </div>
            )}
          </div>
        )}

        {/* Login Form */}
        <div className="admin-card shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <div className="admin-card-content p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="admin-form-group">
                <label htmlFor="email" className="admin-form-label text-gray-700 font-semibold">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 h-12 text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 rounded-xl bg-white"
                    placeholder="admin@example.com"
                    required
                    disabled={isLoading || showConfigError}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="admin-form-group">
                <label htmlFor="password" className="admin-form-label text-gray-700 font-semibold">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 h-12 text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 rounded-xl bg-white"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading || showConfigError}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-xl transition-colors z-10"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading || showConfigError}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 animate-shake">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !isFormValid}
                className={`w-full h-12 rounded-xl font-semibold text-base transition-all duration-300 transform ${
                  isFormValid && !isLoading
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                } flex items-center justify-center space-x-2`}
              >
                {isLoading ? (
                  <>
                    <div className="admin-loading-spinner"></div>
                    <span>Signing in...</span>
                  </>
                ) : !isFirebaseConfigured ? (
                  <span>Service Unavailable</span>
                ) : !email || !password ? (
                  <span>Enter credentials</span>
                ) : (
                  <span>Sign In</span>
                )}
              </button>

              {/* Additional Info */}
              {isFormValid && (
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    By signing in, you agree to the terms of service
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-sm text-gray-600 font-medium">
            Patna Obstetrics & Gynaecological Society
          </p>
          <p className="text-xs text-gray-500">
            Admin access only • Secure authentication required
          </p>
          <div className="flex items-center justify-center space-x-1 text-xs text-gray-400">
            <span>Powered by</span>
            <span className="font-semibold text-blue-600">POGS Admin System</span>
          </div>
        </div>
      </div>
    </div>
  );
} 