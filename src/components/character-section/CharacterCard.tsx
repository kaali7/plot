import React from 'react';
import type { Character } from '../../types/story.types';

interface CharacterCardProps {
  character: Character;
  onClick: (character: Character) => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character, onClick }) => {
  return (
    <div 
      className="bg-[#1a1b1e] border border-white/5 rounded-t-[1.5rem] rounded-b-lg p-5 md:p-6 cursor-pointer flex flex-col group relative overflow-hidden transition-all duration-500 hover:border-primary/20 hover:bg-[#1e1f22] shadow-xl"
      onClick={() => onClick(character)}
    >
      {/* Role & ID Line */}
      <div className="flex items-center justify-between mb-4">
        <span className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-widest">
          {character.role === 'main' ? 'MAIN' : character.role.toUpperCase()}
        </span>
        <span className="text-[9px] font-mono text-white/10 uppercase tracking-[0.2em] font-medium">
          #{character.id.slice(0, 4)}
        </span>
      </div>

      {/* Name */}
      <h3 className="text-xl md:text-2xl font-serif font-black text-white leading-none mb-3 group-hover:text-primary transition-colors">
        {character.name}
      </h3>

      {/* Quote/Description */}
      {character.description && (
        <div className="mb-6">
          <p className="text-white/40 leading-relaxed font-serif text-[11px] md:text-[13px] italic line-clamp-2 border-l border-white/5 pl-3">
            "{character.description}"
          </p>
        </div>
      )}

      {/* Character Traits Section */}
      <div className="grid grid-cols-2 gap-3 mt-auto">
        {/* Capabilities Column */}
        <div className="space-y-3">
          <h4 className="text-[7px] font-mono text-primary/40 uppercase tracking-[0.3em] font-bold">
            Capabilities
          </h4>
          <div className="flex flex-col space-y-1.5">
            {character.traits.strengths.slice(0, 2).map((strength, index) => (
              <div key={`strength-${index}`} className="bg-white/[0.02] border border-white/5 rounded-md px-2 py-1 text-[9px] font-mono text-white/50 uppercase tracking-widest truncate">
                {strength}
              </div>
            ))}
          </div>
        </div>

        {/* Nature Column */}
        <div className="space-y-3">
          <h4 className="text-[7px] font-mono text-primary/40 uppercase tracking-[0.3em] font-bold">
            Nature
          </h4>
          <div className="flex flex-col space-y-1.5">
            {character.traits.personality.slice(0, 2).map((trait, index) => (
              <div key={`personality-${index}`} className="bg-white/[0.02] border border-white/5 rounded-md px-2 py-1 text-[9px] font-mono text-white/50 uppercase tracking-widest truncate">
                {trait}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subtle Gradient Overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[80px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </div>
  );
};