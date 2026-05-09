import React from 'react';
import { BasicInfoPanel } from './BasicInfoPanel';
import { WorldSettingsPanel } from './WorldSettingsPanel';
import { ConflictBuilder } from './ConflictBuilder';
import UnifiedStoryOverview from '../story/UnifiedStoryOverview';
import type { Story, Character, WorldSettings, Conflict, Resource } from '../../types/story.types';

interface OverviewSectionProps {
  story: Story;
  characters: Character[];
  conflicts: Conflict[];
  resources: Resource[];
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
  resources,
  worldSettings,
  onWorldSettingsUpdate,
  onStoryUpdate,
  onConflictAdd,
  onConflictUpdate,
  onConflictDelete
}) => {
  // Compute linked resource counts
  const worldRefCount = (resources || []).filter(r => 
    r.linked_entities?.worldSettings?.includes(story.id)
  ).length;
  
  const conflictResourceCounts = (conflicts || []).reduce((acc, c) => {
    acc[c.id] = (resources || []).filter(r => 
      r.linked_entities?.conflicts?.includes(c.id)
    ).length;
    return acc;
  }, {} as Record<string, number>);
  return (
    <div className="h-full w-full p-4 lg:p-6 flex flex-col overflow-y-auto lg:overflow-hidden custom-scrollbar bg-background/50">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:h-full">
        
        {/* Left Side: Foundation, Setting & Compass (9/12) */}
        <div className="lg:col-span-9 flex flex-col gap-4 lg:h-full">
          
          {/* Top Row: Foundation & Setting */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 flex-[0_0_auto]">
            {/* Story Foundation - Compact */}
            <div className="card-tactile group p-5 lg:p-6 flex flex-col border-primary/10 hover:border-primary/40 transition-all duration-500 min-h-[180px]">
              <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-white/5 relative">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(97,175,239,0.8)]"></div>
                <h2 className="text-[11px] font-mono text-editor-text-muted uppercase tracking-[0.3em] font-bold group-hover:text-primary transition-colors">Foundation</h2>
                <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-500"></div>
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="space-y-3">
                  <h3 className="text-xl font-serif font-bold text-white line-clamp-1">{story.name}</h3>
                  {story.theme && (
                    <div className="flex items-center space-x-2">
                      <span className="text-[9px] font-mono text-primary/40 uppercase font-bold tracking-widest">Theme</span>
                      <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 uppercase tracking-widest">{story.theme}</span>
                    </div>
                  )}
                  <p className="text-[12px] font-serif italic text-editor-text-muted line-clamp-3 leading-relaxed border-l-2 border-primary/30 pl-4 mt-2">
                    {(() => {
                      if (!story.description) return "No core premise established.";
                      if (story.description.startsWith('{')) {
                        try {
                          const parsed = JSON.parse(story.description);
                          return parsed.premise || story.description;
                        } catch {
                          return story.description;
                        }
                      }
                      return story.description;
                    })()}
                  </p>
                </div>
              </div>
              <div className="pt-4 mt-auto border-t border-white/5 flex justify-end">
                <button
                  onClick={() => document.getElementById('btn-edit-foundation')?.click()}
                  className="text-[10px] font-mono text-primary/60 hover:text-primary uppercase tracking-[0.2em] transition-colors font-bold flex items-center space-x-1"
                >
                  <span>Edit Foundation</span>
                  <span>→</span>
                </button>
                <div className="hidden">
                  <BasicInfoPanel story={story} onUpdate={onStoryUpdate} />
                </div>
              </div>
            </div>

            {/* World Settings - Compact */}
            <div className="card-tactile group p-5 lg:p-6 flex flex-col border-green-500/10 hover:border-green-500/40 transition-all duration-500 min-h-[180px]">
              <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-white/5 relative">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
                <h2 className="text-[11px] font-mono text-editor-text-muted uppercase tracking-[0.3em] font-bold group-hover:text-green-500 transition-colors">Setting</h2>
                {worldRefCount > 0 && (
                  <span className="text-[8px] font-mono text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20 ml-auto">
                    {worldRefCount} ref{worldRefCount !== 1 ? 's' : ''}
                  </span>
                )}
                <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-green-500 group-hover:w-full transition-all duration-500"></div>
              </div>
              <div className="flex-1 overflow-hidden flex flex-col space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {worldSettings.timePeriod && (
                    <div className="space-y-1">
                      <h4 className="text-[9px] font-mono text-editor-text-muted uppercase tracking-widest opacity-50">Period</h4>
                      <p className="text-[13px] font-serif text-white/90 line-clamp-2">{worldSettings.timePeriod}</p>
                    </div>
                  )}
                  {worldSettings.atmosphere && (
                    <div className="space-y-1">
                      <h4 className="text-[9px] font-mono text-editor-text-muted uppercase tracking-widest opacity-50">Atmosphere</h4>
                      <p className="text-[13px] font-serif text-white/90 line-clamp-2">{worldSettings.atmosphere}</p>
                    </div>
                  )}
                </div>
                {worldSettings.environmentDescription && (
                  <div className="space-y-1 border-l-2 border-green-500/30 pl-3">
                    <h4 className="text-[9px] font-mono text-editor-text-muted uppercase tracking-widest opacity-50">Environment</h4>
                    <p className="text-[12px] font-serif text-white/70 italic line-clamp-2 leading-relaxed">"{worldSettings.environmentDescription}"</p>
                  </div>
                )}
                {worldSettings.locations && worldSettings.locations.length > 0 && (
                  <div className="space-y-1">
                    <h4 className="text-[9px] font-mono text-editor-text-muted uppercase tracking-widest opacity-50">Locations ({worldSettings.locations.length})</h4>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {worldSettings.locations.slice(0, 3).map((loc, i) => (
                        <span key={i} className="text-[10px] font-mono text-green-400/80 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 truncate max-w-[120px]">{loc}</span>
                      ))}
                      {worldSettings.locations.length > 3 && (
                         <span className="text-[10px] font-mono text-editor-text-muted px-2 py-0.5">+{worldSettings.locations.length - 3} more</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="pt-4 mt-auto border-t border-white/5 flex justify-end">
                <button
                  onClick={() => document.getElementById('btn-edit-setting')?.click()}
                  className="text-[10px] font-mono text-green-500/60 hover:text-green-500 uppercase tracking-[0.2em] transition-colors font-bold flex items-center space-x-1"
                >
                  <span>Edit Setting</span>
                  <span>→</span>
                </button>
                <div className="hidden">
                  <WorldSettingsPanel storyId={story.id} worldSettings={worldSettings} onUpdate={onWorldSettingsUpdate} />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Narrative Compass */}
          <div className="flex-1 min-h-[400px] lg:min-h-0">
            <div className="card-tactile group p-4 lg:p-6 h-full flex flex-col border-blue-500/10 hover:border-blue-500/40 transition-all duration-500 relative overflow-hidden">
              {/* Ambient Background Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5 relative">
                <div className="flex items-center space-x-2">
                  <div className="w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                  <h2 className="text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.3em] font-bold group-hover:text-blue-400 transition-colors">Narrative Compass</h2>
                </div>
                <span className="text-[8px] font-mono text-blue-500/40 uppercase tracking-widest">Active Plot Matrix</span>
                <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all duration-500"></div>
              </div>
              
              <div className="flex-1 min-h-0 overflow-hidden">
                <UnifiedStoryOverview 
                  overviewData={story.description || ''}
                  charactersData={characters}
                  onSave={(newContent: string) => onStoryUpdate({ description: newContent })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Conflict Engine (3/12) */}
        <div className="lg:col-span-3 min-h-[400px] lg:h-full">
          <div className="card-tactile group p-4 flex flex-col h-full border-orange-500/10 hover:border-orange-500/40 transition-all duration-500">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5 relative">
              <div className="flex items-center space-x-2">
                <div className="w-1 h-1 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"></div>
                <h2 className="text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.3em] font-bold group-hover:text-orange-400 transition-colors">Conflict</h2>
              </div>
              <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-orange-500 group-hover:w-full transition-all duration-500"></div>
            </div>
            
            <div className="flex-1 flex flex-col min-h-0">
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