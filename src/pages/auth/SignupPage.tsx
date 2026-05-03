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
     <div className="min-h-screen bg-gradient-to-r from-black to-[#2a003f] flex items-center justify-center p-4">
       <div className="w-full max-w-md space-y-6">
         <div className="text-center">
           <h1 className="text-3xl font-bold text-white">Create Account</h1>
           <p className="text-gray-400">Join thousands of writers using Plot to craft their stories</p>
         </div>
         
         {error && (
           <div className="bg-red-900/20 border border-red-700/30 text-red-300 px-4 py-3 rounded-xl">
             {error}
           </div>
         )}
         
         {success && (
           <div className="bg-green-900/20 border border-green-700/30 text-green-300 px-4 py-3 rounded-xl">
             {showConfirmation ? 
               <div className="space-y-3">
                 <p>Account created successfully!</p>
                 <p className="text-sm">Please check your email to verify your account.</p>
                 <p className="text-xs text-gray-400">Redirecting to dashboard...</p>
               </div>
             : 
               success
             }
           </div>
         )}
         
         {!showConfirmation && (
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
                 placeholder="Create a password"
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
                 placeholder="Confirm your password"
               />
             </div>
             
             <div className="flex items-start">
               <div className="flex items-center h-4">
                 <input
                   id="agree-terms"
                   type="checkbox"
                   checked={tosAccepted}
                   onChange={(e) => setTosAccepted(e.target.checked)}
                   className="h-4 w-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                 />
               </div>
               <div className="ml-3 text-sm">
                 <label htmlFor="agree-terms" className="text-gray-400">
                   I agree to the <span className="text-purple-400 hover:text-purple-300 underline">Terms of Service</span> and 
                   <span className="text-purple-400 hover:text-purple-300 underline">Privacy Policy</span>
                 </label>
               </div>
             </div>
             
             <button
               type="submit"
               disabled={loading}
               className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
             >
               {loading ? 'Creating account...' : 'Sign Up'}
             </button>
           </form>
         )}
         
         {!showConfirmation && (
           <div className="text-center mt-6">
             <p className="text-sm text-gray-500">
               Already have an account?{' '}
               <button
                 type="button"
                 onClick={() => navigate('/login')}
                 className="text-purple-400 hover:text-purple-300 font-medium underline"
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