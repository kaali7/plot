import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { user, session, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/signup');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-editor-border shadow-magenta-glow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-editor-magenta font-serif font-bold text-2xl tracking-tight">Plot</span>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-8">
            <nav className="flex space-x-8">
              <a 
                href="/"
                className="text-editor-text-muted hover:text-white transition-colors text-sm font-medium tracking-wide uppercase"
              >
                Stories
              </a>
              <a 
                href="/#features"
                className="text-editor-text-muted hover:text-white transition-colors text-sm font-medium tracking-wide uppercase"
              >
                How it Works
              </a>
            </nav>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-4">
            {!user ? (
              <>
                <button 
                  onClick={handleLogin}
                  className="px-5 py-2 text-editor-text-muted hover:text-white transition-all text-sm font-medium tracking-wide uppercase"
                >
                  Login
                </button>
                <button 
                  onClick={handleRegister}
                  className="btn-magenta px-6 py-2 text-sm font-bold tracking-widest uppercase rounded-sm"
                >
                  Register
                </button>
              </>
            ) : (
              <>
                <span className="text-editor-text-muted text-sm font-mono mr-4 italic">
                  {session?.user?.email?.split('@')[0] ?? 'User'}
                </span>
                <button 
                  onClick={signOut}
                  className="px-5 py-2 border border-editor-border text-editor-text hover:bg-white/5 transition-all text-sm font-medium tracking-wide uppercase rounded-sm"
                >
                  Logout
                </button>
              </>
            )}
          </div>
          
          <div className="md:hidden flex items-center">
            <button 
              type="button"
              className="p-2 text-editor-text-muted hover:text-white"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;