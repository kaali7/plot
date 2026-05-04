import React from 'react';
import type { Character } from '../../types/story.types';

interface CharacterCardProps {
  character: Character;
  onClick: (character: Character) => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character, onClick }) => {
  return (
    <div 
      className="bg-[#121218] border border-white/5 rounded-t-[2rem] rounded-b-xl p-6 md:p-10 cursor-pointer flex flex-col group relative overflow-hidden transition-all duration-500 hover:border-editor-magenta/30"
      onClick={() => onClick(character)}
    >
      {/* Role & ID Line */}
      <div className="flex items-center space-x-4 mb-5">
        <span className="bg-[#2d0a14] text-editor-magenta px-3 py-1 rounded-md text-[9px] font-mono font-bold uppercase tracking-widest">
          {character.role === 'main' ? 'MAIN' : character.role.toUpperCase()}
        </span>
        <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em] italic">
          ID #{character.id.slice(0, 4)}
        </span>
      </div>

      {/* Name */}
      <h3 className="text-2xl md:text-5xl font-serif font-bold text-white leading-tight mb-5 group-hover:text-white transition-colors">
        {character.name}
      </h3>

      {/* Quote/Description */}
      {character.description && (
        <div className="mb-8">
          <p className="text-white/40 leading-relaxed font-serif text-sm md:text-xl italic line-clamp-2">
            "{character.description}"
          </p>
        </div>
      )}

      {/* Character Traits Section */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Capabilities Column */}
        <div className="space-y-4">
          <h4 className="text-[9px] font-mono text-editor-magenta uppercase tracking-[0.3em] font-bold">
            Capabilities
          </h4>
          <div className="flex flex-col space-y-2">
            {character.traits.strengths.slice(0, 2).map((strength, index) => (
              <div key={`strength-${index}`} className="bg-white/[0.02] border border-white/5 rounded-full px-3 py-2 text-[10px] font-mono text-white/60 uppercase tracking-widest text-center">
                {strength}
              </div>
            ))}
          </div>
        </div>

        {/* Nature Column */}
        <div className="space-y-4">
          <h4 className="text-[9px] font-mono text-editor-magenta uppercase tracking-[0.3em] font-bold">
            Nature
          </h4>
          <div className="flex flex-col space-y-2">
            {character.traits.personality.slice(0, 3).map((trait, index) => (
              <div key={`personality-${index}`} className="bg-white/[0.02] border border-white/5 rounded-full px-3 py-2 text-[10px] font-mono text-white/60 uppercase tracking-widest text-center">
                {trait}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none" />
    </div>
  );
};