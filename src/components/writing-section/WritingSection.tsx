import React, { useState, useEffect, useCallback } from 'react';
import { WritingEditor } from './WritingEditor';
import { ReferencePanel } from './ReferencePanel';
import { EditorToolbar } from './EditorToolbar';
import type { WritingSession } from '../../types/story.types';

interface WritingSectionProps {
  writingSession: WritingSession | null;
  characters: any[]; // Character type
  scenes: any[]; // Scene type
  onWritingUpdate: (content: string) => Promise<void>;
}

export const WritingSection: React.FC<WritingSectionProps> = ({ 
  writingSession, 
  characters, 
  scenes, 
  onWritingUpdate 
}) => {
  const [content, setContent] = useState(writingSession?.content || '');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(writingSession?.updated_at ? new Date(writingSession.updated_at) : null);
  const [referencePanelOpen, setReferencePanelOpen] = useState(false);

  // Sync initial content
  useEffect(() => {
    if (writingSession?.content && !content) {
      setContent(writingSession.content);
    }
  }, [writingSession?.id]);

  // Autosave
  useEffect(() => {
    if (!writingSession || content === writingSession.content) return;
    
    const handleSave = () => {
      setIsSaving(true);
      onWritingUpdate(content)
        .then(() => {
          setIsSaving(false);
          setLastSaved(new Date());
        })
        .catch(() => setIsSaving(false));
    };

    const timeoutId = setTimeout(handleSave, 3000);
    return () => clearTimeout(timeoutId);
  }, [content, writingSession?.id, writingSession?.content, onWritingUpdate]);

  const insertReference = useCallback((type: 'character' | 'scene', id: string) => {
    const reference = type === 'character' 
      ? characters.find(c => c.id === id)?.name
      : scenes.find(s => s.id === id)?.title;
    
    if (reference) {
      const refText = `[${type.toUpperCase()}: ${reference}]`;
      setContent(prev => prev + refText);
    }
  }, [characters, scenes]);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Premium Workspace Header */}
      <div className="flex items-center justify-between px-12 py-6 border-b border-editor-border bg-surface/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="flex items-center space-x-8">
          <div>
            <h2 className="text-xl font-serif font-bold text-white tracking-tight flex items-center">
              Manuscript Mode
            </h2>
            <p className="text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.2em] mt-1 italic">Active Draft Session</p>
          </div>
          <div className="h-8 w-px bg-editor-border"></div>
          <div className="flex items-center space-x-6 text-[10px] font-mono text-editor-text-muted uppercase tracking-widest">
             <div className="flex items-center space-x-2">
               <span className="w-1.5 h-1.5 rounded-full bg-editor-magenta shadow-magenta-glow"></span>
               <span>{content.trim().split(/\s+/).filter(Boolean).length} words</span>
             </div>
             {lastSaved && (
               <span className="opacity-60 italic">Sync: {lastSaved.toLocaleTimeString()}</span>
             )}
          </div>
        </div>

        <EditorToolbar 
          onSave={() => onWritingUpdate(content).then(() => setLastSaved(new Date()))}
          onExport={(format) => alert(`Exporting as ${format}...`)}
          onInsertReference={insertReference}
          characters={characters}
          scenes={scenes}
          isSaving={isSaving}
        />
      </div>
      
      <div className="flex-1 relative overflow-hidden flex">
        {/* Centered Focus Editor */}
        <div className={`flex-1 overflow-y-auto custom-scrollbar transition-all duration-500 ${referencePanelOpen ? 'pr-[400px]' : ''}`}>
          <div className="max-w-4xl mx-auto px-12 py-24 min-h-full flex flex-col">
            <div className="flex-1 card-tactile !bg-white/[0.01] border-none p-0 relative">
              <WritingEditor
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="The narrative unfolds here..."
                isSaving={isSaving}
              />
            </div>
            
            {/* Ambient Footer */}
            <div className="mt-24 pt-12 border-t border-editor-border text-center">
              <p className="text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.3em] opacity-40 italic">
                End of Manuscript Draft • Plot Studio Archive
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Reference Sidebar */}
        <div className={`absolute right-0 top-0 bottom-0 w-[400px] bg-surface border-l border-editor-border transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) transform ${referencePanelOpen ? 'translate-x-0' : 'translate-x-full'} shadow-2xl z-20`}>
          <div className="p-8 h-full flex flex-col">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h3 className="text-xl font-serif font-bold text-white tracking-tight">Story Compass</h3>
                <p className="text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.2em] mt-1 italic">World & Character Ref</p>
              </div>
              <button 
                onClick={() => setReferencePanelOpen(false)}
                className="text-editor-text-muted hover:text-white transition-all p-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
              <ReferencePanel 
                characters={characters}
                scenes={scenes}
                onInsertReference={insertReference}
                isOpen={true}
                onToggle={() => {}}
              />
            </div>
          </div>
        </div>

        {/* Floating Toggle for Compass */}
        {!referencePanelOpen && (
          <button
            onClick={() => setReferencePanelOpen(true)}
            className="absolute right-12 bottom-12 w-14 h-14 bg-magenta-gradient hover:shadow-magenta-glow text-white shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 group z-40 rounded-sm"
            title="Open Story Compass"
          >
            <svg className="w-7 h-7 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};