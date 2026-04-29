import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // The access token from the password reset link is in the query params as 'access_token'
  const accessToken = searchParams.get('access_token');

  useEffect(() => {
    if (!accessToken) {
      setError('Invalid or expired reset link');
    }
  }, [accessToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    
    // Form validation
    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }
    
    if (!accessToken) {
      setError('Invalid or expired reset link');
      setLoading(false);
      return;
    }
    
    try {
      // Set the session with the access token from the reset link
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: ''
      });
      
      // Update the password
      const { error: userError } = await supabase.auth.updateUser({ password });
      
      if (sessionError) throw sessionError;
      if (userError) throw userError;
      
      setSuccess('Password has been reset successfully. You can now log in with your new password.');
      // Optionally, clear the session after reset for security
      await supabase.auth.signOut();
    } catch (err: any) {
      setError(err.message || 'An error occurred while resetting your password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-[#2a003f] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Reset Password</h1>
          <p className="text-gray-400">Choose a new password for your account</p>
        </div>
        
        {error && (
          <div className="bg-red-900/20 border border-red-700/30 text-red-300 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-900/20 border border-green-700/30 text-green-300 px-4 py-3 rounded-xl">
            {success}
          </div>
        )}
        
        {!accessToken && (
          <div className="bg-red-900/20 border border-red-700/30 text-red-300 px-4 py-3 rounded-xl">
            Invalid or expired reset link. Please request a new one.
          </div>
        )}
        
        {accessToken && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3 bg-[#1a001f] border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 text-white placeholder-gray-400"
                placeholder="Enter new password"
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3 bg-[#1a001f] border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 text-white placeholder-gray-400"
                placeholder="Confirm new password"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? 'Resetting password...' : 'Reset Password'}
            </button>
          </form>
        )}
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Remember your password?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-purple-400 hover:text-purple-300 font-medium underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;