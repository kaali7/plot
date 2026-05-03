import React from 'react';

interface NavigationTabsProps {
  activeTab: 'overview' | 'characters' | 'scenes' | 'writing' | 'resources';
  onTabChange: (tab: string) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { 
      id: 'overview', 
      label: 'Story Bible', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    { 
      id: 'characters', 
      label: 'Character Forge', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      id: 'scenes', 
      label: 'Scene Editor', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
      )
    },
    { 
      id: 'writing', 
      label: 'Manuscript', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      )
    },
    { 
      id: 'resources', 
      label: 'Library', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    }
  ];

  return (
    <div className="flex flex-row lg:flex-col items-center justify-center lg:justify-start py-4 lg:py-12 px-4 lg:px-0 space-x-6 lg:space-x-0 lg:space-y-6 overflow-x-auto lg:overflow-y-auto custom-scrollbar w-full no-scrollbar">
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            title={tab.label}
            className={`group relative flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl transition-all duration-500 flex-shrink-0 ${
              isActive 
                ? 'bg-primary/20 text-primary shadow-glass scale-110' 
                : 'bg-surface-dark text-editor-text-muted hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <div className={`transition-transform duration-500 transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
              {tab.icon}
            </div>

            {/* Micro-indicator */}
            {isActive && (
              <div className="absolute -bottom-1 lg:bottom-auto lg:-right-2 w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full bg-primary shadow-magenta-glow" />
            )}

            {/* Custom Tooltip visible only on md+ screens */}
            <span className="hidden lg:group-hover:block absolute left-14 bg-[#0a0a0f] border border-white/10 text-white text-xs px-3 py-1.5 rounded-md shadow-xl whitespace-nowrap z-50 animate-in fade-in duration-200">
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};