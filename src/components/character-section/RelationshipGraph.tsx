import React from 'react';
import { FiUsers } from 'react-icons/fi';

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
  relationships: _relationships // Unused as we fetch from characters
}) => {
  const characterCount = characters.length;
  
  if (characterCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white/[0.01] border border-dashed border-white/10 rounded-3xl">
        <div className="w-16 h-16 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-primary/20">
          <FiUsers size={24} />
        </div>
        <div className="space-y-1">
          <p className="text-[11px] font-mono text-white/30 uppercase tracking-[0.2em] font-bold">The Nexus is Void</p>
          <p className="text-[10px] font-serif text-white/10 italic">Populate your chronicle to see the bonds form.</p>
        </div>
      </div>
    );
  }

  // Calculate positions for characters in a circle
  const centerX = 200;
  const centerY = 200;
  const radius = 140;

  const positions = characters.reduce((acc, char, index) => {
    const angle = (index / characterCount) * Math.PI * 2 - Math.PI / 2;
    acc[char.id] = {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      angle: (angle * 180) / Math.PI
    };
    return acc;
  }, {} as Record<string, { x: number; y: number; angle: number }>);

  const getRelationshipColor = (type: string) => {
    switch (type) {
      case 'romantic': return '#ff0055'; // Magenta
      case 'friend': return '#00d2ff'; // Cyan
      case 'enemy': return '#ff3d00'; // Orange-Red
      case 'rival': return '#ffcc00'; // Amber
      case 'mentor': return '#00ff88'; // Emerald
      case 'family': return '#bf00ff'; // Purple
      default: return '#ffffff';
    }
  };

  return (
    <div className="relative w-full max-w-[400px] mx-auto aspect-square select-none">
      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full drop-shadow-2xl">
        <defs>
          {Object.keys(positions).map((id) => (
            <radialGradient key={`grad-${id}`} id={`grad-${id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff0055" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ff0055" stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>

        {/* Lines */}
        {characters.map(source => 
          (source as any).relationships?.map((rel: any, idx: number) => {
            const start = positions[source.id];
            const end = positions[rel.characterId];
            if (!start || !end) return null;

            const color = getRelationshipColor(rel.type);

            return (
              <g key={`${source.id}-${rel.characterId}-${idx}`}>
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke={color}
                  strokeWidth="1"
                  strokeOpacity="0.15"
                  className="transition-all duration-700"
                />
                <circle
                  cx={(start.x + end.x) / 2}
                  cy={(start.y + end.y) / 2}
                  r="2"
                  fill={color}
                  className="animate-pulse shadow-glow"
                  style={{ filter: `drop-shadow(0 0 4px ${color})` }}
                />
              </g>
            );
          })
        )}

        {/* Character Nodes */}
        {characters.map((character) => {
          const pos = positions[character.id];
          const isMain = character.role === 'main';

          return (
            <g key={character.id} className="group cursor-pointer">
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isMain ? 22 : 18}
                className="fill-[#0a0a0f] stroke-white/10 group-hover:stroke-primary/50 transition-all duration-500"
                style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))' }}
              />
              <text
                x={pos.x}
                y={pos.y}
                dy=".3em"
                textAnchor="middle"
                className="text-[10px] font-mono font-bold fill-white/80 group-hover:fill-white pointer-events-none transition-colors"
              >
                {character.name.charAt(0)}
              </text>
              
              {/* Label */}
              <text
                x={pos.x}
                y={pos.y + (isMain ? 35 : 30)}
                textAnchor="middle"
                className="text-[8px] font-mono font-bold uppercase tracking-widest fill-editor-text-muted group-hover:fill-primary transition-colors duration-300"
              >
                {character.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Decorative Aura */}
      <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-primary/5 via-transparent to-transparent opacity-20" />
    </div>
  );
};