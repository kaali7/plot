import React from 'react';
import { BasicInfoPanel } from './BasicInfoPanel';
import { WorldSettingsPanel } from './WorldSettingsPanel';
import { ConflictBuilder } from './ConflictBuilder';
import type { Story, WorldSettings } from '../../types/story.types';

interface OverviewSectionProps {
  story: Story;
  worldSettings: WorldSettings;
  onWorldSettingsUpdate: (settings: WorldSettings) => void;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  story,
  worldSettings,
  onWorldSettingsUpdate
}) => {
  return (
    <div className="space-y-6">
      {/* Story Basics */}
      <div className="bg-[#1a001f] rounded-xl p-6 border border-purple-900/30 shadow-[0_0_20px_rgba(138,0,194,0.2)]">
        <h2 className="text-xl font-bold text-white mb-4">Story Foundation</h2>
        <BasicInfoPanel 
          story={story}
          onUpdate={(updates) => console.log('Update story:', updates)}
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
          conflicts={[]} // Will be populated from data
          onConflictAdd={(conflict) => console.log('Add conflict:', conflict)}
          onConflictUpdate={(id, updates) => console.log('Update conflict:', id, updates)}
          onConflictDelete={(id) => console.log('Delete conflict:', id)}
        />
      </div>
    </div>
  );
};