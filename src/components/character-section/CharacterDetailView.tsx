import React, { useState, useMemo } from 'react';
import type { Character } from '../../types/story.types';
import { InlineResourceAttacher } from '../resources-section/InlineResourceAttacher';
import { useStory } from '../../context/StoryContext';
import { ImagePromptModal } from '../ai/ImagePromptModal';
import { AIActionButton } from '../ai/AIActionButton';
import { buildAIContextSnapshot } from '../../lib/ai-context';
import { copyToClipboard } from '../../lib/clipboard';
import { FiCopy, FiCheck } from 'react-icons/fi';

interface CharacterDetailViewProps {
  character: Character;
  onEdit: () => void;
  onClose: () => void;
  isIntegrated?: boolean;
}

export const CharacterDetailView: React.FC<CharacterDetailViewProps> = ({ 
  character, 
  onEdit, 
  onClose,
  isIntegrated = false
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'arc' | 'relationships'>('profile');
  const [showImagePrompt, setShowImagePrompt] = useState(false);
  const [copied, setCopied] = useState(false);
  const [detailCopied, setDetailCopied] = useState(false);
  const { story, characters, scenes, conflicts, resources, addResource } = useStory();

  const linkedResources = resources.filter(r => r.linked_entities?.characters?.includes(character.id));
  const linkedResourceIds = linkedResources.map(r => r.id);
  
  const visualSpec = linkedResources.find(r => r.title.startsWith('Visual Spec:'));

  const aiContext = useMemo(() => {
    if (!story) return null;
    return buildAIContextSnapshot({
      story,
      characters,
      scenes,
      conflicts,
      resources,
    });
  }, [story, characters, scenes, conflicts, resources]);

  const handleSaveAsResource = (prompt: string) => {
    addResource({
      title: `Visual Spec: ${character.name}`,
      type: 'note',
      content: prompt,
      linked_entities: {
        characters: [character.id],
        scenes: [],
        conflicts: [],
        worldSettings: []
      }
    });
  };

  const handleCopyPrompt = async () => {
    let contentToCopy = '';
    
    if (visualSpec) {
      contentToCopy = visualSpec.content || '';
    } else {
      // Fallback: Copy core character data as a prompt
      contentToCopy = `A ${character.role} character named ${character.name}. ${character.description || ''}. Strengths: ${character.traits.strengths.join(', ')}.`;
    }

    const success = await copyToClipboard(contentToCopy);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyDetail = async () => {
    const contentToCopy = `
NAME: ${character.name}
ROLE: ${character.role}

DESCRIPTION:
${character.description || 'N/A'}

STRENGTHS: ${character.traits.strengths.join(', ') || 'None'}
WEAKNESSES: ${character.traits.weaknesses.join(', ') || 'None'}

NARRATIVE ARC:
Start: ${character.arc.start || 'N/A'}
End: ${character.arc.end || 'N/A'}
    `.trim();

    const success = await copyToClipboard(contentToCopy);
    if (success) {
      setDetailCopied(true);
      setTimeout(() => setDetailCopied(false), 2000);
    }
  };

  const viewContent = (
    <div className={`flex flex-col h-full bg-[#050507] ${!isIntegrated ? 'relative w-full max-w-5xl h-[85vh] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-in slide-in-from-right duration-500 ease-out rounded-sm overflow-hidden' : 'w-full rounded-tl-[3rem] border-l border-t border-white/5 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]'}`}>
      {/* Mobile Close Button - Left Side */}
      <button 
        onClick={onClose}
        className="md:hidden absolute top-6 left-6 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:bg-primary hover:text-white backdrop-blur-md transition-all duration-300 z-[60]"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>

      {/* Streamlined Typographic Header */}
      <div className="pt-8 md:pt-10 pl-20 pr-6 md:pl-24 md:pr-12 pb-4 md:pb-6 border-b border-white/[0.03] flex items-center justify-between z-30 relative">
        {/* Folio Merge Point Decoration */}
        {isIntegrated && (
          <div className="absolute top-0 left-0 w-24 h-24 border-tl border-white/20 rounded-tl-[3rem] -translate-x-1 -translate-y-1 opacity-20 pointer-events-none hidden md:block" />
        )}
        <div className="flex items-start md:items-center space-x-4 md:space-x-8">
          <div className="w-2 h-2 rounded-full bg-primary shadow-primary-glow mt-2.5 md:mt-0 shrink-0" />
          <div>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-white tracking-tight uppercase leading-none">
              {character.name}
            </h2>
            <div className="flex flex-wrap items-center gap-1.5 md:gap-3 mt-2 md:mt-3">
              <span className="text-[8px] md:text-[10px] font-mono text-primary uppercase tracking-[0.3em] font-bold border border-primary/30 px-2 py-0.5 rounded-sm bg-primary/5">{character.role}</span>
              <span className="w-1 h-1 rounded-full bg-white/10 hidden md:block" />
              <span className="text-[8px] md:text-[10px] font-mono text-white/20 uppercase tracking-[0.2em] italic">Identity Architecture</span>
            </div>
          </div>
        </div>

        {/* Action Buttons - Moved to Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyDetail}
            className="flex items-center justify-center w-8 h-8 md:w-auto md:px-3 md:py-1.5 bg-white/[0.03] border border-white/10 rounded-full text-[9px] font-mono text-white/40 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all shrink-0"
            title="Copy Detail"
          >
            {detailCopied ? <FiCheck size={12} className="text-primary" /> : <FiCopy size={12} />}
            <span className="hidden sm:inline ml-2">{detailCopied ? 'Copied' : 'Copy Detail'}</span>
          </button>

          <button
            onClick={handleCopyPrompt}
            className="flex items-center space-x-2 px-3 py-1.5 bg-white/[0.03] border border-white/10 rounded-full text-[8px] md:text-[9px] font-mono text-white/40 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all shrink-0"
            title="Copy Visual Prompt"
          >
            {copied ? <FiCheck size={12} className="text-primary" /> : <FiCopy size={12} />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy Prompt'}</span>
          </button>

          <AIActionButton
            onClick={() => setShowImagePrompt(true)}
            label="Image Gen"
            mobileLabel="AI"
            variant="secondary"
          />
          
          <button
            onClick={onEdit}
            className="flex items-center space-x-2 px-3 py-1.5 bg-white/[0.03] border border-white/10 rounded-full text-[8px] md:text-[9px] font-mono text-white/40 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all shrink-0"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            <span className="hidden sm:inline">Edit Persona</span>
          </button>
        </div>
      </div>

      {/* Modern Pill Tabs */}
      <div className="px-4 md:px-6 py-2 md:py-3 bg-[#050507] border-b border-white/[0.02]">
        <div className="inline-flex w-full md:max-w-md items-center rounded-2xl bg-[#12151d] p-[3px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-1 items-center justify-center px-4 py-1.5 rounded-xl text-center text-[8px] md:text-[9px] font-bold uppercase tracking-[0.16em] leading-none transition-all whitespace-nowrap
              ${activeTab === 'profile'
                ? 'bg-primary text-white shadow-primary-glow'
                : 'text-[#7e8490] hover:text-white hover:bg-white/[0.03]'}`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('arc')}
            className={`flex flex-1 items-center justify-center px-4 py-1.5 rounded-xl text-center text-[8px] md:text-[9px] font-bold uppercase tracking-[0.16em] leading-none transition-all whitespace-nowrap
              ${activeTab === 'arc'
                ? 'bg-primary text-white shadow-primary-glow'
                : 'text-[#7e8490] hover:text-white hover:bg-white/[0.03]'}`}
          >
            Narrative
          </button>
          <button
            onClick={() => setActiveTab('relationships')}
            className={`flex flex-1 items-center justify-center px-4 py-1.5 rounded-xl text-center text-[8px] md:text-[9px] font-bold uppercase tracking-[0.16em] leading-none transition-all whitespace-nowrap
              ${activeTab === 'relationships'
                ? 'bg-primary text-white shadow-primary-glow'
                : 'text-[#7e8490] hover:text-white hover:bg-white/[0.03]'}`}
          >
            Relationship
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto lg:overflow-hidden custom-scrollbar bg-black/[0.05]">
        <div className="p-4 md:p-6 h-full flex flex-col">

          {activeTab === 'profile' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col">
              <div className="grid grid-cols-12 gap-6 h-full">
                {/* Visual Anchor */}
                <div className="col-span-12 lg:col-span-4 flex flex-col">
                  <div className="aspect-[3/4] lg:aspect-auto lg:flex-1 rounded-2xl bg-white/[0.02] border border-white/10 overflow-hidden relative group max-w-[240px] md:max-w-none mx-auto lg:mx-0 shadow-2xl">
                    {character.image_url ? (
                      <img src={character.image_url} alt={character.name} className="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/5 text-8xl italic font-serif">
                        {character.name.charAt(0)}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                  </div>
                </div>

                {/* Persona Data */}
                <div className="col-span-12 lg:col-span-8 flex flex-col justify-between space-y-4">
                  <section>
                    <h4 className="text-[9px] font-mono text-primary uppercase tracking-[0.3em] font-bold mb-3 opacity-50">Identity Description</h4>
                    <p className="text-base md:text-lg font-serif text-white/90 italic leading-relaxed border-l border-primary/30 pl-6 md:pl-8">
                      "{character.description || 'This identity remains a mystery in the narrative shadows...'}"
                    </p>
                  </section>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                    <section className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col">
                      <h4 className="text-[9px] font-mono text-primary uppercase tracking-[0.3em] font-bold mb-3">Strengths</h4>
                      <div className="flex flex-wrap gap-1.5 overflow-y-auto no-scrollbar max-h-[120px]">
                        {character.traits.strengths.map((s, i) => (
                          <span key={i} className="px-3 py-1 bg-white/[0.03] border border-white/10 rounded-full text-[9px] font-mono text-white/70 uppercase tracking-widest">{s}</span>
                        ))}
                      </div>
                    </section>
                    <section className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col">
                      <h4 className="text-[9px] font-mono text-primary uppercase tracking-[0.3em] font-bold mb-3">Weaknesses</h4>
                      <div className="flex flex-wrap gap-1.5 overflow-y-auto no-scrollbar max-h-[120px]">
                        {character.traits.weaknesses.map((w, i) => (
                          <span key={i} className="px-3 py-1 bg-red-500/5 border border-red-500/20 rounded-full text-[9px] font-mono text-red-400/60 uppercase tracking-widest">{w}</span>
                        ))}
                      </div>
                    </section>
                  </div>

                  <section className="p-3 bg-black/20 border border-white/5 rounded-xl">
                    <InlineResourceAttacher
                      entityType="characters"
                      entityId={character.id}
                      linkedResourceIds={linkedResourceIds}
                    />
                  </section>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'arc' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <section className="p-10 bg-white/[0.01] border border-white/5 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-primary/50 to-transparent" />
                <h4 className="text-[10px] font-mono text-primary uppercase tracking-[0.4em] font-bold mb-12 opacity-60">Narrative Trajectory</h4>
                <div className="grid grid-cols-1 gap-12 max-w-2xl">
                  <div className="relative pl-12 border-l border-white/10 group">
                    <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary shadow-primary-glow group-hover:scale-125 transition-transform" />
                    <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em] mb-3 block">Anchor point: inception</span>
                    <p className="text-xl font-serif text-white/90 leading-relaxed italic">"{character.arc.start || 'No initial state defined'}"</p>
                  </div>
                  <div className="relative pl-12 border-l border-white/10 group opacity-60 hover:opacity-100 transition-opacity">
                    <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-white/20 group-hover:bg-primary/30 transition-colors" />
                    <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em] mb-3 block">Anchor point: resolution</span>
                    <p className="text-xl font-serif text-white/60 leading-relaxed">{character.arc.end || 'The final resolution of this arc is unwritten'}</p>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'relationships' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <section className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
                <h4 className="text-[10px] font-mono text-primary uppercase tracking-[0.3em] font-bold mb-8">Relationship matrix</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {character.relationships.length > 0 ? (
                    character.relationships.map((rel, i) => (
                      <div key={i} className="flex items-center justify-between p-6 bg-black/40 border border-white/5 rounded-2xl hover:border-primary/30 transition-all">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-mono">ID</div>
                          <div>
                            <span className="text-xs font-serif font-bold text-white block">Reference ID: {rel.characterId.slice(0, 8)}</span>
                            <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">{rel.type}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-20 text-center opacity-20 italic font-serif">
                      This character walks a solitary path... no relationships forged yet.
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>

      {story && aiContext && (
        <ImagePromptModal
          isOpen={showImagePrompt}
          onClose={() => setShowImagePrompt(false)}
          entityType="character"
          entityName={character.name}
          entityPayload={character}
          storyId={story.id}
          context={aiContext}
          onSaveAsResource={handleSaveAsResource}
        />
      )}
    </div>
  );

  if (isIntegrated) return viewContent;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-12 overflow-hidden">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      {viewContent}
    </div>
  );
};
