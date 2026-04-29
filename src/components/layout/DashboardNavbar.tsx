import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

const DashboardNavbar = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-black to-[#2a003f]/90 backdrop-blur-sm border-b border-[rgba(138,0,194,0.1)] shadow-[0_0_20px_rgba(138,0,194,0.2)] h-16">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-full">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white">Plot</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="animate-pulse rounded-full bg-gray-700 w-9 h-9"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-black to-[#2a003f]/90 backdrop-blur-sm border-b border-[rgba(138,0,194,0.1)] shadow-[0_0_20px_rgba(138,0,194,0.2)] h-16">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-full">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-white">Plot</span>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <div className="relative">
                <FaUserCircle 
                  className="text-2xl text-gray-300 hover:text-white transition-colors cursor-pointer"
                  onClick={() => { /* Profile dropdown could be implemented here */ }}
                />
                {/* Simple email display for now */}
                <span className="text-sm text-gray-300">{user.email?.split('@')[0] || 'User'}</span>
              </div>
              <button 
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white transition-colors bg-[rgba(138,0,194,0.1)] hover:bg-[rgba(138,0,194,0.2)] rounded-xl px-4 py-2"
              >
                <FaSignOutAlt className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Fallback if no user */}
              <span className="text-sm text-gray-300">User</span>
              <button 
                onClick={() => navigate('/login')}
                className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white transition-colors bg-[rgba(138,0,194,0.1)] hover:bg-[rgba(138,0,194,0.2)] rounded-xl px-4 py-2"
              >
                <FaSignOutAlt className="w-4 h-4" />
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};