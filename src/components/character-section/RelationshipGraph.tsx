import React from 'react';

interface Character {
  id: string;
  name: string;
  role: 'main' | 'sub-main' | 'supporting' | 'antagonist';
}

interface Relationship {
  characterId: string;
  type: 'friend' | 'rival' | 'mentor' | 'enemy' | 'family' | 'romantic';
  description?: string;
}

interface RelationshipGraphProps {
  characters: Character[];
  relationships: Relationship[];
}

export const RelationshipGraph: React.FC<RelationshipGraphProps> = ({
  characters,
  relationships
}) => {
  // Simple circular layout for character relationship visualization
  const characterCount = characters.length;
  
  if (characterCount === 0) {
    return (
      <div className="text-center py-8 text-purple-400">
        No characters to display
      </div>
    );
  }

  // Calculate positions for characters in a circle
  const positions = characters.map((_, index) => {
    const angle = (index / characterCount) * Math.PI * 2;
    const radius = 120; // Fixed radius for now
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y };
  });

  // Relationship type colors (using emotion colors from spec)
  const relationshipColors: Record<string, string> = {
    friend: 'bg-blue-500/20 text-blue-400',
    rival: 'bg-yellow-500/20 text-yellow-400',
    mentor: 'bg-green-500/20 text-green-400',
    enemy: 'bg-red-500/20 text-red-400',
    family: 'bg-purple-500/20 text-purple-400',
    romantic: 'bg-pink-500/20 text-pink-400'
  };

  return (
    <div className="relative h-[300px] w-full">
      {/* Character nodes */}
      {characters.map((character, index) => {
        const pos = positions[index];
        return (
          <div 
            key={character.id}
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `calc(50% + ${pos.x}px)`, top: `calc(50% + ${pos.y}px)` }}
          >
            <div className="relative">
              {/* Character badge */}
              <div 
                className="w-16 h-16 flex items-center justify-center rounded-full bg-[#1a001f] border-2 border-purple-500/30 shadow-[0_0_15px_rgba(138,0,194,0.3)]"
              >
                <div className="text-purple-200 font-medium">{character.name.charAt(0)}</div>
              </div>
              
              {/* Character name label */}
              <div className="absolute bottom-full mb-2 text-xs text-purple-300 whitespace-nowrap">
                {character.name}
              </div>
            </div>
          </div>
        );
      })}

       {/* Relationship lines */}
       {relationships.map((rel, index) => {
         const sourceChar = characters.find(c => c.id === rel.characterId);
         const targetChar = characters.find(c => 
           // For simplicity, connecting to first other character (in real app, would have targetId)
           c.id !== rel.characterId && characters.length > 1
         );
         
         if (!sourceChar || !targetChar) return null;
         
         const sourceIndex = characters.indexOf(sourceChar);
         const targetIndex = characters.indexOf(targetChar);
         
         if (sourceIndex === -1 || targetIndex === -1) return null;
         
         const sourcePos = positions[sourceIndex];
         const targetPos = positions[targetIndex];
         
         // Calculate line properties
         const length = Math.sqrt(
           Math.pow(targetPos.x - sourcePos.x, 2) + 
           Math.pow(targetPos.y - sourcePos.y, 2)
         );
         const angle = Math.atan2(targetPos.y - sourcePos.y, targetPos.x - sourcePos.x) * (180 / Math.PI);
         const midpointX = (sourcePos.x + targetPos.x) / 2;
         const midpointY = (sourcePos.y + targetPos.y) / 2;
         
         return (
           <div 
             key={index}
             className="absolute left-1/2 top-1/2 transform"
             style={{
               left: `calc(50% + ${midpointX}px)`,
               top: `calc(50% + ${midpointY}px)`,
               width: `${length}px`,
               height: '2px',
               background: 'linear-gradient(to right, transparent, currentColor, transparent)',
               backgroundSize: '200% 100%',
               backgroundPosition: '0% 50%',
               transform: `rotate(${angle}deg)`
             }}
           >
             {/* Relationship label */}
             <div 
               className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-medium"
               style={{ color: 'currentColor' }}
             >
                <span className={`${relationshipColors[rel.type] || relationshipColors.friend} px-1 rounded`}>
                  {rel.type}
                </span>
             </div>
           </div>
         );
       })}
    </div>
  );
};