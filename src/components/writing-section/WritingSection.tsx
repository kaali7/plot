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
  const [contentChunks, setContentChunks] = useState<string[]>(writingSession?.content ? [writingSession.content] : ['']);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(writingSession?.updated_at ? new Date(writingSession.updated_at) : null);
  const [referencePanelOpen, setReferencePanelOpen] = useState(false);
  const [pagesPanelOpen, setPagesPanelOpen] = useState(true);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const PAGE_LIMIT_HEIGHT = 1050;

  // Sync initial content
  useEffect(() => {
    if (writingSession?.content && contentChunks.length <= 1 && contentChunks[0] === '') {
      setContentChunks([writingSession.content]);
    }
  }, [writingSession?.id]);

  // Autosave
  useEffect(() => {
    const fullContent = contentChunks.join('');
    if (!writingSession || fullContent === writingSession.content) return;
    
    const handleSave = () => {
      setIsSaving(true);
      onWritingUpdate(fullContent)
        .then(() => {
          setIsSaving(false);
          setLastSaved(new Date());
        })
        .catch(() => setIsSaving(false));
    };

    const timeoutId = setTimeout(handleSave, 3000);
    return () => clearTimeout(timeoutId);
  }, [contentChunks, writingSession?.id, writingSession?.content, onWritingUpdate]);

  const handlePageChange = (index: number, newPageContent: string) => {
    const newChunks = [...contentChunks];
    newChunks[index] = newPageContent;

    // Check for overflow (simplified)
    const editorElement = document.getElementById(`editor-page-${index}`);
    if (editorElement && editorElement.scrollHeight > PAGE_LIMIT_HEIGHT) {
      if (index === contentChunks.length - 1) {
        newChunks.push('');
      }
    }
    setContentChunks(newChunks);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    const target = e.target as HTMLElement;
    
    // Backspace at the start of a page
    if (e.key === 'Backspace' && target.innerText === '' && index > 0) {
      e.preventDefault();
      const newChunks = [...contentChunks];
      newChunks.splice(index, 1);
      setContentChunks(newChunks);
      
      setTimeout(() => {
        const prevEditor = document.getElementById(`editor-page-${index - 1}`)?.querySelector('[contenteditable]');
        if (prevEditor) {
          (prevEditor as HTMLElement).focus();
          const range = document.createRange();
          const sel = window.getSelection();
          range.selectNodeContents(prevEditor);
          range.collapse(false);
          sel?.removeAllRanges();
          sel?.addRange(range);
        }
      }, 0);
    }
  };

  const insertReference = useCallback((type: 'character' | 'scene', id: string) => {
    const reference = type === 'character' 
      ? characters.find(c => c.id === id)?.name
      : scenes.find(s => s.id === id)?.title;
    
    if (reference) {
      const refText = `[${type.toUpperCase()}: ${reference}]`;
      const newChunks = [...contentChunks];
      newChunks[currentPageIndex] += refText;
      setContentChunks(newChunks);
    }
  }, [characters, scenes, contentChunks, currentPageIndex]);

  const [selectionState, setSelectionState] = useState({
    bold: false,
    italic: false,
    underline: false,
    alignLeft: true,
    alignCenter: false,
    alignRight: false,
    alignJustify: false
  });

  const updateSelectionState = useCallback(() => {
    setSelectionState({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      alignLeft: document.queryCommandState('justifyLeft'),
      alignCenter: document.queryCommandState('justifyCenter'),
      alignRight: document.queryCommandState('justifyRight'),
      alignJustify: document.queryCommandState('justifyFull'),
    });
  }, []);

  useEffect(() => {
    const handleSelectionChange = () => updateSelectionState();
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [updateSelectionState]);

  const [isStyleMenuOpen, setIsStyleMenuOpen] = useState(false);
  const [findPanelOpen, setFindPanelOpen] = useState(false);
  const [findQuery, setFindQuery] = useState('');

  const executeCommand = (command: string, value: string | undefined = undefined) => {
    const activeEditor = document.activeElement;
    if (activeEditor?.getAttribute('contenteditable') === 'true') {
      if (command === 'fontSize') {
        // High-fidelity Font Scaling Hack
        document.execCommand('styleWithCSS', false, 'false');
        document.execCommand('fontSize', false, '7');
        const fontElements = document.getElementsByTagName('font');
        for (let i = 0; i < fontElements.length; i++) {
          if (fontElements[i].size === '7') {
            fontElements[i].removeAttribute('size');
            fontElements[i].style.fontSize = `${value}px`;
            fontElements[i].style.lineHeight = '1.2';
          }
        }
      } else {
        document.execCommand(command, false, value);
      }
      updateSelectionState();
    }
  };

  const [fontSize, setFontSize] = useState(14);
  const adjustFontSize = (delta: number) => {
    const newSize = Math.max(8, Math.min(72, fontSize + delta));
    setFontSize(newSize);
    executeCommand('fontSize', newSize.toString()); 
  };

  const applyStyle = (tag: string) => {
    executeCommand('formatBlock', tag);
    setIsStyleMenuOpen(false);
  };

  const scrollToPage = (index: number) => {
    setCurrentPageIndex(index);
    const element = document.getElementById(`folio-container-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const FormatButton = ({ 
    icon, 
    command, 
    value, 
    active = false,
    className = "" 
  }: { 
    icon: React.ReactNode, 
    command?: string, 
    value?: string, 
    active?: boolean,
    className?: string 
  }) => (
    <button 
      onMouseDown={(e) => {
        e.preventDefault();
        if (command) executeCommand(command, value);
      }}
      className={`p-1.5 rounded-lg transition-all flex items-center justify-center ${className} 
        ${active ? 'text-primary bg-primary/10 shadow-magenta-glow ring-1 ring-primary/30' : 'text-editor-text-muted hover:text-white hover:bg-white/5'}`}
    >
      {icon}
    </button>
  );

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      {/* Premium Workspace Header */}
      <div className="flex items-center justify-between px-12 py-4 border-b border-white/5 bg-surface backdrop-blur-2xl sticky top-0 z-30 shadow-glass">
        <div className="flex items-center space-x-6">
          <div>
            <h2 className="text-xl font-sans font-bold text-white tracking-tight flex items-center">
              Manuscript Mode
            </h2>
            <div className="flex items-center space-x-3 mt-1">
              <span className="w-2 h-2 rounded-full bg-primary shadow-magenta-glow"></span>
              <p className="text-xs font-sans font-medium text-editor-text-muted">{contentChunks.join('').trim().split(/\s+/).filter(Boolean).length} words</p>
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
            onSave={() => onWritingUpdate(contentChunks.join('')).then(() => setLastSaved(new Date()))}
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
        <div className="flex items-center min-w-[40px]">
          <button onClick={() => setReferencePanelOpen(!referencePanelOpen)} className={`p-2 rounded-lg transition-all ${referencePanelOpen ? 'text-primary bg-primary/10 shadow-magenta-glow' : 'text-editor-text-muted hover:text-white hover:bg-white/10'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </button>
        </div>

        <div className="flex items-center justify-center space-x-2">
          {/* Find Interface */}
          <div className="flex items-center border-r border-white/10 pr-4 mr-2">
            {!findPanelOpen ? (
              <button 
                onClick={() => setFindPanelOpen(true)}
                className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 px-4 py-1.5 rounded-full transition-colors text-sm font-sans text-editor-text"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <span>Find</span>
              </button>
            ) : (
              <div className="flex items-center bg-white/5 rounded-full px-4 py-1 border border-primary/30 shadow-magenta-glow/20">
                <input 
                  autoFocus
                  type="text" 
                  value={findQuery}
                  onChange={(e) => setFindQuery(e.target.value)}
                  placeholder="Find in manuscript..."
                  className="bg-transparent border-none outline-none text-xs text-white w-40 font-mono"
                  onKeyDown={(e) => e.key === 'Escape' && setFindPanelOpen(false)}
                />
                <button onClick={() => setFindPanelOpen(false)} className="ml-2 text-editor-text-muted hover:text-white">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            )}
          </div>

          {/* Styles Dropdown */}
          <div className="relative px-3 border-r border-white/10">
            <button 
              onMouseDown={(e) => { e.preventDefault(); setIsStyleMenuOpen(!isStyleMenuOpen); }}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all text-sm font-sans group
                ${isStyleMenuOpen ? 'bg-primary/10 text-white' : 'text-editor-text hover:bg-white/5'}`}
            >
              <span className="font-bold tracking-tight">Normal text</span>
              <svg className={`w-3 h-3 transition-transform duration-300 ${isStyleMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>

            {isStyleMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsStyleMenuOpen(false)} />
                <div className="absolute top-full left-0 mt-3 w-64 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50 py-3 animate-in fade-in slide-in-from-top-2 duration-300 backdrop-blur-3xl">
                  <div className="px-4 py-2 mb-2 border-b border-white/5">
                    <span className="text-[9px] font-mono text-editor-text-muted uppercase tracking-[0.3em] opacity-40">Paragraph Styles</span>
                  </div>
                  <button onClick={() => applyStyle('H1')} className="w-full text-left px-4 py-3 hover:bg-primary/10 hover:border-l-2 hover:border-primary transition-all group">
                    <span className="block text-2xl font-serif font-bold text-white mb-0.5">Title</span>
                    <span className="text-[9px] font-mono text-editor-text-muted uppercase tracking-widest opacity-40 group-hover:opacity-100">Heading 1</span>
                  </button>
                  <button onClick={() => applyStyle('H2')} className="w-full text-left px-4 py-3 hover:bg-primary/10 hover:border-l-2 hover:border-primary transition-all group">
                    <span className="block text-xl font-serif font-bold text-white mb-0.5">Subtitle</span>
                    <span className="text-[9px] font-mono text-editor-text-muted uppercase tracking-widest opacity-40 group-hover:opacity-100">Heading 2</span>
                  </button>
                  <button onClick={() => applyStyle('P')} className="w-full text-left px-4 py-3 hover:bg-primary/10 hover:border-l-2 hover:border-primary transition-all group border-t border-white/5">
                    <span className="block text-sm font-sans text-white mb-0.5 font-bold">Normal text</span>
                    <span className="text-[9px] font-mono text-editor-text-muted uppercase tracking-widest opacity-40 group-hover:opacity-100">Body Paragraph</span>
                  </button>
                  <button onClick={() => applyStyle('BLOCKQUOTE')} className="w-full text-left px-4 py-3 hover:bg-primary/10 hover:border-l-2 hover:border-primary transition-all group border-t border-white/5">
                    <span className="block text-base font-serif italic text-editor-magenta mb-0.5">Captive Narrative</span>
                    <span className="text-[9px] font-mono text-editor-text-muted uppercase tracking-widest opacity-40 group-hover:opacity-100">Blockquote</span>
                  </button>
                </div>
              </>
            )}
          </div>


          <div className="flex items-center space-x-1 px-3 border-r border-white/10">
            <FormatButton command="bold" active={selectionState.bold} className="font-serif font-bold w-8 h-8" icon={<span>B</span>} />
            <FormatButton command="italic" active={selectionState.italic} className="font-serif italic w-8 h-8" icon={<span>I</span>} />
            <FormatButton command="underline" active={selectionState.underline} className="font-serif underline w-8 h-8" icon={<span>U</span>} />
          </div>

          <div className="flex items-center space-x-1 px-3 border-r border-white/10">
            <FormatButton command="justifyLeft" active={selectionState.alignLeft} icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h10M4 18h16" /></svg>} />
            <FormatButton command="justifyCenter" active={selectionState.alignCenter} icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>} />
            <FormatButton command="justifyRight" active={selectionState.alignRight} icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M10 12h10M4 18h16" /></svg>} />
            <FormatButton command="justifyFull" active={selectionState.alignJustify} icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>} />
          </div>
        </div>

        <div className="flex items-center min-w-[40px] justify-end">
          <button onClick={() => setPagesPanelOpen(!pagesPanelOpen)} className={`p-2 rounded-lg transition-all ${pagesPanelOpen ? 'text-primary bg-primary/10 shadow-magenta-glow' : 'text-editor-text-muted hover:text-white hover:bg-white/10'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </button>
        </div>
      </div>
      
      <div className="flex-1 relative overflow-hidden flex">
        {/* Divided Folio Layout - GOOGLE DOCS STYLE */}
        <div id="manuscript-scroll-container" className={`flex-1 overflow-y-auto custom-scrollbar transition-all duration-500 bg-background ${pagesPanelOpen ? 'pr-[300px]' : ''} ${referencePanelOpen ? 'pl-[400px]' : ''}`}>
          <div className="max-w-5xl mx-auto px-12 py-16 flex flex-col items-center space-y-16">
            
            {contentChunks.map((chunk, index) => (
              <div 
                key={index}
                id={`folio-container-${index}`}
                className={`w-full max-w-[850px] min-h-[1100px] bg-surface-dark backdrop-blur-md border border-white/10 p-20 shadow-2xl rounded-sm relative transition-all duration-500 ${currentPageIndex === index ? 'ring-2 ring-primary/30 ring-offset-8 ring-offset-background' : 'opacity-80'}`}
                onClick={() => setCurrentPageIndex(index)}
              >
                <div id={`editor-page-${index}`} className="relative h-full">
                  <WritingEditor
                    value={chunk}
                    onChange={(e) => handlePageChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e as any)}
                    placeholder={index === 0 ? "The narrative unfolds here..." : ""}
                    isSaving={isSaving}
                  />
                </div>
              </div>
            ))}

            <button 
              onClick={() => setContentChunks([...contentChunks, ''])}
              className="w-full max-w-[850px] py-12 border border-dashed border-white/10 rounded-sm flex flex-col items-center justify-center group hover:border-white/30 transition-all opacity-40 hover:opacity-100"
            >
              <span className="text-2xl text-white/30 group-hover:text-white/60 mb-2">+</span>
              <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em] font-bold">Forge New Folio</span>
            </button>
          </div>
        </div>

        {/* Dynamic Pages Sidebar (Right) */}
        <div className={`absolute right-0 top-0 bottom-0 w-[300px] bg-surface-dark/90 backdrop-blur-2xl border-l border-white/5 transition-all duration-500 transform ${pagesPanelOpen ? 'translate-x-0' : 'translate-x-full'} shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-20 flex flex-col`}>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 flex flex-col items-center">
            {contentChunks.map((_, index) => (
              <div key={index} onClick={() => scrollToPage(index)} className="flex flex-col items-center group cursor-pointer">
                <div className={`w-[160px] h-[220px] bg-white/[0.02] transition-all duration-300 rounded-sm flex flex-col p-4 relative overflow-hidden backdrop-blur-sm border
                  ${currentPageIndex === index ? 'border-primary shadow-[0_0_20px_rgba(255,0,85,0.2)] scale-105 bg-white/[0.05]' : 'border-white/10 opacity-60 group-hover:opacity-100 group-hover:border-white/30 group-hover:scale-105'}`}>
                  <div className="w-full h-1 bg-white/10 mb-2 mt-2 rounded-full"></div>
                  <div className="w-5/6 h-1 bg-white/10 mb-2 rounded-full"></div>
                  <div className="w-full h-1 bg-white/5 mb-1.5 rounded-full mt-4"></div>
                </div>
                <span className={`mt-3 font-mono text-[10px] font-bold tracking-widest ${currentPageIndex === index ? 'text-primary' : 'text-editor-text-muted'}`}>{index + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Reference Sidebar (Compass) - Left */}
        <div className={`absolute left-0 top-0 bottom-0 w-[400px] bg-surface-dark/95 backdrop-blur-2xl border-r border-white/5 transition-all duration-700 transform ${referencePanelOpen ? 'translate-x-0' : '-translate-x-full'} shadow-[20px_0_50px_rgba(0,0,0,0.5)] z-20`}>
          <div className="p-8 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="relative"><h3 className="text-2xl font-sans font-bold text-white uppercase tracking-[0.05em]">Story Compass</h3></div>
              <button onClick={() => setReferencePanelOpen(false)} className="text-editor-text-muted hover:text-white p-2 rounded-full"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
              <ReferencePanel characters={characters} scenes={scenes} onInsertReference={insertReference} isOpen={true} onToggle={() => {}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};