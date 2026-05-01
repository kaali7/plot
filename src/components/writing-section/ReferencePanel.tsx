import React from 'react';

interface ReferencePanelProps {
  characters: any[]; // Character type
  scenes: any[]; // Scene type
  onInsertReference: (type: 'character' | 'scene', id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const ReferencePanel: React.FC<ReferencePanelProps> = ({ 
  characters, 
  scenes, 
  onInsertReference,
  isOpen,
  onToggle
}) => {
  if (!isOpen) {
    return (
      <div className="w-16 bg-[#1a001f] border-r border-purple-900/30 flex items-center justify-center">
        <button
          onClick={onToggle}
          className="text-purple-400 hover:text-purple-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h2m8-9V9m8 0h-8m8 8H9a2 2 0 01-2-2V5a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2h-2m-2 8H7a2 2 0 01-2-2v-2a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2h-2z" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="w-64 bg-[#1a001f] border-l border-purple-900/30 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-purple-900/30">
        <h3 className="text-lg font-bold text-white">References</h3>
        <button
          onClick={onToggle}
          className="text-purple-400 hover:text-purple-300"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
    <div className="flex-1 overflow-y-auto space-y-12">
      {/* Characters */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-editor-border pb-2">
          <h4 className="text-[10px] font-mono text-editor-magenta uppercase tracking-[0.2em] font-bold">Forge: Identities</h4>
          <span className="text-[8px] font-mono text-editor-text-muted/40 uppercase tracking-widest">{characters.length} Count</span>
        </div>
        {characters.length > 0 ? (
          <div className="space-y-2">
            {characters.map(char => (
              <div 
                key={char.id} 
                className="group flex flex-col p-4 bg-white/[0.02] border border-editor-border hover:border-editor-magenta transition-all cursor-pointer rounded-sm"
                onClick={() => onInsertReference('character', char.id)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-serif font-bold text-editor-text group-hover:text-white transition-colors">{char.name}</span>
                  <div className="w-1 h-1 rounded-full bg-editor-magenta shadow-magenta-glow opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-[8px] font-mono text-editor-text-muted uppercase tracking-widest italic group-hover:text-editor-magenta/60 transition-colors">
                  {char.role}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[10px] font-mono text-editor-text-muted text-center py-8 uppercase tracking-widest italic opacity-40">No identities forged</p>
        )}
      </div>
      
      {/* Scenes */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-editor-border pb-2">
          <h4 className="text-[10px] font-mono text-editor-magenta uppercase tracking-[0.2em] font-bold">Chronicle: Events</h4>
          <span className="text-[8px] font-mono text-editor-text-muted/40 uppercase tracking-widest">{scenes.length} Count</span>
        </div>
        {scenes.length > 0 ? (
          <div className="space-y-2">
            {scenes.map((scene, i) => (
              <div 
                key={scene.id} 
                className="group flex items-center space-x-4 p-4 bg-white/[0.02] border border-editor-border hover:border-editor-magenta transition-all cursor-pointer rounded-sm"
                onClick={() => onInsertReference('scene', scene.id)}
              >
                <span className="text-xs font-mono font-bold text-editor-magenta/40 group-hover:text-editor-magenta transition-colors">
                  {(i + 1).toString().padStart(2, '0')}
                </span>
                <span className="text-sm font-serif font-bold text-editor-text group-hover:text-white transition-colors truncate">{scene.title}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[10px] font-mono text-editor-text-muted text-center py-8 uppercase tracking-widest italic opacity-40">No chronicle events</p>
        )}
      </div>
    </div>
    </div>
  );
};