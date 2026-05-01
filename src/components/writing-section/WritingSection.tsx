import React, { useState, useEffect, useCallback } from 'react';
import { WritingEditor } from './WritingEditor';
import { ReferencePanel } from './ReferencePanel';
import { EditorToolbar } from './EditorToolbar';
import type { WritingSession } from '../../types/story.types';

interface WritingSectionProps {
  writingSession: WritingSession | null;
  characters: any[]; // Character type
  scenes: any[]; // Scene type
  onWritingUpdate: (content: string) => void;
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

  // Autosave with debounce
  useEffect(() => {
    if (!writingSession) return;
    
    const handleSave = () => {
      setIsSaving(true);
      onWritingUpdate(content)
        .then(() => {
          setIsSaving(false);
          setLastSaved(new Date());
        })
        .catch(err => {
          setIsSaving(false);
          console.error('Failed to save writing:', err);
        });
    };

    const timeoutId = setTimeout(handleSave, 2000); // 2 second debounce
    
    return () => clearTimeout(timeoutId);
  }, [content, writingSession?.id, onWritingUpdate]);

  const insertReference = useCallback((type: 'character' | 'scene', id: string) => {
    const reference = type === 'character' 
      ? characters.find(c => c.id === id)?.name
      : scenes.find(s => s.id === id)?.title;
    
    if (reference) {
      const refText = `[${type}:${reference}]`;
      setContent(prev => prev + refText);
    }
  }, [characters, scenes]);

  return (
    <div className="flex h-full">
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        <EditorToolbar 
          onSave={() => {
            setIsSaving(true);
            onWritingUpdate(content)
              .then(() => {
                setIsSaving(false);
                setLastSaved(new Date());
              })
              .catch(err => {
                setIsSaving(false);
                console.error('Failed to save writing:', err);
              });
          }}
          onExport={() => alert('Export functionality coming soon')}
          onInsertReference={insertReference}
          characters={characters}
          scenes={scenes}
          isSaving={isSaving}
        />
        
        <div className="flex-1 overflow-hidden">
          <div className="flex h-full">
            {/* Editor */}
            <div className="flex-1">
              <WritingEditor
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Begin writing your story..."
                isSaving={isSaving}
              />
            </div>
            
            {/* Reference Panel */}
            <div className="w-64 bg-[#1a001f] border-l border-purple-900/30 flex flex-col">
              <ReferencePanel 
                characters={characters}
                scenes={scenes}
                onInsertReference={insertReference}
                isOpen={referencePanelOpen}
                onToggle={() => setReferencePanelOpen(!referencePanelOpen)}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#1a001f] border-t border-purple-900/30 text-sm">
        <div className="flex items-center space-x-3">
          <span className="text-purple-400">
            {/* Word count would go here */}
            {content.trim().split(/\s+/).filter(Boolean).length} words
          </span>
          {isSaving && (
            <span className="text-purple-300 animate-pulse">Saving...</span>
          )}
          {!isSaving && lastSaved && (
            <span className="text-purple-400">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>
        <button
          onClick={() => setReferencePanelOpen(!referencePanelOpen)}
          className="text-purple-400 hover:text-purple-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h2m8-9V9m8 0h-8m8 8H9a2 2 0 01-2-2V5a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2h-2m-2 8H7a2 2 0 01-2-2v-2a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2h-2z" />
          </svg>
        </button>
      </div>
    </div>
  );
};