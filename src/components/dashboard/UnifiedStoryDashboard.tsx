import React, { useState } from 'react';
import { useStory } from '../../context/StoryContext';
import { DashboardHeader } from './DashboardHeader';
import { NavigationTabs } from './NavigationTabs';
import { OverviewSection } from './OverviewSection';
import { CharacterSection } from '../character-section/CharacterSection';
import { SceneSection } from '../scene-section/SceneSection';
import { WritingSection } from '../writing-section/WritingSection';
import { ResourcesSection } from '../resources-section/ResourcesSection';
import { Toast } from '../ui/Toast';
import { Skeleton } from '../ui/Skeleton';
import { ErrorBoundary } from '../ui/ErrorBoundary';

export const UnifiedStoryDashboard: React.FC = () => {
  const { 
    story, characters, scenes, conflicts, resources, writingSession,
    loading, error, refetch, 
    updateStory, updateWorldSettings, updateWriting,
    addCharacter, updateCharacter, deleteCharacter,
    addScene, updateScene, deleteScene, reorderScenes,
    addConflict, updateConflict, deleteConflict,
    addResource, updateResource, deleteResource
  } = useStory();

  const [activeTab, setActiveTab] = useState<'overview' | 'characters' | 'scenes' | 'writing' | 'resources'>('overview');

  if (loading && !story) {
    return (
      <div className="flex h-full bg-[#0a000f]">
        <div className="w-64 border-r border-purple-900/20 p-6 space-y-6">
          <Skeleton className="h-10 w-full mb-8" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="flex-1 p-8 space-y-8">
          <Skeleton className="h-12 w-1/3 mb-12" />
          <div className="grid grid-cols-2 gap-8">
            <Skeleton.Card />
            <Skeleton.Card />
          </div>
          <Skeleton.Text lines={10} className="pt-8" />
        </div>
      </div>
    );
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
          activeTab={activeTab} 
          onTabChange={(tab) => setActiveTab(tab as any)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Section Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'overview' && (
              <ErrorBoundary>
                <OverviewSection 
                  story={story} 
                  characters={characters}
                  conflicts={conflicts}
                  worldSettings={story.world_settings}
                  onWorldSettingsUpdate={updateWorldSettings}
                  onStoryUpdate={updateStory}
                  onConflictAdd={addConflict}
                  onConflictUpdate={updateConflict}
                  onConflictDelete={deleteConflict}
                />
              </ErrorBoundary>
            )}
            
            {activeTab === 'characters' && (
              <ErrorBoundary>
                <CharacterSection 
                  characters={characters}
                  onCharacterAdd={addCharacter}
                  onCharacterUpdate={updateCharacter}
                  onCharacterDelete={deleteCharacter}
                />
              </ErrorBoundary>
            )}
            
            {activeTab === 'scenes' && (
              <ErrorBoundary>
                <SceneSection 
                  scenes={scenes}
                  characters={characters}
                  conflicts={conflicts}
                  onSceneAdd={addScene}
                  onSceneUpdate={updateScene}
                  onSceneDelete={deleteScene}
                  onReorderScenes={reorderScenes}
                />
              </ErrorBoundary>
            )}
            
            {activeTab === 'writing' && (
              <ErrorBoundary>
                <WritingSection 
                  writingSession={writingSession}
                  characters={characters}
                  scenes={scenes}
                  onWritingUpdate={updateWriting}
                />
              </ErrorBoundary>
            )}
            
            {activeTab === 'resources' && (
              <ErrorBoundary>
                <ResourcesSection 
                  resources={resources}
                  onResourceAdd={addResource}
                  onResourceUpdate={updateResource}
                  onResourceDelete={deleteResource}
                />
              </ErrorBoundary>
            )}
          </div>
        </div>
      </div>
      
      {/* Global Modals & Notifications */}
      <Toast />
    </div>
  );
};