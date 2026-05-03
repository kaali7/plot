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
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-2xl border-b border-white/10 h-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-full">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-magenta-glow animate-pulse"></span>
            <span className="text-2xl font-serif font-bold text-white tracking-tight italic">Plot</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="animate-pulse rounded-full bg-white/10 w-9 h-9"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-2xl border-b border-white/10 h-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-full">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-magenta-glow animate-pulse"></span>
          <span className="text-2xl font-serif font-bold text-white tracking-tight italic">Plot</span>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <div className="flex items-center space-x-3 mr-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                <FaUserCircle 
                  className="text-lg text-editor-text-muted hover:text-white transition-colors cursor-pointer"
                  onClick={() => { /* Profile dropdown could be implemented here */ }}
                />
                <span className="text-sm font-sans text-editor-text-muted">{user.email?.split('@')[0] || 'Writer'}</span>
              </div>
              <button 
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-sm font-sans font-bold tracking-wide text-editor-text-muted hover:text-white transition-all hover:bg-white/10 border border-transparent hover:border-white/10 rounded-full px-5 py-2"
              >
                <FaSignOutAlt className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </>
          ) : (
            <>
              <span className="text-sm font-sans text-editor-text-muted bg-white/5 px-4 py-1.5 rounded-full border border-white/5">Guest</span>
              <button 
                onClick={() => navigate('/login')}
                className="flex items-center space-x-2 text-sm font-sans font-bold tracking-wide text-white bg-primary hover:bg-white hover:text-black shadow-magenta-glow transition-all rounded-full px-5 py-2"
              >
                <FaSignOutAlt className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardNavbar;