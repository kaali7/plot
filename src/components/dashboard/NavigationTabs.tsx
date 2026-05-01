import React from 'react';

interface NavigationTabsProps {
  activeTab: 'overview' | 'characters' | 'scenes' | 'conflicts' | 'writing' | 'resources';
  onTabChange: (tab: string) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'characters', label: 'Characters', icon: '👥' },
    { id: 'scenes', label: 'Scenes', icon: '🎬' },
    { id: 'conflicts', label: 'Conflicts', icon: '⚔️' },
    { id: 'writing', label: 'Writing', icon: '✍️' },
    { id: 'resources', label: 'Resources', icon: '📎' }
  ];

  return (
    <div className="flex flex-col space-y-2 p-4">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`w-full text-left flex items-center space-x-3 px-4 py-3 rounded-lg 
          ${activeTab === tab.id 
            ? 'bg-purple-800/50 border-l-4 border-purple-500 text-purple-200' 
            : 'hover:bg-[#1a001f]/50 text-purple-300 hover:text-white'}
          `}
        >
          <span>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};