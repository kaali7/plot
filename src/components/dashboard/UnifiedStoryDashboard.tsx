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
    addScene, updateScene, deleteScene,
    addConflict, updateConflict, deleteConflict,
    addResource, updateResource, deleteResource
  } = useStory();

  const [activeTab, setActiveTab] = useState<'overview' | 'characters' | 'scenes' | 'writing' | 'resources'>('overview');
  const [isSceneDetailOpen, setIsSceneDetailOpen] = useState(false);

  if (loading && !story) {
    return (
      <div className="flex h-full bg-background">
        <div className="w-72 border-r border-editor-border p-8 space-y-8">
          <Skeleton className="h-10 w-full mb-12" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="flex-1 p-12 space-y-12">
          <Skeleton className="h-12 w-1/3 mb-16" />
          <div className="grid grid-cols-2 gap-12">
            <Skeleton.Card />
            <Skeleton.Card />
          </div>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="flex h-full items-center justify-center bg-background">
        <div className="text-center p-12 card-tactile max-w-md">
          <h2 className="text-red-400 font-serif text-2xl mb-4">Archive Retrieval Failed</h2>
          <p className="text-editor-text-muted font-mono text-xs uppercase tracking-widest mb-8">{error || 'Unknown error'}</p>
          <button 
            onClick={() => refetch()}
            className="btn-primary px-8 py-3 text-[10px] font-bold tracking-widest uppercase rounded-sm"
          >
            Re-Initialize
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full overflow-hidden bg-background">
      {/* Sidebar/Bottom Navigation */}
      <nav className="w-full lg:w-24 bg-[#0b0c10] border-t lg:border-t-0 lg:border-r border-black/20 flex lg:flex-col items-center justify-between lg:justify-start px-6 lg:px-0 py-2 lg:py-12 z-50 transition-all duration-500">
        <div className="hidden lg:block w-full">
          <DashboardHeader story={story} />
        </div>
        <NavigationTabs 
          activeTab={activeTab} 
          onTabChange={(tab) => setActiveTab(tab as any)}
          hideMobileNav={activeTab === 'scenes' && isSceneDetailOpen}
        />
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 overflow-hidden bg-background relative pb-20 lg:pb-0">
        <div className="flex flex-col h-full">
          {/* Section Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'overview' && (
              <ErrorBoundary>
                <div className="h-full overflow-y-auto custom-scrollbar">
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
                </div>
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
                  onViewingSceneChange={setIsSceneDetailOpen}
                />
              </ErrorBoundary>
            )}
            
            {activeTab === 'writing' && (
              <ErrorBoundary>
                <WritingSection 
                  writingSession={writingSession}
                  characters={characters}
                  scenes={scenes}
                  isSaving={loading}
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
