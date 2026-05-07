import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { checkRateLimit, resetRateLimit } from '@/lib/rate-limiter';
import { sanitizeError } from '@/lib/error-mapper';

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [tosAccepted, setTosAccepted] = useState(false);
   
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const { allowed, retryAfterMs } = checkRateLimit('signup');
    if (!allowed) {
      setError(`Too many signup attempts. Please try again in ${Math.ceil(retryAfterMs / 1000)} seconds.`);
      return;
    }

    setLoading(true);
    
    // Form validation
    if (!email || !password || !confirmPassword) {
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

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, and one number');
      setLoading(false);
      return;
    }

    if (!tosAccepted) {
      setError('You must accept the Terms of Service to create an account');
      setLoading(false);
      return;
    }
    
    try {
      const { error: authError, data } = await signUp(email, password);
      
      if (authError) {
        throw authError;
      }
      
      // Check if email confirmation is required
      if (data?.user?.identities?.[0]?.identity?.email) {
        setSuccess('Account created successfully! Please check your email to verify your account.');
        // Show confirmation message and redirect to dashboard after a delay
        setShowConfirmation(true);
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 3000);
      } else {
        setSuccess('Account created successfully! Please check your email to verify your account.');
        setShowConfirmation(true);
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 3000);
      }
      resetRateLimit('signup');
    } catch (err: any) {
      setError(sanitizeError(err));
    } finally {
      setLoading(false);
    }
  };

return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs for auth pages */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
            Join the Guild
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-3 italic">Create Account</h1>
          <p className="text-editor-text-muted font-sans text-sm tracking-wide">Join thousands of writers using Plot to craft their stories</p>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl text-sm font-sans flex items-center">
            <span className="mr-2">⚠️</span> {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-2xl text-sm font-sans">
            {showConfirmation ? 
              <div className="space-y-3">
                <p className="font-bold flex items-center"><span className="mr-2">✓</span> Account created successfully!</p>
                <p className="text-xs opacity-80">Please check your email to verify your account. Redirecting you to the workspace...</p>
              </div>
            : 
              <div className="flex items-center"><span className="mr-2">✓</span> {success}</div>
            }
          </div>
        )}
        
        {!showConfirmation && (
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
              <label htmlFor="password" className="block text-xs font-bold text-editor-text-muted uppercase tracking-widest ml-1">
                Password
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
            
            <div className="flex items-start pt-2">
              <div className="flex items-center h-5">
                <input
                  id="agree-terms"
                  type="checkbox"
                  checked={tosAccepted}
                  onChange={(e) => setTosAccepted(e.target.checked)}
                  className="h-4 w-4 bg-white/5 border-white/10 rounded text-primary focus:ring-primary/30 transition-all cursor-pointer"
                />
              </div>
              <div className="ml-3 text-xs">
                <label htmlFor="agree-terms" className="text-editor-text-muted leading-relaxed">
                  I agree to the <span className="text-primary hover:text-white underline cursor-pointer transition-colors">Terms of Service</span> and 
                  <span className="text-primary hover:text-white underline cursor-pointer transition-colors ml-1">Privacy Policy</span>
                </label>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-accent text-background font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-primary-glow hover:shadow-primary-glow-lg hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 text-sm tracking-widest uppercase mt-4"
            >
              {loading ? 'Processing...' : 'Sign Up'}
            </button>
          </form>
        )}
        
        {!showConfirmation && (
          <div className="text-center pt-4">
            <p className="text-sm text-editor-text-muted font-sans">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-primary hover:text-white font-bold transition-colors ml-1"
              >
                Sign in
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupPage;