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
    <div className="min-h-screen bg-gradient-to-r from-black to-[#2a003f] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-gray-400">Sign in to continue your storytelling journey</p>
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
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#1a001f] border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 text-white placeholder-gray-400"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 bg-[#1a001f] border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 text-white placeholder-gray-400"
              placeholder="Enter your password"
            />
          </div>
          
          <div className="flex justify-end items-center">
            
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              Forgot Password?
            </button>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="text-purple-400 hover:text-purple-300 font-medium underline"
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