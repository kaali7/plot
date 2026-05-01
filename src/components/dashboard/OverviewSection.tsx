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
    <div className="space-y-6">
      {/* Story Basics */}
      <div className="bg-[#1a001f] rounded-xl p-6 border border-purple-900/30 shadow-[0_0_20px_rgba(138,0,194,0.2)]">
        <h2 className="text-xl font-bold text-white mb-4">Story Foundation</h2>
        <BasicInfoPanel 
          story={story}
          onUpdate={onStoryUpdate}
        />
      </div>

      {/* Unified Story Overview (Rich Narrative View) */}
      <div className="bg-[#1a001f] rounded-xl p-6 border border-purple-900/30 shadow-[0_0_20px_rgba(138,0,194,0.2)]">
        <UnifiedStoryOverview 
          overviewData={story.description || ''}
          charactersData={characters}
          onSave={(newContent: string) => onStoryUpdate({ description: newContent })}
        />
      </div>

      {/* World Settings */}
      <div className="bg-[#1a001f] rounded-xl p-6 border border-purple-900/30 shadow-[0_0_20px_rgba(138,0,194,0.2)]">
        <h2 className="text-xl font-bold text-white mb-4">World Settings</h2>
        <WorldSettingsPanel 
          worldSettings={worldSettings}
          onUpdate={onWorldSettingsUpdate}
        />
      </div>

      {/* Conflicts */}
      <div className="bg-[#1a001f] rounded-xl p-6 border border-purple-900/30 shadow-[0_0_20px_rgba(138,0,194,0.2)]">
        <h2 className="text-xl font-bold text-white mb-4">Story Conflicts</h2>
        <ConflictBuilder 
          storyId={story.id}
          conflicts={conflicts}
          onConflictAdd={onConflictAdd}
          onConflictUpdate={onConflictUpdate}
          onConflictDelete={onConflictDelete}
        />
      </div>
    </div>
  );
};