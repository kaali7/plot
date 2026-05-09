import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WritingEditor } from './WritingEditor';
import type { WritingEditorHandle } from './WritingEditor';
import { ReferencePanel } from './ReferencePanel';
import { EditorToolbar } from './EditorToolbar';
import { AIWritingPanel } from './AIWritingPanel';
import type { WritingSession, Character, Scene } from '../../types/story.types';
import { useStory } from '../../context/StoryContext';
import api from '../../lib/api';
import { AI_CONFIG } from '@/lib/ai-config';
import { aiService } from '@/lib/ai-service';
import { buildAIContextSnapshot, plainTextFromHtml } from '@/lib/ai-context';
import type { AIWritingAction } from '@/types/ai.types';

interface WritingSectionProps {
  writingSession: WritingSession | null;
  characters: Character[];
  scenes: Scene[];
  isSaving: boolean;
  onWritingUpdate: (content: string) => Promise<void>;
  onClose?: () => void;
}

const FormatButton: React.FC<{
  ariaLabel: string;
  command: string;
  active: boolean;
  icon: React.ReactNode;
  className?: string;
}> = ({ ariaLabel, command, active, icon, className }) => {
  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        document.execCommand(command, false);
      }}
      title={ariaLabel}
      className={`flex items-center justify-center rounded-lg lg:rounded-2xl transition-all duration-300 border ${
        active 
          ? 'bg-primary/20 text-primary border-primary/30 shadow-primary-glow' 
          : 'bg-white/5 text-editor-text-muted hover:text-white border-white/5 hover:bg-white/10'
      } ${className || 'w-8 h-8 lg:w-10 lg:h-10'}`}
    >
      {icon}
    </button>
  );
};

export const WritingSection: React.FC<WritingSectionProps> = ({
  writingSession,
  characters,
  scenes,
  isSaving,
  onWritingUpdate,
  onClose
}) => {
  const { story, conflicts, resources, refetch } = useStory();
  const editorRef = useRef<WritingEditorHandle>(null);
  const aiAbortControllerRef = useRef<AbortController | null>(null);

  // Auto-create writing session if missing
  useEffect(() => {
    if (story && !writingSession) {
      api.writing.createWritingSession(story.id).then((res) => {
        if (!res.error) refetch();
      });
    }
  }, [story?.id, writingSession, refetch]);
  const [contentChunks, setContentChunks] = useState<string[]>(writingSession?.content ? [writingSession.content] : ['']);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [referencePanelOpen, setReferencePanelOpen] = useState(typeof window !== 'undefined' ? window.innerWidth > 1024 : false);
  const [pagesPanelOpen, setPagesPanelOpen] = useState(typeof window !== 'undefined' ? window.innerWidth > 1024 : false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [toolbarVisible, setToolbarVisible] = useState(true);

  // Derived state
  const wordCount = contentChunks.join('').trim() ? contentChunks.join('').trim().split(/\s+/).length : 0;
  
  // Selection State
  const [selectionState, setSelectionState] = useState({
    bold: false,
    italic: false,
    underline: false,
    blockType: 'p',
    alignLeft: true,
    alignCenter: false,
    alignRight: false,
    alignJustify: false
  });

  // Find State
  const [findPanelOpen, setFindPanelOpen] = useState(false);
  const [findQuery, setFindQuery] = useState('');
  
  // Menu States
  const [isStyleMenuOpen, setIsStyleMenuOpen] = useState(false);
  const [isFormatMenuOpen, setIsFormatMenuOpen] = useState(false);
  const [isAlignMenuOpen, setIsAlignMenuOpen] = useState(false);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [selectedTextForAI, setSelectedTextForAI] = useState('');
  const [generatedAIContent, setGeneratedAIContent] = useState('');
  const [aiError, setAIError] = useState<string | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Sync content with session
  useEffect(() => {
    if (writingSession?.content && contentChunks[0] !== writingSession.content) {
      setContentChunks([writingSession.content]);
    }
  }, [writingSession?.content]);

  // Handle Scroll to hide toolbar
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      setToolbarVisible(false);
    } else {
      setToolbarVisible(true);
    }
    setLastScrollTop(scrollTop);
  }, [lastScrollTop]);

  const applyStyle = (style: string) => {
    // This would typically interface with the editor ref or a command system
    console.log(`Applying style: ${style}`);
    setIsStyleMenuOpen(false);
  };

  const handleFind = () => {
    console.log(`Finding: ${findQuery}`);
    // Find logic would be implemented here or passed to WritingEditor
  };

  const handleExamineReference = (type: string, id: string) => {
    console.log(`Examining ${type} with ID: ${id}`);
    // Future: open detail view for the reference
  };

  const openAIPanel = () => {
    if (!AI_CONFIG.enabled) {
      alert('AI features are disabled for this environment.');
      return;
    }

    setSelectedTextForAI(editorRef.current?.getSelectionText() || '');
    setGeneratedAIContent('');
    setAIError(null);
    setIsAIPanelOpen(true);
  };

  const handleCancelAI = useCallback(() => {
    if (aiAbortControllerRef.current) {
      aiAbortControllerRef.current.abort();
      aiAbortControllerRef.current = null;
      setIsGeneratingAI(false);
    }
  }, []);

  const handleGenerateAI = async ({
    action,
    instructions,
  }: {
    action: AIWritingAction;
    instructions: string;
  }) => {
    if (!writingSession) {
      setAIError('Create or load a writing session before using AI assist.');
      return;
    }

    if (!story) {
      setAIError('Story context is unavailable.');
      return;
    }

    try {
      // Abort any existing request
      if (aiAbortControllerRef.current) aiAbortControllerRef.current.abort();
      aiAbortControllerRef.current = new AbortController();

      setIsGeneratingAI(true);
      setAIError(null);

      const html = contentChunks.join('');
      const plainText = plainTextFromHtml(html).slice(0, AI_CONFIG.limits.maxManuscriptChars);
      const selectionText = selectedTextForAI.slice(0, AI_CONFIG.limits.maxSelectionChars);

      const response = await aiService.assistWriting({
        action,
        storyId: story.id,
        context: buildAIContextSnapshot({
          story,
          characters,
          scenes,
          conflicts,
          resources,
        }),
        manuscript: {
          html,
          text: plainText,
        },
        selection: selectionText ? { text: selectionText } : undefined,
        instructions: instructions.trim().slice(0, AI_CONFIG.limits.maxInstructionsChars),
      }, aiAbortControllerRef.current.signal);

      setGeneratedAIContent(response.content);
    } catch (error: any) {
      if (error?.name === 'AbortError') {
        console.log('AI Generation Aborted');
      } else {
        setAIError(error instanceof Error ? error.message : 'Unable to generate AI draft.');
      }
    } finally {
      setIsGeneratingAI(false);
      aiAbortControllerRef.current = null;
    }
  };

  const handleAcceptAI = () => {
    if (!generatedAIContent.trim()) return;

    let nextHtml = contentChunks.join('');
    const normalized = generatedAIContent.replace(/\r\n/g, '\n');

    if (selectedTextForAI.trim()) {
      nextHtml = editorRef.current?.replaceSelectionWithText(normalized) || nextHtml;
    } else {
      const prefix = nextHtml.trim() ? '\n\n' : '';
      nextHtml = editorRef.current?.insertTextAtCursor(`${prefix}${normalized}`) || nextHtml;
    }

    setContentChunks([nextHtml]);
    setIsAIPanelOpen(false);
    setGeneratedAIContent('');
    setSelectedTextForAI('');
    setAIError(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (aiAbortControllerRef.current) aiAbortControllerRef.current.abort();
    };
  }, []);

  const handleDraftNarrative = () => {
    if (!scenes || scenes.length === 0) {
      alert("No scenes found to forge into narrative.");
      return;
    }

    if (contentChunks.join('').trim() && !confirm("This will prepend the narrative skeleton to your existing work. Continue?")) {
      return;
    }

    let skeleton = "# Story Narrative Draft\n\n";

    scenes.forEach((scene, idx) => {
      skeleton += `## Scene ${idx + 1}: ${scene.title}\n\n`;
      
      if (scene.background) {
        skeleton += `*Atmosphere:* ${scene.background}\n\n`;
      }

      if (scene.context) {
        skeleton += `*Narrative Context:* ${scene.context}\n\n`;
      }

      if (scene.situation_details) {
        skeleton += `*Situation Details:* ${scene.situation_details}\n\n`;
      }

      if (scene.dialogue && Array.isArray(scene.dialogue)) {
        scene.dialogue.forEach((beat: any) => {
          if (beat.type === 'action') {
            skeleton += `*${beat.content}*\n\n`;
          } else {
            const char = characters.find(c => c.id === beat.characterId);
            skeleton += `**${char?.name || 'Narrator'}:** "${beat.content}"\n\n`;
          }
        });
      }

      if (scene.outcome) {
        skeleton += `*Outcome:* ${scene.outcome}\n\n`;
      }
      
      skeleton += "---\n\n";
    });

    setContentChunks([skeleton + contentChunks.join('')]);
  };

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      {/* Writing Header */}
      <div className="flex items-center justify-between px-4 lg:px-12 py-3 lg:py-10 border-b border-black/20 bg-[#0b0c10] z-40 sticky top-0">
        <div className="flex items-center space-x-4 lg:space-x-8">
          {onClose && (
            <button 
              onClick={onClose}
              className="group flex items-center justify-center w-8 h-8 lg:w-12 lg:h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              title="Return to Story Grid"
            >
              <svg className="w-4 h-4 lg:w-6 lg:h-6 text-white/40 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <div className="flex flex-col">
            <div className="flex items-center space-x-3 mb-1 lg:mb-2">
              <h2 className="text-lg lg:text-3xl font-serif font-bold text-white tracking-tight">
                Manuscript Mode
              </h2>
            </div>
          <div className="flex items-center space-x-2 lg:space-x-3 opacity-60">
            <div className="flex items-center text-[8px] lg:text-[10px] uppercase tracking-[0.3em] font-sans font-bold opacity-60">
              <div className="relative flex items-center justify-center mr-2 lg:mr-3">
                <div className="absolute w-3 h-3 bg-primary/30 blur-md rounded-full" />
                <div className="relative w-1.5 h-1.5 rounded-full bg-primary shadow-primary-glow">
                  <div className="absolute inset-[25%] rounded-full bg-white opacity-80" />
                </div>
              </div>
              {wordCount} words
            </div>
            {lastSaved && (
              <>
                <span className="text-white/10">•</span>
                <span className="text-[8px] lg:text-[10px] font-sans uppercase tracking-[0.2em]">Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </>
            )}
          </div>
        </div>
      </div>

        <div className="flex items-center space-x-4">
          <EditorToolbar 
            onSave={() => onWritingUpdate(contentChunks.join('')).then(() => setLastSaved(new Date()))}
            onExport={(format) => alert(`Exporting as ${format}...`)}
            onDraftNarrative={handleDraftNarrative}
            onAIAssist={openAIPanel}
            onInsertReference={(type, id) => console.log(`Inserting ${type} ${id}`)}
            characters={characters}
            scenes={scenes}
            isSaving={isSaving}
          />
        </div>
      </div>

      {/* Formatting Toolbar */}
      <div className={`flex items-center justify-between px-2 lg:px-6 py-2 border-b border-black/20 bg-[#0b0c10]/80 backdrop-blur-xl sticky top-[73px] lg:top-[97px] z-30 select-none transition-all duration-500 lg:flex-wrap ${toolbarVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="flex items-center flex-shrink-0 mr-3 lg:mr-6">
          <button 
            aria-label="Toggle reference panel" 
            onClick={() => setReferencePanelOpen(!referencePanelOpen)} 
            className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-2xl transition-all duration-500 flex items-center justify-center border ${
              referencePanelOpen 
                ? 'bg-primary/20 text-primary shadow-primary-glow border-primary/30' 
                : 'bg-white/5 text-editor-text-muted hover:text-white border-white/5 hover:bg-white/10'
            }`}
          >
            <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </button>
        </div>

        <div className="flex items-center justify-center space-x-1 lg:space-x-2 flex-shrink-0">
          {/* Find Interface */}
          <div className="flex items-center border-r border-white/10 pr-2 lg:pr-4 mr-1 lg:mr-2">
            {!findPanelOpen ? (
              <button 
                onClick={() => setFindPanelOpen(true)}
                className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-2xl bg-white/5 text-editor-text-muted hover:text-white border border-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
            ) : (
              <div className="flex items-center bg-white/5 rounded-full px-4 py-1 border border-primary/30 shadow-primary-glow/20">
                <input 
                  autoFocus
                  type="text" 
                  value={findQuery}
                  onChange={(e) => setFindQuery(e.target.value)}
                  placeholder="Find in manuscript..."
                  className="bg-transparent border-none outline-none text-xs text-white w-24 md:w-40 font-mono"
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setFindPanelOpen(false);
                    if (e.key === 'Enter') handleFind();
                  }}
                />
                <button onClick={() => handleFind()} className="ml-2 text-primary hover:text-white transition-colors">
                   <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>
                <button onClick={() => setFindPanelOpen(false)} className="ml-2 text-editor-text-muted hover:text-white">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            )}
          </div>

          {/* Styles Dropdown */}
          <div className={`relative px-1 lg:px-3 border-r border-white/10 ${isStyleMenuOpen ? 'z-50' : ''}`}>
            <button 
              onMouseDown={(e) => { e.preventDefault(); setIsStyleMenuOpen(!isStyleMenuOpen); }}
              className={`flex items-center justify-center h-8 lg:h-10 px-2 lg:px-4 rounded-lg lg:rounded-2xl transition-all duration-300 border
                ${isStyleMenuOpen 
                  ? 'bg-primary/20 text-white border-primary/40 shadow-primary-glow' 
                  : 'bg-white/5 text-editor-text-muted hover:text-white border-white/5 hover:bg-white/10'}`}
            >
              <div className={`text-xs font-sans font-bold tracking-tighter mr-2 ${isStyleMenuOpen ? 'text-primary' : 'text-primary/60 group-hover:text-primary'}`}>
                {selectionState.blockType === 'h1' ? 'T' : selectionState.blockType === 'h2' ? 'S' : selectionState.blockType === 'blockquote' ? 'Q' : 'N'}
              </div>
              <svg className={`w-3 h-3 transition-transform duration-500 ${isStyleMenuOpen ? 'rotate-180 text-primary' : 'text-editor-text-muted opacity-40'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isStyleMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsStyleMenuOpen(false)} />
                <div className="absolute top-full left-0 mt-2 w-64 bg-background border border-white/10 rounded-xl shadow-2xl z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-3xl ring-1 ring-white/5">
                  <div className="px-4 py-1 mb-1 border-b border-white/5">
                    <span className="text-[9px] font-mono text-editor-text-muted uppercase tracking-[0.4em] font-bold opacity-60">Styles</span>
                  </div>
                  <button onClick={() => applyStyle('H1')} className={`w-full text-left px-4 py-3 hover:bg-white/[0.03] transition-all flex flex-col ${selectionState.blockType === 'h1' ? 'border-l-2 border-primary bg-primary/5' : ''}`}>
                    <span className="block text-xl font-serif font-bold text-white transition-colors">Title</span>
                  </button>
                  <button onClick={() => applyStyle('H2')} className={`w-full text-left px-4 py-3 hover:bg-white/[0.03] transition-all flex flex-col ${selectionState.blockType === 'h2' ? 'border-l-2 border-primary bg-primary/5' : ''}`}>
                    <span className="block text-lg font-serif font-bold text-white transition-colors">Subtitle</span>
                  </button>
                  <button onClick={() => applyStyle('P')} className={`w-full text-left px-4 py-3 hover:bg-white/[0.03] transition-all border-t border-white/5 flex flex-col ${selectionState.blockType === 'p' ? 'border-l-2 border-primary bg-primary/5' : ''}`}>
                    <span className="block text-sm font-sans text-white font-bold transition-colors">Normal Text</span>
                  </button>
                  <button onClick={() => applyStyle('BLOCKQUOTE')} className={`w-full text-left px-4 py-3 hover:bg-white/[0.03] transition-all border-t border-white/5 flex flex-col ${selectionState.blockType === 'blockquote' ? 'border-l-2 border-primary bg-primary/5' : ''}`}>
                    <span className="block text-base font-serif italic text-primary transition-colors">Quote</span>
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center space-x-1 px-1 lg:px-3 border-r border-white/10">
            {/* Desktop Basic Formatting - Show All */}
            <div className="hidden lg:flex items-center space-x-1">
              <FormatButton ariaLabel="Bold" command="bold" active={selectionState.bold} className="font-serif font-bold w-8 h-8" icon={<span>B</span>} />
              <FormatButton ariaLabel="Italic" command="italic" active={selectionState.italic} className="font-serif italic w-8 h-8" icon={<span>I</span>} />
              <FormatButton ariaLabel="Underline" command="underline" active={selectionState.underline} className="font-serif underline w-8 h-8" icon={<span>U</span>} />
            </div>

            {/* Mobile Basic Formatting - Dropdown */}
            <div className="lg:hidden relative">
              <button 
                onMouseDown={(e) => { e.preventDefault(); setIsFormatMenuOpen(!isFormatMenuOpen); }}
                className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
                  selectionState.bold || selectionState.italic || selectionState.underline 
                    ? 'bg-primary/20 text-primary shadow-primary-glow border-primary/30' 
                    : 'bg-white/5 text-editor-text-muted hover:text-white border-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center">
                  <span className={`text-xs font-sans font-bold tracking-tighter ${selectionState.bold || selectionState.italic || selectionState.underline ? 'text-primary' : 'text-primary/60'}`}>A</span>
                  <svg className={`ml-1 w-2.5 h-2.5 transition-transform duration-300 ${isFormatMenuOpen ? 'rotate-180 text-primary' : 'opacity-40'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </button>

              {isFormatMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsFormatMenuOpen(false)} />
                  <div className="absolute top-full left-0 mt-2 bg-[#0d0d12] border border-white/10 rounded-xl shadow-2xl z-50 p-1 flex flex-col animate-in fade-in slide-in-from-top-2 duration-200 ring-1 ring-white/5 min-w-[44px]">
                    <FormatButton ariaLabel="Bold" command="bold" active={selectionState.bold} className="font-serif font-bold w-10 h-10" icon={<span>B</span>} />
                    <FormatButton ariaLabel="Italic" command="italic" active={selectionState.italic} className="font-serif italic w-10 h-10" icon={<span>I</span>} />
                    <FormatButton ariaLabel="Underline" command="underline" active={selectionState.underline} className="font-serif underline w-10 h-10" icon={<span>U</span>} />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1 px-1 lg:px-3 border-r border-white/10">
            {/* Desktop Alignment - Show All */}
            <div className="hidden lg:flex items-center space-x-1">
              <FormatButton ariaLabel="Align Left" command="justifyLeft" active={selectionState.alignLeft} icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h10M4 18h16" /></svg>} />
              <FormatButton ariaLabel="Align Center" command="justifyCenter" active={selectionState.alignCenter} icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>} />
              <FormatButton ariaLabel="Align Right" command="justifyRight" active={selectionState.alignRight} icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M10 12h10M4 18h16" /></svg>} />
              <FormatButton ariaLabel="Justify" command="justifyFull" active={selectionState.alignJustify} icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>} />
            </div>

            {/* Mobile Alignment - Smart Dropdown */}
            <div className="lg:hidden relative">
              <button 
                onMouseDown={(e) => { e.preventDefault(); setIsAlignMenuOpen(!isAlignMenuOpen); }}
                className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
                  isAlignMenuOpen 
                    ? 'bg-primary/20 text-primary shadow-primary-glow border-primary/30' 
                    : 'bg-white/5 text-editor-text-muted hover:text-white border-white/5 hover:bg-white/10'
                }`}
              >
                {selectionState.alignCenter ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                ) : selectionState.alignRight ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M10 12h10M4 18h16" /></svg>
                ) : selectionState.alignJustify ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h10M4 18h16" /></svg>
                )}
                <svg className={`ml-1 w-2.5 h-2.5 transition-transform duration-300 ${isAlignMenuOpen ? 'rotate-180 text-primary' : 'opacity-40'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
              </button>

              {isAlignMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsAlignMenuOpen(false)} />
                  <div className="absolute top-full left-0 mt-2 bg-[#0d0d12] border border-white/10 rounded-xl shadow-2xl z-50 p-1 flex flex-col animate-in fade-in slide-in-from-top-2 duration-200 ring-1 ring-white/5 min-w-[44px]">
                    <FormatButton ariaLabel="Align Left" command="justifyLeft" active={selectionState.alignLeft} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h10M4 18h16" /></svg>} />
                    <FormatButton ariaLabel="Align Center" command="justifyCenter" active={selectionState.alignCenter} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7" /></svg>} />
                    <FormatButton ariaLabel="Align Right" command="justifyRight" active={selectionState.alignRight} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M10 12h10M4 18h16" /></svg>} />
                    <FormatButton ariaLabel="Justify" command="justifyFull" active={selectionState.alignJustify} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg>} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center min-w-[40px] justify-end">
          <button 
            aria-label="Toggle pages panel" 
            onClick={() => setPagesPanelOpen(!pagesPanelOpen)} 
            className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-2xl transition-all duration-500 flex items-center justify-center border ${
              pagesPanelOpen 
                ? 'bg-primary/20 text-primary shadow-primary-glow border-primary/30' 
                : 'bg-white/5 text-editor-text-muted hover:text-white border-white/5 hover:bg-white/10'
            }`}
          >
            <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </button>
        </div>
      </div>
      
      <div className="flex-1 relative overflow-hidden flex bg-background">
        {/* Mobile Backdrop */}
        <div 
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden transition-all duration-500 ${
            (referencePanelOpen || pagesPanelOpen) ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => { setReferencePanelOpen(false); setPagesPanelOpen(false); }}
        />

        <div className={`fixed lg:relative inset-y-0 left-0 lg:inset-auto flex flex-col bg-[#0b0c10] border-r border-white/5 transition-all duration-500 ease-in-out ${
          referencePanelOpen 
            ? 'w-full sm:w-[320px] lg:w-[260px] translate-x-0 opacity-100' 
            : 'w-0 -translate-x-full lg:translate-x-0 opacity-0 lg:opacity-100'
        } overflow-hidden z-[100] lg:z-20 backdrop-blur-3xl lg:backdrop-blur-none`}>
          <ReferencePanel 
            characters={characters}
            scenes={scenes}
            conflicts={conflicts}
            resources={resources}
            isOpen={referencePanelOpen}
            onToggle={() => setReferencePanelOpen(!referencePanelOpen)}
            onInsertReference={(type, id) => console.log(`Inserting ${type} ${id}`)}
            onExamineReference={handleExamineReference}
          />
        </div>

        {/* Main Editor Surface */}
        <div 
          className="flex-1 relative overflow-y-auto custom-scrollbar bg-background/50 backdrop-blur-3xl scroll-smooth"
          onScroll={handleScroll}
        >
          <div className="w-full lg:max-w-[850px] mx-auto min-h-full lg:min-h-[1100px] lg:my-24 bg-[#1a1b1e] lg:shadow-[0_40px_120px_rgba(0,0,0,0.9)] lg:rounded-2xl border-white/5 p-6 sm:p-12 lg:p-28 relative group border-0 lg:border transition-all duration-700">
            {/* Paper Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] lg:rounded-xl" />
            
            <WritingEditor 
              ref={editorRef}
              value={contentChunks.join('')}
              onChange={(content) => setContentChunks([content])}
              onSelectionChange={setSelectionState}
              placeholder="Begin your manuscript..."
            />

            {/* Page Footer Decor */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center space-x-4 opacity-20">
              <span className="w-8 h-px bg-white/20" />
              <span className="text-[10px] font-serif uppercase tracking-[0.4em] text-white/40">Finis</span>
              <span className="w-8 h-px bg-white/20" />
            </div>
          </div>
        </div>

        {/* Pages Sidebar - Right */}
        <div className={`fixed lg:relative inset-y-0 right-0 lg:inset-auto flex flex-col bg-[#0b0c10] border-l border-white/5 transition-all duration-500 ease-in-out ${
          pagesPanelOpen 
            ? 'w-full sm:w-[320px] lg:w-[300px] translate-x-0 opacity-100' 
            : 'w-0 translate-x-full lg:translate-x-0 opacity-0 lg:opacity-100'
        } overflow-hidden z-[100] lg:z-20`}>
          <div className="p-8 h-full overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-[9px] font-sans text-editor-text-muted uppercase tracking-[0.6em] font-bold opacity-60">Manuscript Pages</h3>
              <button 
                onClick={() => setPagesPanelOpen(false)}
                className="lg:hidden p-2 -mr-2 text-white/20 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-4">
               {scenes.length > 0 ? (
                 scenes.map((scene, idx) => (
                   <div key={scene.id} className="p-5 rounded-2xl bg-[#1a1b1e] border border-white/5 hover:border-primary/40 hover:bg-[#1e1f22] transition-all duration-500 cursor-pointer group mb-4 shadow-xl">
                     <div className="flex items-center justify-between mb-3">
                       <span className="text-[8px] font-sans font-bold text-primary/80 uppercase tracking-[0.2em]">Scene {idx + 1}</span>
                       <span className="text-[8px] font-sans text-editor-text-muted opacity-40 uppercase tracking-widest font-bold">p. {idx * 2 + 1}</span>
                     </div>
                     <h4 className="text-[11px] font-sans font-bold text-white/90 group-hover:text-white transition-colors truncate tracking-tight">{scene.title}</h4>
                     <div className="mt-3 flex items-center justify-between">
                       <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden mr-4">
                         <div className="h-full bg-primary/40 rounded-full" style={{ width: '60%' }} />
                       </div>
                       <span className="w-1.5 h-1.5 rounded-full bg-primary/60 shadow-primary-glow" />
                     </div>
                   </div>
                 ))
               ) : (
                 <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                   <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/10">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                   </div>
                   <p className="text-[10px] font-sans text-white/20 uppercase tracking-[0.2em] italic">No scenes chronicled</p>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>

      <AIWritingPanel
        isOpen={isAIPanelOpen}
        onClose={() => setIsAIPanelOpen(false)}
        onGenerate={handleGenerateAI}
        onCancel={handleCancelAI}
        onAccept={handleAcceptAI}
        generatedContent={generatedAIContent}
        selectedText={selectedTextForAI}
        isLoading={isGeneratingAI}
        error={aiError}
        isReplaceMode={Boolean(selectedTextForAI.trim())}
      />
    </div>
  );
};
