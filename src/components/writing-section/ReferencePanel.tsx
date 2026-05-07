import React, { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

interface ReferencePanelProps {
  characters: any[];
  scenes: any[];
  conflicts: any[];
  resources: any[];
  onInsertReference: (type: 'character' | 'scene', id: string) => void;
  onExamineReference: (type: 'character' | 'scene' | 'conflict' | 'resource', id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const ReferencePanel: React.FC<ReferencePanelProps> = ({ 
  characters, 
  scenes, 
  conflicts,
  resources,
  onInsertReference,
  onExamineReference,
  isOpen,
  onToggle
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleSection = (section: string) => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  const SectionHeader = ({ title, sectionId }: { title: string, sectionId: string }) => (
    <button 
      onClick={() => toggleSection(sectionId)}
      className={`w-full flex items-center justify-between px-6 py-4 rounded-xl transition-all duration-500 mb-4 group border ${
        expandedSection === sectionId 
          ? 'bg-primary/5 border-primary/30 shadow-primary-glow/5' 
          : 'bg-[#1a1b1e] border-white/5 hover:border-white/20 hover:bg-[#1e1f22]'
      }`}
    >
      <span className={`text-[10px] font-sans font-bold uppercase tracking-[0.4em] transition-colors ${
        expandedSection === sectionId ? 'text-primary' : 'text-white/50 group-hover:text-white/80'
      }`}>
        {title}
      </span>
      <div className={`transition-all duration-500 ${expandedSection === sectionId ? 'text-primary rotate-180' : 'text-white/20 group-hover:text-white/40'}`}>
        <FiChevronDown size={14} />
      </div>
    </button>
  );

  return (
    <div className="bg-transparent relative overflow-hidden">
      <div className="p-2">
        {/* Heading */}
        <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5 px-2">
          <h4 className="text-[9px] font-sans font-bold text-white/40 uppercase tracking-[0.6em] opacity-80">
            References
          </h4>
          <button 
            onClick={onToggle}
            className="lg:hidden p-2 -mr-2 text-white/20 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="space-y-1">
          {/* Characters Section */}
          <div>
            <SectionHeader title="characters" sectionId="characters" />
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSection === 'characters' ? 'max-h-[400px] opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
              <div className="px-2 py-2 space-y-2">
                {characters.length > 0 ? (
                  characters.map(char => (
                    <div 
                      key={char.id} 
                      className="group relative flex flex-col p-4 bg-[#1a1b1e] border border-white/5 hover:border-white/10 transition-all rounded-xl hover:bg-[#1e1f22] shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex flex-col">
                          <span className="text-xs font-serif font-bold text-white/90 group-hover:text-white transition-colors">{char.name}</span>
                          <span className="text-[9px] font-mono text-white/30 italic uppercase tracking-wider">{char.role}</span>
                        </div>
                        
                        <div className="flex space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => { e.stopPropagation(); onInsertReference('character', char.id); }}
                            title="Insert Name"
                            className="p-2 bg-white/5 hover:bg-primary/20 rounded-xl text-white/60 hover:text-primary transition-all border border-white/5 hover:border-primary/30"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); onExamineReference('character', char.id); }}
                            title="Examine Details"
                            className="p-2 bg-white/5 hover:bg-primary/20 rounded-xl text-white/60 hover:text-primary transition-all border border-white/5 hover:border-primary/30"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] font-mono text-white/20 text-center py-6 italic uppercase tracking-[0.2em]">No characters forged</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Conflict Section */}
          <div>
            <SectionHeader title="conflicts" sectionId="conflicts" />
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSection === 'conflicts' ? 'max-h-[400px] opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
              <div className="px-2 py-2 space-y-2">
                {conflicts.length > 0 ? (
                  conflicts.map(conflict => (
                    <div 
                      key={conflict.id} 
                      className="group relative flex flex-col p-4 bg-[#1a1b1e] border border-white/5 hover:border-white/10 transition-all rounded-xl hover:bg-[#1e1f22] shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-serif font-bold text-white/90 group-hover:text-white transition-colors">{conflict.title}</span>
                        <span className="text-[8px] font-mono text-primary/40 uppercase tracking-widest">{conflict.type}</span>
                      </div>
                      <p className="text-[10px] font-serif text-white/40 italic line-clamp-1">{conflict.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] font-mono text-white/20 text-center py-6 italic uppercase tracking-[0.2em]">No conflicts defined</p>
                )}
              </div>
            </div>
          </div>

          {/* Scenes Section */}
          <div>
            <SectionHeader title="scenes" sectionId="scenes" />
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSection === 'scenes' ? 'max-h-[800px] opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
              <div className="px-2 py-2 space-y-2">
                {scenes.length > 0 && (
                  <button 
                    onClick={() => onInsertReference('all_scenes' as any, 'all')}
                    className="w-full py-3 mb-4 bg-primary/5 border border-primary/20 rounded-xl text-[9px] font-mono text-primary uppercase tracking-[0.2em] font-bold hover:bg-primary/10 transition-all flex items-center justify-center space-x-2 shadow-primary-glow/5"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                    <span>Insert Full Outline</span>
                  </button>
                )}
                {scenes.length > 0 ? (
                  scenes.map((scene, i) => (
                    <div 
                      key={scene.id} 
                      className="group relative flex flex-col p-4 bg-[#1a1b1e] border border-white/5 hover:border-white/10 transition-all rounded-xl hover:bg-[#1e1f22] shadow-sm"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <span className="text-[10px] font-mono font-bold text-white/20 group-hover:text-white/40">{(i + 1).toString().padStart(2, '0')}</span>
                          <span className="text-xs font-serif text-white/80 group-hover:text-white truncate max-w-[120px]">{scene.title}</span>
                        </div>

                        <div className="flex space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => { e.stopPropagation(); onInsertReference('scene', scene.id); }}
                            title="Insert Scene Card"
                            className="p-2 bg-white/5 hover:bg-primary/20 rounded-xl text-white/60 hover:text-primary transition-all border border-white/5 hover:border-primary/30"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); onExamineReference('scene', scene.id); }}
                            title="View Outline"
                            className="p-2 bg-white/5 hover:bg-primary/20 rounded-xl text-white/60 hover:text-primary transition-all border border-white/5 hover:border-primary/30"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] font-mono text-white/20 text-center py-6 italic uppercase tracking-[0.2em]">No scenes chronicled</p>
                )}
              </div>
            </div>
          </div>

          {/* Resource Section */}
          <div>
            <SectionHeader title="resources" sectionId="resources" />
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSection === 'resources' ? 'max-h-[400px] opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
              <div className="px-2 py-2 space-y-2">
                {resources.length > 0 ? (
                  resources.map(res => (
                    <div 
                      key={res.id} 
                      className="group relative flex flex-col p-4 bg-[#1a1b1e] border border-white/5 hover:border-white/10 transition-all rounded-xl hover:bg-[#1e1f22] shadow-sm cursor-pointer"
                      onClick={() => onExamineReference('resource', res.id)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-serif font-bold text-white/90 group-hover:text-white transition-colors">{res.title}</span>
                        <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">{res.type}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] font-mono text-white/20 text-center py-6 italic uppercase tracking-[0.2em]">No resources available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};