import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface ReferencePanelProps {
  characters: any[];
  scenes: any[];
  onInsertReference: (type: 'character' | 'scene', id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const ReferencePanel: React.FC<ReferencePanelProps> = ({ 
  characters, 
  scenes, 
  onInsertReference,
  isOpen
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleSection = (section: string) => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  const SectionHeader = ({ title, sectionId }: { title: string, sectionId: string }) => (
    <button 
      onClick={() => toggleSection(sectionId)}
      className="w-full flex items-center justify-between px-6 py-3.5 bg-black border border-white/10 rounded-xl hover:border-white/20 transition-all duration-300 mb-3 group shadow-lg"
    >
      <span className="text-white/70 text-[11px] font-mono font-bold uppercase tracking-[0.2em] group-hover:text-white transition-colors">
        {title}
      </span>
      <div className="text-white/30 group-hover:text-white transition-all">
        {expandedSection === sectionId ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
      </div>
    </button>
  );

  return (
    <div className="bg-transparent relative overflow-hidden">
      {/* Outer border and pink accent removed */}
      
      <div className="p-2">
        {/* Heading */}
        <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-white/5">
          <h4 className="text-[10px] font-mono font-bold text-white/50 uppercase tracking-[0.3em]">
            References
          </h4>
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
                      className="group flex flex-col p-4 bg-black/40 border border-white/5 hover:border-white/20 transition-all cursor-pointer rounded-xl hover:bg-black/60"
                      onClick={() => onInsertReference('character', char.id)}
                    >
                      <span className="text-xs font-serif font-bold text-white/90 group-hover:text-white transition-colors">{char.name}</span>
                      <span className="text-[10px] font-mono text-white/30 italic mt-1 uppercase tracking-wider">{char.role}</span>
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
            <SectionHeader title="conflict" sectionId="conflict" />
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSection === 'conflict' ? 'max-h-[400px] opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
              <div className="px-2 py-2 text-center">
                <p className="text-[10px] font-mono text-white/20 py-6 italic uppercase tracking-[0.2em]">No conflicts defined</p>
              </div>
            </div>
          </div>

          {/* Scenes Section */}
          <div>
            <SectionHeader title="scenes" sectionId="scenes" />
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSection === 'scenes' ? 'max-h-[400px] opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
              <div className="px-2 py-2 space-y-2">
                {scenes.length > 0 ? (
                  scenes.map((scene, i) => (
                    <div 
                      key={scene.id} 
                      className="group flex items-center space-x-4 p-4 bg-black/40 border border-white/5 hover:border-white/20 transition-all cursor-pointer rounded-xl hover:bg-black/60"
                      onClick={() => onInsertReference('scene', scene.id)}
                    >
                      <span className="text-[10px] font-mono font-bold text-white/20 group-hover:text-white/40">{(i + 1).toString().padStart(2, '0')}</span>
                      <span className="text-xs font-serif text-white/80 group-hover:text-white truncate">{scene.title}</span>
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
            <SectionHeader title="resource" sectionId="resource" />
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSection === 'resource' ? 'max-h-[400px] opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
              <div className="px-2 py-2 text-center">
                <p className="text-[10px] font-mono text-white/20 py-6 italic uppercase tracking-[0.2em]">No resources available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};