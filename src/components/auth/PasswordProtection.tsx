'use client';

import { useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { getPasswordHash, isPasswordProtectionEnabled } from '@/config/password';

const SESSION_KEY = 'edit-auth-token';
const SESSION_EXPIRY_KEY = 'edit-auth-expiry';
const SESSION_DURATION = 1000 * 60 * 60 * 24; // 24 hours

interface PasswordProtectionProps {
  children: React.ReactNode;
}

export default function PasswordProtection({ children }: PasswordProtectionProps) {
  const passwordHash = getPasswordHash();
  const isProtectionEnabled = isPasswordProtectionEnabled();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If password protection is not enabled, grant immediate access
    if (!isProtectionEnabled) {
      setIsAuthenticated(true);
      setIsChecking(false);
      return;
    }

    // Check sessionStorage for existing valid auth
    const checkAuth = () => {
      try {
        const token = sessionStorage.getItem(SESSION_KEY);
        const expiry = sessionStorage.getItem(SESSION_EXPIRY_KEY);

        if (token === 'authenticated' && expiry) {
          const expiryTime = parseInt(expiry, 10);
          const now = Date.now();

          if (now < expiryTime) {
            setIsAuthenticated(true);
          } else {
            // Session expired
            sessionStorage.removeItem(SESSION_KEY);
            sessionStorage.removeItem(SESSION_EXPIRY_KEY);
          }
        }
      } catch (err) {
        console.error('Auth check error:', err);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [isProtectionEnabled]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Check if password hash is configured
      if (!passwordHash) {
        setError('Password protection is not configured. Please set NEXT_PUBLIC_EDIT_PASSWORD_HASH.');
        setIsLoading(false);
        return;
      }

      // Compare password with hash
      const isValid = await bcrypt.compare(password, passwordHash);

      if (isValid) {
        // Set authenticated state with expiry
        const expiryTime = Date.now() + SESSION_DURATION;
        sessionStorage.setItem(SESSION_KEY, 'authenticated');
        sessionStorage.setItem(SESSION_EXPIRY_KEY, expiryTime.toString());
        setIsAuthenticated(true);
        setError('');
        setPassword('');
      } else {
        setError('Incorrect password. Please try again.');
        setPassword('');
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError('Authentication error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_EXPIRY_KEY);
    setIsAuthenticated(false);
    setPassword('');
  };

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-white text-xl">Verifying access...</div>
      </div>
    );
  }

  // Show protected content if authenticated
  if (isAuthenticated) {
    return (
      <>
        {/* Logout button - only show if password protection is enabled */}
        {isProtectionEnabled && (
          <div className="exclude-print fixed top-4 right-4 z-50">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-all shadow-lg"
              title="Logout from edit mode"
            >
              Logout
            </button>
          </div>
        )}
        {children}
      </>
    );
  }

  // Show password entry form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        {/* Lock Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
            <FaLock className="text-white text-3xl" />
          </div>
        </div>

        {/* Header */}
        <h2 className="text-2xl font-bold text-white mb-2 text-center">Protected Area</h2>
        <p className="text-white/60 text-sm text-center mb-6">
          Enter password to access the editor
        </p>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white/80 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Enter password"
                autoFocus
                autoComplete="off"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verifying...' : 'Unlock'}
          </button>
        </form>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-blue-300 text-xs text-center">
            Session expires after 24 hours of inactivity
          </p>
        </div>
      </div>
    </div>
  );
}
