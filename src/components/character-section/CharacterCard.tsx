import React from 'react';
import type { Character } from '../../types/story.types';

interface CharacterCardProps {
  character: Character;
  onClick: (character: Character) => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character, onClick }) => {
  return (
    <div 
      className="bg-[#1a1b1e] border border-white/5 rounded-[1.25rem] p-5 md:p-6 cursor-pointer flex flex-col group relative overflow-hidden transition-all duration-500 hover:border-primary/30 hover:bg-[#1e1f22] shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:shadow-primary-glow/5"
      onClick={() => onClick(character)}
    >
      {/* Glossy top highlight */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />

      {/* Role & ID Line */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-2">
          <span className="bg-primary/20 text-primary border border-primary/30 px-2.5 py-0.5 rounded-full text-[7px] font-mono font-black uppercase tracking-[0.2em] shadow-inner">
            {character.role === 'main' ? 'Protagonist' : character.role.toUpperCase()}
          </span>
          <div className="w-1 h-1 rounded-full bg-white/10" />
          <span className="text-[7px] font-mono text-white/20 uppercase tracking-[0.3em] font-bold">
            LVL {character.traits.strengths.length + character.traits.personality.length}
          </span>
        </div>
        <span className="text-[8px] font-mono text-white/5 uppercase tracking-[0.3em] font-medium group-hover:text-primary/40 transition-colors">
          ID::{character.id.slice(0, 4)}
        </span>
      </div>

      {/* Name */}
      <h3 className="text-xl md:text-2xl font-serif font-black text-white leading-none mb-4 group-hover:text-primary transition-all duration-500 group-hover:translate-x-1">
        {character.name}
      </h3>

      {/* Quote/Description */}
      {character.description && (
        <div className="mb-8 relative">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-primary/10 to-transparent" />
          <p className="text-white/50 leading-relaxed font-serif text-[11px] md:text-[13px] italic line-clamp-2 pl-4 transition-colors group-hover:text-white/70">
            "{character.description}"
          </p>
        </div>
      )}

      {/* Character Traits Section */}
      <div className="grid grid-cols-2 gap-4 mt-auto">
        {/* Capabilities Column */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 opacity-30 group-hover:opacity-60 transition-opacity">
            <div className="w-1.5 h-1.5 rounded-sm bg-primary/60 rotate-45" />
            <h4 className="text-[7px] font-mono text-white uppercase tracking-[0.4em] font-black">
              Capabilities
            </h4>
          </div>
          <div className="flex flex-col space-y-1.5">
            {character.traits.strengths.slice(0, 2).map((strength, index) => (
              <div key={`strength-${index}`} className="bg-white/[0.03] border border-white/5 rounded-lg px-2.5 py-1.5 text-[8px] font-mono text-white/60 uppercase tracking-widest truncate group-hover:border-primary/10 group-hover:text-white/80 transition-all">
                {strength}
              </div>
            ))}
          </div>
        </div>

        {/* Nature Column */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 opacity-30 group-hover:opacity-60 transition-opacity">
            <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
            <h4 className="text-[7px] font-mono text-white uppercase tracking-[0.4em] font-black">
              Nature
            </h4>
          </div>
          <div className="flex flex-col space-y-1.5">
            {character.traits.personality.slice(0, 2).map((trait, index) => (
              <div key={`personality-${index}`} className="bg-white/[0.03] border border-white/5 rounded-lg px-2.5 py-1.5 text-[8px] font-mono text-white/60 uppercase tracking-widest truncate group-hover:border-primary/10 group-hover:text-white/80 transition-all">
                {trait}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subtle Background Elements */}
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary/5 blur-[60px] rounded-full pointer-events-none group-hover:bg-primary/10 transition-all duration-700" />
      <div className="absolute top-2 right-2 w-px h-8 bg-white/[0.02]" />
    </div>
  );
};