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
    <div className="w-full px-4 md:px-6 lg:px-8 pt-6 md:pt-10 lg:pt-16 pb-24 lg:pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-10 items-stretch max-w-[1600px] mx-auto">
        
        <div className="lg:col-span-8 flex flex-col gap-6 md:gap-8 lg:gap-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
            {/* Story Foundation */}
            <div className="card-tactile group p-6 md:p-8 lg:p-10 flex flex-col min-h-[320px] lg:min-h-[400px] hover:border-editor-magenta/30 transition-all duration-700 ease-out">
              <div className="flex items-center space-x-3 mb-8 lg:mb-10 pb-4 border-b border-white/5 relative">
                <div className="w-1.5 h-1.5 rounded-full bg-editor-magenta shadow-magenta-glow group-hover:scale-125 transition-transform duration-500"></div>
                <h2 className="text-[10px] md:text-[11px] font-mono text-editor-text-muted uppercase tracking-[0.4em] font-bold group-hover:text-white transition-colors duration-500">Story Foundation</h2>
                <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-editor-magenta group-hover:w-full transition-all duration-700"></div>
              </div>
              <div className="flex-1">
                <BasicInfoPanel 
                  story={story}
                  onUpdate={onStoryUpdate}
                />
              </div>
            </div>
 
            {/* World Settings */}
            <div className="card-tactile group p-6 md:p-8 lg:p-10 flex flex-col min-h-[320px] lg:min-h-[400px] hover:border-green-500/30 transition-all duration-700 ease-out">
              <div className="flex items-center space-x-3 mb-8 lg:mb-10 pb-4 border-b border-white/5 relative">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-green-glow group-hover:scale-125 transition-transform duration-500"></div>
                <h2 className="text-[10px] md:text-[11px] font-mono text-editor-text-muted uppercase tracking-[0.4em] font-bold group-hover:text-white transition-colors duration-500">World Settings</h2>
                <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-green-500 group-hover:w-full transition-all duration-700"></div>
              </div>
              <div className="flex-1">
                <WorldSettingsPanel 
                  storyId={story.id}
                  worldSettings={worldSettings}
                  onUpdate={onWorldSettingsUpdate}
                />
              </div>
            </div>
          </div>
 
          {/* Narrative Compass - Expanded Bottom */}
          <div className="card-tactile group p-6 md:p-8 lg:p-10 flex-1 hover:border-blue-500/30 transition-all duration-700 ease-out">
            <div className="flex items-center space-x-3 mb-8 lg:mb-10 pb-4 border-b border-white/5 relative">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-blue-glow group-hover:scale-125 transition-transform duration-500"></div>
              <h2 className="text-[10px] md:text-[11px] font-mono text-editor-text-muted uppercase tracking-[0.4em] font-bold group-hover:text-white transition-colors duration-500">Narrative Compass</h2>
              <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all duration-700"></div>
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
          <div className="card-tactile group p-6 md:p-8 lg:p-10 flex-1 flex flex-col min-h-[500px] md:min-h-[600px] lg:min-h-[800px] hover:border-orange-500/30 transition-all duration-700 ease-out">
            <div className="flex items-center space-x-3 mb-8 lg:mb-10 pb-4 border-b border-white/5 relative">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-orange-glow group-hover:scale-125 transition-transform duration-500"></div>
              <h2 className="text-[10px] md:text-[11px] font-mono text-editor-text-muted uppercase tracking-[0.4em] font-bold group-hover:text-white transition-colors duration-500">Conflict Engine</h2>
              <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-orange-500 group-hover:w-full transition-all duration-700"></div>
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