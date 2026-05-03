import React from 'react';
import { BasicInfoPanel } from './BasicInfoPanel';
import { WorldSettingsPanel } from './WorldSettingsPanel';
import { ConflictBuilder } from './ConflictBuilder';
import UnifiedStoryOverview from '../story/UnifiedStoryOverview';
import type { Story, Character, WorldSettings, Conflict } from '../../types/story.types';

interface OverviewSectionProps {
  story: Story;
  characters: Character[];
  conflicts: Conflict[];
  worldSettings: WorldSettings;
  onWorldSettingsUpdate: (settings: WorldSettings) => void;
  onStoryUpdate: (updates: Partial<Story>) => void;
  onConflictAdd: (conflict: Partial<Conflict>) => void;
  onConflictUpdate: (id: string, updates: Partial<Conflict>) => void;
  onConflictDelete: (id: string) => void;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  story,
  characters,
  conflicts,
  worldSettings,
  onWorldSettingsUpdate,
  onStoryUpdate,
  onConflictAdd,
  onConflictUpdate,
  onConflictDelete
}) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Story Foundation - Top Left */}
        <div className="lg:col-span-4 card-tactile p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-editor-magenta shadow-magenta-glow"></div>
            <h2 className="text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.3em] font-bold">Story Foundation</h2>
          </div>
          <BasicInfoPanel 
            story={story}
            onUpdate={onStoryUpdate}
          />
        </div>

        {/* World Settings - Top Middle (Moved here) */}
        <div className="lg:col-span-4 card-tactile p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-green-glow"></div>
            <h2 className="text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.3em] font-bold">World Settings</h2>
          </div>
          <WorldSettingsPanel 
            worldSettings={worldSettings}
            onUpdate={onWorldSettingsUpdate}
          />
        </div>

        {/* Conflict Engine - Full Right Height */}
        <div className="lg:col-span-4 lg:row-span-2 flex">
          <div className="card-tactile p-8 flex-1 flex flex-col">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-orange-glow"></div>
              <h2 className="text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.3em] font-bold">Conflict Engine</h2>
            </div>
            <div className="flex-1">
              <ConflictBuilder 
                storyId={story.id}
                conflicts={conflicts}
                onConflictAdd={onConflictAdd}
                onConflictUpdate={onConflictUpdate}
                onConflictDelete={onConflictDelete}
              />
            </div>
          </div>
        </div>

        {/* Narrative Compass - Expanded Bottom */}
        <div className="lg:col-span-8 card-tactile p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-blue-glow"></div>
            <h2 className="text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.3em] font-bold">Narrative Compass</h2>
          </div>
          <UnifiedStoryOverview 
            overviewData={story.description || ''}
            charactersData={characters}
            onSave={(newContent: string) => onStoryUpdate({ description: newContent })}
          />
        </div>

      </div>
    </div>
  );
};