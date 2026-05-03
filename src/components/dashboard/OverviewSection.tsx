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
    <div className="w-full px-4 lg:px-8 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        
        <div className="lg:col-span-8 flex flex-col gap-6 lg:gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Story Foundation */}
            <div className="card-tactile p-6 lg:p-10 flex flex-col min-h-[300px] lg:min-h-[380px] hover:border-editor-magenta/20 transition-all duration-500">
              <div className="flex items-center space-x-3 mb-6 lg:mb-10 pb-4 border-b border-white/5">
                <div className="w-1.5 h-1.5 rounded-full bg-editor-magenta shadow-magenta-glow"></div>
                <h2 className="text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.4em] font-bold">Story Foundation</h2>
              </div>
              <div className="flex-1">
                <BasicInfoPanel 
                  story={story}
                  onUpdate={onStoryUpdate}
                />
              </div>
            </div>

            {/* World Settings */}
            <div className="card-tactile p-6 lg:p-10 flex flex-col min-h-[300px] lg:min-h-[380px] hover:border-green-500/20 transition-all duration-500">
              <div className="flex items-center space-x-3 mb-6 lg:mb-10 pb-4 border-b border-white/5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-green-glow"></div>
                <h2 className="text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.4em] font-bold">World Settings</h2>
              </div>
              <div className="flex-1">
                <WorldSettingsPanel 
                  worldSettings={worldSettings}
                  onUpdate={onWorldSettingsUpdate}
                />
              </div>
            </div>
          </div>

          {/* Narrative Compass - Expanded Bottom */}
          <div className="card-tactile p-6 lg:p-10 flex-1 hover:border-blue-500/20 transition-all duration-500">
            <div className="flex items-center space-x-3 mb-6 lg:mb-10 pb-4 border-b border-white/5">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-blue-glow"></div>
              <h2 className="text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.4em] font-bold">Narrative Compass</h2>
            </div>
            <UnifiedStoryOverview 
              overviewData={story.description || ''}
              charactersData={characters}
              onSave={(newContent: string) => onStoryUpdate({ description: newContent })}
            />
          </div>
        </div>

        {/* Right Side: Conflict Engine (1/3 width) */}
        <div className="lg:col-span-4 flex">
          <div className="card-tactile p-6 lg:p-10 flex-1 flex flex-col min-h-[500px] lg:min-h-[700px] hover:border-orange-500/20 transition-all duration-500">
            <div className="flex items-center space-x-3 mb-6 lg:mb-10 pb-4 border-b border-white/5">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-orange-glow"></div>
              <h2 className="text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.4em] font-bold">Conflict Engine</h2>
            </div>
            <div className="flex-1 flex flex-col">
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

      </div>
    </div>
  );
};