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
    <div className="h-full flex flex-col bg-[#0a000f]">
      {/* Premium Workspace Header */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-purple-900/20 bg-[#120016]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center space-x-6">
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 animate-pulse"></span>
            Manuscript Mode
          </h2>
          <div className="h-4 w-px bg-purple-900/40"></div>
          <div className="flex items-center space-x-4 text-xs font-medium text-gray-500">
             <span className="bg-purple-900/30 px-3 py-1 rounded-full border border-purple-500/10 text-purple-400">
               {content.trim().split(/\s+/).filter(Boolean).length} words
             </span>
             {lastSaved && (
               <span className="italic opacity-60">Last sync: {lastSaved.toLocaleTimeString()}</span>
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
        <div className={`flex-1 overflow-y-auto custom-scrollbar transition-all duration-500 ${referencePanelOpen ? 'pr-[300px]' : ''}`}>
          <div className="max-w-3xl mx-auto px-8 py-20 min-h-full flex flex-col">
            <div className="flex-1 bg-[#1a001f]/40 backdrop-blur-sm rounded-3xl border border-purple-900/10 shadow-[0_0_100px_rgba(138,0,194,0.05)] p-12 relative">
              <WritingEditor
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="The story begins here..."
                isSaving={isSaving}
              />
            </div>
            
            {/* Ambient Footer */}
            <div className="mt-12 text-center text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em] opacity-40">
              End of Draft • Plot Creative Suite
            </div>
          </div>
        </div>

        {/* Dynamic Reference Sidebar */}
        <div className={`absolute right-0 top-0 bottom-0 w-[300px] bg-[#120016] border-l border-purple-900/30 transition-all duration-500 transform ${referencePanelOpen ? 'translate-x-0' : 'translate-x-full'} shadow-2xl z-20`}>
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-black text-white uppercase tracking-widest">Story Compass</h3>
              <button 
                onClick={() => setReferencePanelOpen(false)}
                className="text-gray-500 hover:text-white"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
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
            className="absolute right-8 bottom-8 w-12 h-12 bg-purple-600 hover:bg-purple-500 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group z-40"
          >
            <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};