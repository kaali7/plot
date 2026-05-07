import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { checkRateLimit, resetRateLimit } from '@/lib/rate-limiter';
import { sanitizeError } from '@/lib/error-mapper';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const { allowed, retryAfterMs } = checkRateLimit('login');
    if (!allowed) {
      setError(`Too many login attempts. Please try again in ${Math.ceil(retryAfterMs / 1000)} seconds.`);
      return;
    }

    setLoading(true);
    
    try {
      const { error: authError } = await signIn(email, password);
      
      if (authError) {
        throw authError;
      }
      
      resetRateLimit('login');
      // Redirect to dashboard or intended page
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(sanitizeError(err));
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
            Secure Access
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-3 italic">Welcome Back</h1>
          <p className="text-editor-text-muted font-sans text-sm tracking-wide">Sign in to continue your storytelling journey</p>
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
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-bold text-editor-text-muted uppercase tracking-widest ml-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 text-white placeholder-white/20 font-sans transition-all"
              placeholder="writer@plot.app"
            />
          </div>
          
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="block text-xs font-bold text-editor-text-muted uppercase tracking-widest ml-1">
                Password
              </label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-[10px] font-bold text-primary hover:text-white uppercase tracking-widest transition-colors"
              >
                Forgot?
              </button>
            </div>
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
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-accent text-background font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-primary-glow hover:shadow-primary-glow-lg hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 text-sm tracking-widest uppercase mt-4"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
        
        <div className="text-center pt-4">
          <p className="text-sm text-editor-text-muted font-sans">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="text-primary hover:text-white font-bold transition-colors ml-1"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;