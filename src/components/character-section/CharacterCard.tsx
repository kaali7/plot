import React from 'react';
import type { Character } from '../../types/story.types';

interface CharacterCardProps {
  character: Character;
  roleColor: string;
  onClick: (character: Character) => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character, roleColor, onClick }) => {
  return (
    <div 
      className="card-tactile group p-8 cursor-pointer flex flex-col justify-between min-h-[320px] relative overflow-hidden"
      onClick={() => onClick(character)}
    >
      {/* Quick Edit Action */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onClick(character); // This will trigger selection and opening
        }}
        className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/20 opacity-0 group-hover:opacity-100 hover:bg-editor-magenta hover:text-white hover:border-editor-magenta transition-all duration-300 z-20"
        title="Edit Identity"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
      </button>

      <div className="flex items-start justify-between mb-6">
        <div className="flex-1 flex items-start space-x-6">
          {character.image_url && (
            <div className="w-24 h-24 rounded-sm overflow-hidden border border-editor-border bg-surface-dark shadow-magenta-glow group-hover:shadow-magenta-glow-lg transition-all duration-500 flex-shrink-0">
              <img 
                src={character.image_url} 
                alt={character.name} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
              />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <span className={`text-[10px] font-mono uppercase tracking-tighter border px-2 py-0.5 ${roleColor.replace('bg-', 'border-').replace('/50', '/30')} ${roleColor.replace('bg-', 'text-')}`}>
                {character.role}
              </span>
              <span className="text-[10px] font-mono text-editor-text-muted uppercase tracking-tighter italic">ID #{character.id.slice(0, 4)}</span>
            </div>
            <h3 className="text-3xl font-serif font-bold text-editor-text group-hover:text-white transition-colors">{character.name}</h3>
          </div>
        </div>
        <div className="w-2 h-2 rounded-full bg-editor-magenta shadow-magenta-glow opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {character.description && (
        <p className="text-editor-text-muted font-serif italic text-lg leading-relaxed mb-8 line-clamp-3">"{character.description}"</p>
      )}

      {/* Character Traits */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <h4 className="text-[10px] font-mono text-editor-magenta uppercase tracking-widest mb-3 italic">Capabilities</h4>
          <div className="flex flex-wrap gap-2">
            {character.traits.strengths.slice(0, 2).map((strength, index) => (
              <span key={`strength-${index}`} className="glass-pill text-[9px] uppercase tracking-tighter border-white/10">
                {strength}
              </span>
            ))}
            {character.traits.weaknesses.slice(0, 1).map((weakness, index) => (
              <span key={`weakness-${index}`} className="glass-pill text-[9px] uppercase tracking-tighter border-red-500/20 text-red-400/50">
                {weakness}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-[10px] font-mono text-editor-magenta uppercase tracking-widest mb-3 italic">Nature</h4>
          <div className="flex flex-wrap gap-2">
            {character.traits.personality.slice(0, 3).map((trait, index) => (
              <span key={`personality-${index}`} className="glass-pill text-[9px] uppercase tracking-tighter border-white/10">
                {trait}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-editor-border mt-auto">
        <div className="flex justify-between items-center">
          <div className="flex -space-x-2">
            {character.relationships.slice(0, 3).map((_, i) => (
              <div key={i} className="w-5 h-5 rounded-full border border-editor-border bg-surface flex items-center justify-center text-[8px] font-mono text-editor-magenta">
                👤
              </div>
            ))}
            {character.relationships.length > 3 && (
              <div className="w-5 h-5 rounded-full border border-editor-border bg-surface flex items-center justify-center text-[8px] font-mono text-editor-text-muted">
                +{character.relationships.length - 3}
              </div>
            )}
          </div>
          <span className="text-[10px] font-mono text-editor-text-muted uppercase tracking-widest italic">
            Arc: {character.arc.start ? 'Active' : 'Unset'}
          </span>
        </div>
      </div>
    </div>
  );
};