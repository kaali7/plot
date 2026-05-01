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
    <div className="space-y-12">
      {/* Story Basics */}
      <div className="card-tactile p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-serif font-bold text-white tracking-tight">Story Foundation</h2>
          <p className="text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.2em] mt-1 italic">Core Identity & Premise</p>
        </div>
        <BasicInfoPanel 
          story={story}
          onUpdate={onStoryUpdate}
        />
      </div>

      {/* Unified Story Overview (Rich Narrative View) */}
      <div className="card-tactile p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-serif font-bold text-white tracking-tight">Narrative Compass</h2>
          <p className="text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.2em] mt-1 italic">The Living Story Document</p>
        </div>
        <UnifiedStoryOverview 
          overviewData={story.description || ''}
          charactersData={characters}
          onSave={(newContent: string) => onStoryUpdate({ description: newContent })}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* World Settings */}
        <div className="card-tactile p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-serif font-bold text-white tracking-tight">World Settings</h2>
            <p className="text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.2em] mt-1 italic">Environment & Atmosphere</p>
          </div>
          <WorldSettingsPanel 
            worldSettings={worldSettings}
            onUpdate={onWorldSettingsUpdate}
          />
        </div>

        {/* Conflicts */}
        <div className="card-tactile p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-serif font-bold text-white tracking-tight">Story Conflicts</h2>
            <p className="text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.2em] mt-1 italic">The Engine of Change</p>
          </div>
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
  );
};