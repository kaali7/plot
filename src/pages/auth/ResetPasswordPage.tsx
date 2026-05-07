import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

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
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs for auth pages */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
            Sanctuary Access
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-3 italic">Reset Password</h1>
          <p className="text-editor-text-muted font-sans text-sm tracking-wide">Choose a new password for your account</p>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl text-sm font-sans flex items-center">
            <span className="mr-2">⚠️</span> {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-2xl text-sm font-sans flex items-center">
            <span className="mr-2">✓</span> {success}
          </div>
        )}
        
        {!accessToken && !error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl text-sm font-sans">
            Invalid or expired reset link. Please request a new one.
          </div>
        )}
        
        {accessToken && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-bold text-editor-text-muted uppercase tracking-widest ml-1">
                New Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 text-white placeholder-white/20 font-sans transition-all"
                placeholder="••••••••"
              />
            </div>
            
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="block text-xs font-bold text-editor-text-muted uppercase tracking-widest ml-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 text-white placeholder-white/20 font-sans transition-all"
                placeholder="••••••••"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-accent text-background font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-primary-glow hover:shadow-primary-glow-lg hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 text-sm tracking-widest uppercase mt-4"
            >
              {loading ? 'Updating...' : 'Reset Password'}
            </button>
          </form>
        )}
        
        <div className="text-center pt-4">
          <p className="text-sm text-editor-text-muted font-sans">
            Remember your password?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-primary hover:text-white font-bold transition-colors ml-1"
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