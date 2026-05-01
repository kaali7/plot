import React from 'react';
import type { Character } from '../../types/story.types';

interface CharacterCardProps {
  character: Character;
  roleColor: string;
  emotionColor: (emotion: string) => string;
  onClick: (character: Character) => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character, roleColor, emotionColor, onClick }) => {
  return (
    <div 
      className="bg-[#1a001f] rounded-xl p-6 border border-purple-900/30 shadow-[0_0_20px_rgba(138,0,194,0.2)] hover:border-purple-700/40 transition-colors cursor-pointer"
      onClick={() => onClick(character)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white">{character.name}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`${roleColor} text-xs px-2 py-0.5 rounded`}>
              {character.role}
            </span>
          </div>
        </div>
        <button 
          className="text-purple-400 hover:text-purple-300"
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the card click
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {character.description && (
        <p className="text-gray-400 mb-4">{character.description}</p>
      )}

      {/* Character Traits */}
      <div className="space-y-3">
        <div className="flex items-center mb-2">
          <h4 className="text-purple-300 font-medium w-20">Traits</h4>
          <div className="flex-1 space-x-2 flex-wrap">
            {character.traits.strengths.map((strength, index) => (
              <span key={`strength-${index}`} className="bg-green-900/50 text-green-300 text-xs px-2 py-1 rounded-full">
                {strength}
              </span>
            ))}
            {character.traits.weaknesses.map((weakness, index) => (
              <span key={`weakness-${index}`} className="bg-red-900/50 text-red-300 text-xs px-2 py-1 rounded-full">
                {weakness}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center mb-2">
          <h4 className="text-purple-300 font-medium w-20">Personality</h4>
          <div className="flex-1 flex-wrap">
            {character.traits.personality.map((trait, index) => (
              <span key={`personality-${index}`} className="bg-purple-900/50 text-purple-300 text-xs px-2 py-1 rounded-full">
                {trait}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Motivation */}
      <div className="space-y-3">
        <h4 className="text-purple-300 font-medium mb-2">Motivation</h4>
        <div className="space-y-2">
          {character.motivation.goal && (
            <div className="flex items-start space-x-2">
              <span className="flex-shrink-0 text-purple-400">🎯</span>
              <span className="text-gray-300">{character.motivation.goal}</span>
            </div>
          )}
          {character.motivation.fear && (
            <div className="flex items-start space-x-2">
              <span className="flex-shrink-0 text-purple-400">😨</span>
              <span className="text-gray-300">{character.motivation.fear}</span>
            </div>
          )}
          {character.motivation.desire && (
            <div className="flex items-start space-x-2">
              <span className="flex-shrink-0 text-purple-400">💫</span>
              <span className="text-gray-300">{character.motivation.desire}</span>
            </div>
          )}
        </div>
      </div>

      {/* Relationships */}
      <div className="space-y-3">
        <h4 className="text-purple-300 font-medium mb-2">Relationships</h4>
        {character.relationships.length > 0 ? (
          <div className="space-y-2">
            {character.relationships.map((rel, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="flex-shrink-0 text-purple-400">🔗</span>
                <div className="flex-1">
                  <p className="text-gray-300">
                    {rel.characterId} - <span className="text-purple-300">{rel.type}</span>
                    {rel.description && (
                      <span className="text-gray-400 text-xs"> - {rel.description}</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-2">No relationships defined</p>
        )}
      </div>

      {/* Arc */}
      <div className="space-y-3">
        <h4 className="text-purple-300 font-medium mb-2">Character Arc</h4>
        <div className="space-y-2">
          {character.arc.start && (
            <div className="flex items-start space-x-2">
              <span className="flex-shrink-0 text-purple-400">🌱</span>
              <span className="text-gray-300">{character.arc.start}</span>
            </div>
          )}
          {character.arc.end && (
            <div className="flex items-start space-x-2">
              <span className="flex-shrink-0 text-purple-400">✨</span>
              <span className="text-gray-300">{character.arc.end}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};