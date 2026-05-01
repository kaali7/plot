import React from 'react';

interface DashboardHeaderProps {
  story: {
    id: string;
    title: string;
    theme?: string;
    description?: string;
    world_settings: {
      locations: string[];
      timePeriod?: string;
      atmosphere?: string;
      environmentDescription?: string;
      linkedResources: string[];
    };
  };
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ story }) => {
  return (
    <div className="flex flex-col h-20 items-center justify-between px-6 py-4 border-b border-purple-900/30">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-1">
          {story.title || 'Untitled Story'}
        </h1>
        {story.theme && (
          <p className="text-purple-300 text-sm">{story.theme}</p>
        )}
      </div>
      
      <div className="flex space-x-4">
        <button 
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
        >
          Save
        </button>
        <button 
          className="bg-purple-800 hover:bg-purple-900 text-white px-4 py-2 rounded transition-colors"
        >
          Export
        </button>
      </div>
    </div>
  );
};