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
  const [pagesPanelOpen, setPagesPanelOpen] = useState(false);

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

  const executeCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
  };

  const FormatButton = ({ 
    icon, 
    command, 
    value, 
    className = "" 
  }: { 
    icon: React.ReactNode, 
    command?: string, 
    value?: string, 
    className?: string 
  }) => (
    <button 
      onMouseDown={(e) => {
        e.preventDefault();
        if (command) executeCommand(command, value);
      }}
      className={`p-1.5 text-editor-text-muted hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center ${className}`}
    >
      {icon}
    </button>
  );

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Premium Workspace Header */}
      <div className="flex items-center justify-between px-12 py-4 border-b border-white/5 bg-surface backdrop-blur-2xl sticky top-0 z-30 shadow-glass">
        <div className="flex items-center space-x-6">
          <div>
            <h2 className="text-xl font-sans font-bold text-white tracking-tight flex items-center">
              Manuscript Mode
            </h2>
            <div className="flex items-center space-x-3 mt-1">
              <span className="w-2 h-2 rounded-full bg-primary shadow-magenta-glow"></span>
              <p className="text-xs font-sans font-medium text-editor-text-muted">{content.trim().replace(/<[^>]*>?/gm, '').split(/\s+/).filter(Boolean).length} words</p>
              {lastSaved && (
                <>
                  <span className="text-editor-text-muted opacity-50">•</span>
                  <span className="text-xs font-sans text-editor-text-muted opacity-60">Sync: {lastSaved.toLocaleTimeString()}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <EditorToolbar 
            onSave={() => onWritingUpdate(content).then(() => setLastSaved(new Date()))}
            onExport={(format) => alert(`Exporting as ${format}...`)}
            onInsertReference={insertReference}
            characters={characters}
            scenes={scenes}
            isSaving={isSaving}
          />
        </div>
      </div>

      {/* Formatting Toolbar */}
      <div className="flex items-center justify-between px-6 py-2 border-b border-white/5 bg-surface-light backdrop-blur-xl sticky top-[73px] z-20 select-none">
        
        {/* Left Corner: Story Compass Toggle */}
        <div className="flex items-center min-w-[40px]">
          <button
            onClick={() => { 
              setReferencePanelOpen(!referencePanelOpen); 
            }}
            className={`p-2 rounded-lg transition-all ${referencePanelOpen ? 'text-primary bg-primary/10 shadow-magenta-glow' : 'text-editor-text-muted hover:text-white hover:bg-white/10'}`}
            title={referencePanelOpen ? "Close Story Compass" : "Open Story Compass"}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </button>
        </div>

        {/* Centered Tools */}
        <div className="flex items-center justify-center space-x-2 overflow-x-auto custom-scrollbar">
          {/* Search Pill */}
          <div className="pr-3 border-r border-white/10">
            <button 
              onClick={() => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'f', ctrlKey: true, metaKey: true }));
                alert('Press Ctrl+F or Cmd+F to find words in the script.');
              }}
              className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 px-4 py-1.5 rounded-full transition-colors text-sm font-sans text-editor-text"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <span>Find</span>
            </button>
          </div>

          {/* Text Styles */}
          <div className="flex items-center space-x-2 px-3 border-r border-white/10">
            <button onMouseDown={(e) => { e.preventDefault(); executeCommand('formatBlock', 'P'); }} className="flex items-center space-x-2 px-2 py-1.5 text-editor-text hover:bg-white/5 rounded-lg transition-colors text-sm font-sans">
              <span>Normal text</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className="w-px h-4 bg-white/10"></div>
            <button onMouseDown={(e) => { e.preventDefault(); executeCommand('fontName', 'Plus Jakarta Sans'); }} className="flex items-center space-x-2 px-2 py-1.5 text-editor-text hover:bg-white/5 rounded-lg transition-colors text-sm font-sans">
              <span>Plus Jakarta</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>

          {/* Font Size */}
          <div className="flex items-center px-3 border-r border-white/10">
            <FormatButton command="fontSize" value="3" icon={<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>} />
            <input type="text" value="14" readOnly className="w-8 text-center bg-transparent border border-white/10 rounded mx-1 text-sm text-editor-text focus:outline-none focus:border-primary" />
            <FormatButton command="fontSize" value="5" icon={<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>} />
          </div>

          {/* Formatting */}
          <div className="flex items-center space-x-1 px-3 border-r border-white/10">
            <FormatButton command="bold" className="font-serif font-bold w-7 h-7" icon={<span>B</span>} />
            <FormatButton command="italic" className="font-serif italic w-7 h-7" icon={<span>I</span>} />
            <FormatButton command="underline" className="font-serif underline w-7 h-7" icon={<span>U</span>} />
            <FormatButton command="foreColor" value="#FF3366" className="font-serif font-bold w-7 h-7 border-b-2 border-primary" icon={<span>A</span>} />
            <FormatButton command="hiliteColor" value="rgba(255, 51, 102, 0.2)" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>} />
          </div>

          {/* Alignments */}
          <div className="flex items-center space-x-1 px-3 border-r border-white/10">
            <FormatButton command="justifyLeft" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h10M4 18h16" /></svg>} />
            <FormatButton command="justifyCenter" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>} />
          </div>

          {/* Undo/Redo/Zoom */}
          <div className="flex items-center space-x-1 px-3">
            <FormatButton command="undo" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>} />
            <FormatButton command="redo" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" /></svg>} />
            <button className="flex items-center space-x-1 px-2 text-editor-text-muted text-sm font-sans hover:text-white ml-2"><span>100%</span><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg></button>
          </div>
        </div>

        {/* Right Corner: Pages Toggle */}
        <div className="flex items-center min-w-[40px] justify-end">
          <button
            onClick={() => { 
              setPagesPanelOpen(!pagesPanelOpen); 
            }}
            className={`p-2 rounded-lg transition-all ${pagesPanelOpen ? 'text-primary bg-primary/10 shadow-magenta-glow' : 'text-editor-text-muted hover:text-white hover:bg-white/10'}`}
            title={pagesPanelOpen ? "Close Pages Outline" : "Open Pages Outline"}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </button>
        </div>
      </div>
      
      <div className="flex-1 relative overflow-hidden flex">
        {/* Centered Focus Editor */}
        <div className={`flex-1 overflow-y-auto custom-scrollbar transition-all duration-500 ${pagesPanelOpen ? 'pr-[300px]' : ''} ${referencePanelOpen ? 'pl-[400px]' : ''}`}>
          <div className="max-w-4xl mx-auto px-12 py-16 min-h-full flex flex-col">
            <div className="flex-1 bg-surface-dark backdrop-blur-md border border-white/10 p-12 shadow-glass rounded-card relative transition-all">
              <WritingEditor
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="The narrative unfolds here..."
                isSaving={isSaving}
              />
            </div>
            
            {/* Ambient Footer */}
            <div className="mt-16 pt-8 border-t border-white/5 text-center">
              <p className="text-sm font-sans font-medium text-editor-text-muted opacity-60">
                End of Manuscript Draft • Plot Studio Archive
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Pages Sidebar */}
        <div className={`absolute right-0 top-0 bottom-0 w-[300px] bg-[#2d2d2d] border-l border-white/5 transition-all duration-500 transform ${pagesPanelOpen ? 'translate-x-0' : 'translate-x-full'} shadow-2xl z-20 flex flex-col`}>
          {/* Sidebar Header */}
          <div className="flex items-center p-4 border-b border-white/5 text-white">
            <button 
              onClick={() => setPagesPanelOpen(false)}
              className="p-2 hover:bg-white/10 rounded-md transition-colors mr-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <span className="font-sans font-medium">(anonymous)</span>
          </div>

          {/* Thumbnails Container */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 flex flex-col items-center">
            {/* Page 1 Thumbnail (Active) */}
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-[180px] h-[240px] bg-white border-4 border-[#7ea6f4] shadow-lg flex flex-col p-4 transition-transform group-hover:scale-105">
                {/* Mock text lines to simulate document */}
                <div className="w-full h-1 bg-gray-300 mb-2 mt-4 rounded-full"></div>
                <div className="w-5/6 h-1 bg-gray-300 mb-2 rounded-full"></div>
                <div className="w-full h-1 bg-gray-200 mb-1.5 rounded-full mt-4"></div>
                <div className="w-full h-1 bg-gray-200 mb-1.5 rounded-full"></div>
                <div className="w-4/5 h-1 bg-gray-200 mb-1.5 rounded-full"></div>
                <div className="w-full h-1 bg-gray-200 mb-1.5 rounded-full mt-2"></div>
                <div className="w-3/4 h-1 bg-gray-200 mb-1.5 rounded-full"></div>
              </div>
              <span className="mt-3 text-white font-sans font-medium text-sm">1</span>
            </div>

            {/* Page 2 Thumbnail */}
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-[180px] h-[240px] bg-white border border-gray-300 shadow-sm flex flex-col p-4 transition-transform group-hover:scale-105 opacity-90 group-hover:opacity-100">
                {/* Mock text lines to simulate document */}
                <div className="w-1/2 h-1 bg-gray-300 mb-2 mt-2 rounded-full"></div>
                <div className="w-full h-1 bg-gray-200 mb-1.5 rounded-full mt-4"></div>
                <div className="w-full h-1 bg-gray-200 mb-1.5 rounded-full"></div>
                <div className="w-5/6 h-1 bg-gray-200 mb-1.5 rounded-full"></div>
                <div className="w-full h-1 bg-gray-200 mb-1.5 rounded-full mt-2"></div>
                <div className="w-full h-1 bg-gray-200 mb-1.5 rounded-full"></div>
                <div className="w-4/5 h-1 bg-gray-200 mb-1.5 rounded-full"></div>
              </div>
              <span className="mt-3 text-white font-sans font-medium text-sm">2</span>
            </div>
            
            {/* Page 3 Thumbnail */}
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-[180px] h-[240px] bg-white border border-gray-300 shadow-sm flex flex-col p-4 transition-transform group-hover:scale-105 opacity-90 group-hover:opacity-100">
                {/* Mock text lines to simulate document */}
                <div className="w-1/3 h-1 bg-gray-300 mb-2 mt-2 rounded-full"></div>
                <div className="w-full h-1 bg-gray-200 mb-1.5 rounded-full mt-4"></div>
                <div className="w-11/12 h-1 bg-gray-200 mb-1.5 rounded-full"></div>
                <div className="w-4/5 h-1 bg-gray-200 mb-1.5 rounded-full"></div>
              </div>
              <span className="mt-3 text-white font-sans font-medium text-sm">3</span>
            </div>
          </div>
        </div>

        {/* Dynamic Reference Sidebar (Compass) - Now on Left */}
        <div className={`absolute left-0 top-0 bottom-0 w-[400px] bg-surface-dark/95 backdrop-blur-2xl border-r border-white/5 transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) transform ${referencePanelOpen ? 'translate-x-0' : '-translate-x-full'} shadow-[20px_0_50px_rgba(0,0,0,0.5)] z-20`}>
          <div className="p-8 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="relative">
                <h3 className="text-2xl font-serif font-bold text-white tracking-tight">Story Compass</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-magenta-glow"></span>
                  <p className="text-[10px] font-mono text-primary uppercase tracking-[0.3em] font-bold">World & Character Ref</p>
                </div>
              </div>
              <button 
                onClick={() => setReferencePanelOpen(false)}
                className="text-editor-text-muted hover:text-white hover:bg-white/5 transition-all p-2 rounded-full"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-inner mb-6 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/50"></div>
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-sm font-sans font-bold text-white/90 uppercase tracking-widest flex items-center">
                    <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
                    References
                  </h4>
                </div>
                
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
        </div>




      </div>
    </div>
  );
};