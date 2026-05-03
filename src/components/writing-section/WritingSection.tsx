import React, { useState, useEffect, useCallback } from 'react';
import { escapeHtml } from '../../lib/sanitize';
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
  const [referencePanelOpen, setReferencePanelOpen] = useState(true);
  const [pagesPanelOpen, setPagesPanelOpen] = useState(true);
  const [detailsPanelOpen, setDetailsPanelOpen] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [examineEntity, setExamineEntity] = useState<{ type: 'character' | 'scene' | 'conflict' | 'resource', id: string } | null>(null);

  const PAGE_LIMIT_HEIGHT = 1050;

  // Auto-collapse sidebars on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setReferencePanelOpen(false);
        setPagesPanelOpen(false);
      } else {
        setReferencePanelOpen(true);
        setPagesPanelOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    const character = characters.find(c => c.id === id);
    const scene = scenes.find(s => s.id === id);
    
    let htmlToInsert = '';

    if (type === 'character' && character) {
      htmlToInsert = `<span class="text-editor-magenta font-bold">${escapeHtml(character.name)}</span>&nbsp;`;
    } else if (type === 'scene' && scene) {
      htmlToInsert = `
        <div class="my-6 p-6 bg-white/[0.02] border-l-4 border-primary rounded-r-xl font-sans">
          <div class="text-[10px] font-mono text-primary uppercase tracking-[0.2em] mb-2">Scene Forge</div>
          <h4 class="text-xl font-bold text-white mb-3">${escapeHtml(scene.title)}</h4>
          ${scene.goal ? `<div class="text-xs text-white/60 mb-2"><span class="text-white/40 uppercase mr-2">Goal:</span>${escapeHtml(scene.goal)}</div>` : ''}
          ${scene.events?.main ? `<div class="text-sm text-editor-text-muted italic leading-relaxed">"${escapeHtml(scene.events.main)}"</div>` : ''}
        </div>
        <p>&nbsp;</p>
      `;
    } else if (type === ('all_scenes' as any)) {
      htmlToInsert = `
        <div class="my-12 p-8 border border-white/10 rounded-2xl bg-white/[0.01]">
          <h3 className="text-2xl font-serif font-bold text-white mb-8 border-b border-white/5 pb-4">Manuscript Outline</h3>
          <div class="space-y-6">
            ${scenes.map((s, i) => `
              <div class="flex items-start space-x-6">
                <span class="text-[10px] font-mono text-primary pt-1">#${(i+1).toString().padStart(2, '0')}</span>
                <div>
                  <h4 class="text-white font-bold mb-1">${escapeHtml(s.title)}</h4>
                  ${s.goal ? `<p class="text-[10px] text-white/40 italic">${escapeHtml(s.goal)}</p>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        <p>&nbsp;</p>
      `;
    }
    
    if (htmlToInsert) {
      // Use execCommand for better integration with undo/redo and selection
      const editor = document.activeElement;
      if (editor?.getAttribute('contenteditable') === 'true') {
        document.execCommand('insertHTML', false, htmlToInsert);
      } else {
        // Fallback to manual chunk update if no focus
        const newChunks = [...contentChunks];
        newChunks[currentPageIndex] += htmlToInsert;
        setContentChunks(newChunks);
      }
    }
  }, [characters, scenes, contentChunks, currentPageIndex]);

  const examineReference = (type: 'character' | 'scene' | 'conflict' | 'resource', id: string) => {
    setExamineEntity({ type, id });
    setDetailsPanelOpen(true);
  };

  const [selectionState, setSelectionState] = useState({
    bold: false,
    italic: false,
    underline: false,
    alignLeft: true,
    alignCenter: false,
    alignRight: false,
    alignJustify: false,
    blockType: 'p'
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
      blockType: document.queryCommandValue('formatBlock') || 'p'
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


  const applyStyle = (tag: string) => {
    executeCommand('formatBlock', tag);
    setIsStyleMenuOpen(false);
    // Force immediate update
    setTimeout(updateSelectionState, 50);
  };

  const handleFind = (next = true) => {
    if (!findQuery) return;
    // window.find is a non-standard but widely supported way to search in contentEditable
    // (text, caseSensitive, backwards, wrapAround, wholeWord, searchInFrames, showDialog)
    const found = (window as any).find(findQuery, false, false, true, false, false, false);
    if (!found && next) {
      // If not found and we were going forward, try wrapping around manually if the browser didn't
      // This is a bit tricky with window.find, but usually it works with wrapAround=true
    }
  };

  const getBlockTypeName = (type: string) => {
    switch(type.toLowerCase()) {
      case 'h1': return 'Title';
      case 'h2': return 'Subtitle';
      case 'blockquote': return 'Quote';
      default: return 'Normal text';
    }
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
      <div className="flex items-center justify-between px-6 py-2 border-b border-white/5 bg-surface-light backdrop-blur-xl sticky top-[73px] z-20 select-none overflow-x-auto whitespace-nowrap scrollbar-hide">
        <div className="flex items-center min-w-[40px] flex-shrink-0">
          <button onClick={() => setReferencePanelOpen(!referencePanelOpen)} className={`p-2 rounded-lg transition-all ${referencePanelOpen ? 'text-primary bg-primary/10 shadow-magenta-glow' : 'text-editor-text-muted hover:text-white hover:bg-white/10'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </button>
        </div>

        <div className="flex items-center justify-center space-x-2 flex-shrink-0">
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
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setFindPanelOpen(false);
                    if (e.key === 'Enter') handleFind();
                  }}
                />
                <button onClick={() => handleFind()} className="ml-2 text-editor-magenta hover:text-white transition-colors">
                   <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>
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
              <span className="font-bold tracking-tight">{getBlockTypeName(selectionState.blockType)}</span>
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
      
      <div className="flex-1 relative overflow-hidden flex bg-[#050505]">
        {/* Dynamic Reference Sidebar (Compass) - Left */}
        <div className={`relative flex flex-col bg-[#080808] border-r border-white/5 transition-all duration-700 ease-in-out ${referencePanelOpen ? 'w-[260px]' : 'w-0 opacity-0'} overflow-hidden z-20`}>
          <div className="p-6 h-full flex flex-col min-w-[260px]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-base font-sans font-bold text-white uppercase tracking-[0.1em]">Story Compass</h3>
              <button onClick={() => setReferencePanelOpen(false)} className="text-white/20 hover:text-white p-1 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
              <ReferencePanel characters={characters} scenes={scenes} onInsertReference={insertReference} onExamineReference={examineReference} isOpen={true} onToggle={() => {}} />
            </div>
          </div>
        </div>

        {/* Main Content Area - Manuscript Folios */}
        <div id="manuscript-scroll-container" className="flex-1 overflow-y-auto custom-scrollbar transition-all duration-500 bg-[#050505] relative flex flex-col items-center">
          <div className="w-full max-w-5xl py-20 flex flex-col items-center space-y-24">
            
            {contentChunks.map((chunk, index) => (
              <div 
                key={index}
                id={`folio-container-${index}`}
                className={`w-full max-w-[800px] min-h-[1050px] bg-[#0a0a0a] border border-white/[0.03] p-16 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] rounded-sm relative transition-all duration-700 ${currentPageIndex === index ? 'ring-1 ring-primary/20 scale-[1.01]' : 'opacity-60 scale-[0.98]'}`}
                onClick={() => setCurrentPageIndex(index)}
              >
                <div id={`editor-page-${index}`} className="relative h-full">
                  <WritingEditor
                    value={chunk}
                    onChange={(e) => handlePageChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e as any)}
                    placeholder={index === 0 ? "The narrative unfolds..." : ""}
                    isSaving={isSaving}
                  />
                </div>
              </div>
            ))}

            <button 
              onClick={() => setContentChunks([...contentChunks, ''])}
              className="w-full max-w-[800px] py-16 border border-dashed border-white/5 rounded-sm flex flex-col items-center justify-center group hover:border-white/10 transition-all opacity-20 hover:opacity-100"
            >
              <span className="text-xl text-white/30 group-hover:text-white/60 mb-2">+</span>
              <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.4em]">Forge Folio</span>
            </button>
          </div>
        </div>

        {/* Dynamic Pages Sidebar */}
        <div className={`relative flex flex-col bg-[#080808] border-l border-white/5 transition-all duration-500 ease-in-out ${pagesPanelOpen ? 'w-[140px]' : 'w-0 opacity-0'} overflow-hidden z-10`}>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col min-w-[140px] items-center">
            <div className="w-full flex items-center justify-between mb-8 border-b border-white/5 pb-2">
              <h3 className="text-[8px] font-mono font-bold text-white/30 uppercase tracking-[0.1em]">Folios</h3>
              <span className="text-[8px] font-mono text-primary font-bold">{contentChunks.length}</span>
            </div>
            <div className="space-y-8">
              {contentChunks.map((_, index) => (
                <div key={index} onClick={() => scrollToPage(index)} className="flex flex-col items-center group cursor-pointer">
                  <div className={`w-[80px] h-[110px] bg-white/[0.01] transition-all duration-500 rounded-sm flex flex-col p-2 relative overflow-hidden border
                    ${currentPageIndex === index ? 'border-primary/40 bg-white/[0.03] scale-110 shadow-lg' : 'border-white/5 opacity-30 group-hover:opacity-100 group-hover:border-white/10 group-hover:scale-105'}`}>
                    <div className="w-full h-[1px] bg-white/10 mb-1 rounded-full"></div>
                    <div className="w-3/4 h-[1px] bg-white/10 mb-1 rounded-full"></div>
                    <div className="w-full h-[1px] bg-white/5 mb-1 rounded-full mt-2"></div>
                  </div>
                  <span className={`mt-3 font-mono text-[8px] font-bold ${currentPageIndex === index ? 'text-primary' : 'text-white/20'}`}>{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Details Sidebar (Codex) */}
        <div className={`relative flex flex-col bg-[#0a0a0a] border-l border-white/5 transition-all duration-700 ease-in-out ${detailsPanelOpen ? 'w-[340px]' : 'w-0 opacity-0'} overflow-hidden z-20`}>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8 flex flex-col min-w-[340px]">
            {/* Detail View Header */}
            <div className="flex items-center justify-between mb-10 pb-4 border-b border-white/5">
              <span className="text-[9px] font-mono text-primary font-bold uppercase tracking-[0.4em]">{examineEntity?.type} Codex</span>
              <button onClick={() => setDetailsPanelOpen(false)} className="text-white/10 hover:text-white p-1 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>

            {/* Detail Content */}
            {examineEntity?.type === 'character' && characters.find(c => c.id === examineEntity.id) && (() => {
              const char = characters.find(c => c.id === examineEntity.id);
              return (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
                  <div>
                    <h4 className="text-4xl font-sans font-bold text-white mb-1 tracking-tight">{char.name}</h4>
                    <p className="text-editor-magenta font-mono text-[10px] uppercase tracking-[0.4em] font-bold">{char.role}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <h5 className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em] font-bold">Biography</h5>
                    <p className="text-sm font-serif text-white/60 leading-relaxed italic border-l border-white/5 pl-6 py-1">
                      {char.description || 'No biography forged.'}
                    </p>
                  </div>

                  <div className="space-y-8">
                    <div className="p-5 bg-white/[0.01] border border-white/5 rounded-xl">
                      <h5 className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em] mb-4 font-bold">Motivation</h5>
                      <p className="text-xs text-white/80 font-sans leading-relaxed italic">
                        "{char.motivation?.goal || 'Survive.'}"
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <h5 className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em] font-bold">Traits</h5>
                      <div className="flex flex-wrap gap-2">
                        {char.traits?.personality?.map((t: string, i: number) => (
                          <span key={i} className="px-2.5 py-1.5 bg-primary/[0.03] border border-primary/10 rounded text-[9px] font-mono text-primary uppercase font-bold tracking-widest">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
            {/* Scene details would go here similarly... */}
          </div>
        </div>
      </div>
    </div>
  );
};