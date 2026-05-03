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
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 bg-surface-dark/60 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
      <div className="px-6 sm:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-magenta-glow animate-pulse"></span>
            <span className="text-white font-serif font-bold text-2xl tracking-tight italic">Plot</span>
          </div>
          
          <div className="hidden md:flex md:items-center">
            <nav className="flex space-x-1">
              <a 
                href="/"
                className="px-4 py-2 rounded-full text-editor-text-muted hover:text-white hover:bg-white/5 transition-all text-sm font-sans font-medium tracking-wide"
              >
                Overview
              </a>
              <a 
                href="/#features"
                className="px-4 py-2 rounded-full text-editor-text-muted hover:text-white hover:bg-white/5 transition-all text-sm font-sans font-medium tracking-wide"
              >
                Features
              </a>
              <a 
                href="/#visuals"
                className="px-4 py-2 rounded-full text-editor-text-muted hover:text-white hover:bg-white/5 transition-all text-sm font-sans font-medium tracking-wide"
              >
                Interface
              </a>
              <a 
                href="/#pricing"
                className="px-4 py-2 rounded-full text-editor-text-muted hover:text-white hover:bg-white/5 transition-all text-sm font-sans font-medium tracking-wide"
              >
                Pricing
              </a>
              <a 
                href="/#community"
                className="px-4 py-2 rounded-full text-editor-text-muted hover:text-white hover:bg-white/5 transition-all text-sm font-sans font-medium tracking-wide"
              >
                Community
              </a>
            </nav>
          </div>
          
          <div className="hidden md:flex md:items-center space-x-3">
            {!user ? (
              <>
                <button 
                  onClick={handleLogin}
                  className="px-5 py-2 text-editor-text-muted hover:text-white hover:bg-white/5 rounded-full transition-all text-sm font-sans font-bold tracking-wide"
                >
                  Sign In
                </button>
                <button 
                  onClick={handleRegister}
                  className="bg-primary hover:bg-white text-white hover:text-black shadow-magenta-glow px-6 py-2 text-sm font-sans font-bold tracking-wide rounded-full transition-all duration-300"
                >
                  Start Writing
                </button>
              </>
            ) : (
              <>
                <span className="text-editor-text-muted text-sm font-sans mr-4 bg-white/5 px-3 py-1 rounded-full border border-white/5 hidden lg:block">
                  {session?.user?.email?.split('@')[0] ?? 'Writer'}
                </span>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-primary hover:bg-white text-white hover:text-black shadow-magenta-glow px-5 py-2 text-sm font-sans font-bold tracking-wide rounded-full transition-all duration-300 mr-2"
                >
                  Open Workspace
                </button>
                <button 
                  onClick={signOut}
                  className="px-5 py-2 border border-white/10 text-editor-text-muted hover:text-white hover:bg-white/10 transition-all text-sm font-sans font-bold tracking-wide rounded-full"
                >
                  Log Out
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