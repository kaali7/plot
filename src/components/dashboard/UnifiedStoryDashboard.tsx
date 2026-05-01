import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useStoryManager } from '../../hooks/useStoryData';
import { DashboardHeader } from './DashboardHeader';
import { NavigationTabs } from './NavigationTabs';
import { OverviewSection } from './OverviewSection';
import { CharacterSection } from '../character-section/CharacterSection';
import { SceneSection } from '../scene-section/SceneSection';
import { WritingSection } from '../writing-section/WritingSection';
import { ResourcesSection } from '../resources-section/ResourcesSection';

interface StoryParams {
  storyId: string;
}

export const UnifiedStoryDashboard: React.FC = () => {
  const { storyId } = useParams<StoryParams>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    story,
    characters,
    scenes,
    conflicts,
    resources,
    writingSession,
    loading: dataLoading,
    error: dataError,
    refetch
  } = useStoryManager(storyId || '');

  useEffect(() => {
    if (dataLoading || dataError) {
      setLoading(dataLoading);
      setError(dataError ? dataError.message : null);
    }
  }, [dataLoading, dataError]);

  if (loading && !story) {
    return <div className="flex h-full items-center justify-center">Loading dashboard...</div>;
  }

  if (error || !story) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center p-6 bg-red-900/50 rounded-xl border border-red-700/30">
          <h2 className="text-red-300 mb-4">Error Loading Dashboard</h2>
          <p className="text-red-400">{error || 'Unknown error'}</p>
          <button 
            onClick={() => refetch()}
            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gradient-to-r from-black to-[#2a003f]">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-[#1a001f] border-r border-purple-900/30 flex flex-col">
        <DashboardHeader story={story} />
        <NavigationTabs 
          activeTab="overview" 
          onTabChange={(tab) => console.log('Switch to tab:', tab)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Section Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* In a real implementation, this would switch based on active tab */}
            <OverviewSection 
              story={story} 
              worldSettings={story.world_settings}
              onWorldSettingsUpdate={(settings) => 
                console.log('Updating world settings:', settings)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};