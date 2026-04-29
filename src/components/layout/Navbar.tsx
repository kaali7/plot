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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1a001f]/90 backdrop-blur-sm border-b border-[#8a00c2]/20 shadow-[0_0_20px_rgba(138,0,194,0.2)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between h-20">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-white font-bold text-2xl">Plot</span>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-6">
            {/* Navigation Links */}
            <nav className="flex-1 space-x-8">
              <a 
                href="/"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Stories
              </a>
              <a 
                href="/#features"
                className="text-gray-400 hover:text-white transition-colors"
              >
                How it Works
              </a>
              <a 
                href="/#visuals"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Examples
              </a>
              <a 
                href="/#cta"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Start Writing
              </a>
            </nav>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-6">
            {!user ? (
              <>
                <button 
                  onClick={handleLogin}
                  className="px-6 py-3 border border-[#5a007a]/50 text-[#5a007a] hover:bg-[#5a007a]/20 rounded-2xl transition-all duration-200"
                >
                  Login
                </button>
                <button 
                  onClick={handleRegister}
                  className="px-6 py-3 bg-[#5a007a] text-white hover:bg-[#5a007a]/80 rounded-2xl transition-all duration-200"
                >
                  Register
                </button>
              </>
            ) : (
              <>
                <span className="text-[#cfcfcf] mr-6">{session?.user?.email?.split('@')[0] ?? 'User'}</span>
                <button 
                  onClick={signOut}
                  className="px-6 py-3 bg-[#8a00c2]/20 text-[#8a00c2] hover:bg-[#8a00c2]/30 rounded-2xl transition-all duration-200"
                >
                  Logout
                </button>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center md:hidden">
            <button 
              type="button"
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;