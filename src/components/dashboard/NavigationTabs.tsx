import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBook, FiUsers, FiFilm, FiEdit3, FiArchive, FiArrowLeft } from 'react-icons/fi';

interface NavigationTabsProps {
  activeTab: 'overview' | 'characters' | 'scenes' | 'writing' | 'resources';
  onTabChange: (tab: string) => void;
  hideMobileNav?: boolean;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, onTabChange, hideMobileNav = false }) => {
  const navigate = useNavigate();
  const tabs = [
    { id: 'overview', label: 'Story Bible', icon: <FiBook className="w-6 h-6" /> },
    { id: 'characters', label: 'Character Forge', icon: <FiUsers className="w-6 h-6" /> },
    { id: 'scenes', label: 'Scene Editor', icon: <FiFilm className="w-6 h-6" /> },
    { id: 'writing', label: 'Manuscript', icon: <FiEdit3 className="w-6 h-6" /> },
    { id: 'resources', label: 'Library', icon: <FiArchive className="w-6 h-6" /> }
  ];

  const activeIndex = tabs.findIndex(t => t.id === activeTab);
  const displayIndex = activeIndex + 1; // 0 is back button
  
  // Calculate the center percentage for the dip
  const dipPosition = (displayIndex * 100) / 6 + (100 / 12);

  return (
    <>
      {/* Desktop Sidebar - Left */}
      <div className="hidden lg:flex flex-col items-center py-12 px-0 space-y-6 overflow-y-auto custom-scrollbar w-full no-scrollbar relative">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              title={tab.label}
              className={`group relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) flex-shrink-0 ${
                isActive 
                  ? 'bg-primary/20 text-primary shadow-primary-glow scale-110' 
                  : 'bg-surface-dark text-editor-text-muted hover:text-white hover:bg-white/[0.05] hover:scale-105'
              }`}
            >
              <div className={`transition-transform duration-500 transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                {tab.icon}
              </div>

              {/* Micro-indicator */}
              {isActive && (
                <div className="absolute -right-2 w-1.5 h-1.5 rounded-full bg-primary shadow-primary-glow" />
              )}

              {/* Custom Tooltip */}
              <span className="hidden group-hover:block absolute left-14 bg-[#0a0a0f] border border-white/10 text-white text-xs px-3 py-1.5 rounded-md shadow-xl whitespace-nowrap z-50 animate-in fade-in duration-200">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mobile Premium Curved Bottom Navigation */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-[100] h-20 pointer-events-none transition-all duration-300 ${hideMobileNav ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
        {/* SVG Curved Background */}
        <div className="absolute inset-0 pointer-events-auto">
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 100 100" 
            preserveAspectRatio="none"
            className="drop-shadow-[0_-10px_20px_rgba(0,0,0,0.5)]"
          >
            <defs>
              <linearGradient id="navGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#121218" />
                <stop offset="100%" stopColor="#08080a" />
              </linearGradient>
            </defs>
            <path 
              className="transition-all duration-[900ms] cubic-bezier(0.34, 1.56, 0.64, 1)"
              d={`
                M 0 30
                L ${dipPosition - 22} 30
                C ${dipPosition - 15} 30, ${dipPosition - 12} 30, ${dipPosition - 9} 38
                C ${dipPosition - 5} 72, ${dipPosition + 5} 72, ${dipPosition + 9} 38
                C ${dipPosition + 12} 30, ${dipPosition + 15} 30, ${dipPosition + 22} 30
                L 100 30
                L 100 100
                L 0 100
                Z
              `}
              fill="url(#navGradient)"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="0.5"
            />
          </svg>
        </div>

        {/* Floating Active Circle (Matches the dip) */}
        <div 
          className="absolute top-0 w-14 h-14 transition-all duration-700 cubic-bezier(0.68, -0.55, 0.265, 1.55) pointer-events-none"
          style={{ 
            left: `${dipPosition}%`,
            transform: 'translate(-50%, 0)'
          }}
        >
          <div className="w-full h-full bg-[#08080a] rounded-full flex items-center justify-center border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.9)]">
            <div className="absolute inset-0 rounded-full bg-primary/25 blur-3xl animate-pulse" />
            <div className="absolute inset-[1px] rounded-full border border-white/[0.08] shadow-inner" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-white/10 rounded-full" />
          </div>
        </div>

        {/* Tab Icons Row */}
        <div className="absolute inset-0 flex items-center pointer-events-auto pt-4">
          {/* Back Button (Slot 0) */}
          <div className="flex-1 h-full flex items-center justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center justify-center w-12 h-12 rounded-full text-editor-text-muted hover:text-white transition-all active:scale-90"
            >
              <FiArrowLeft className="w-6 h-6 stroke-[1.5]" />
            </button>
          </div>

          {/* Editor Tabs (Slots 1-5) */}
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <div key={tab.id} className="flex-1 h-full flex items-center justify-center">
                <button
                  onClick={() => onTabChange(tab.id)}
                  className={`relative flex flex-col items-center justify-center w-full h-full transition-all duration-500 ${
                    isActive ? '-translate-y-4 text-primary' : 'text-editor-text-muted opacity-40 hover:opacity-100'
                  }`}
                >
                  <div className={`transition-all duration-700 ${isActive ? 'scale-110' : 'scale-100 opacity-20 hover:opacity-100'}`}>
                    {tab.icon}
                  </div>
                  {isActive && (
                    <div className="absolute -bottom-6 flex items-center justify-center">
                      <div className="absolute w-4 h-4 bg-primary/30 blur-md rounded-full" />
                      <div className="relative w-2 h-2 rounded-full bg-primary shadow-[0_0_15px_rgba(255,51,102,0.8)]">
                        <div className="absolute inset-[25%] rounded-full bg-white opacity-80" />
                      </div>
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
