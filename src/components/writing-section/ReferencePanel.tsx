import React from 'react';

interface ReferencePanelProps {
  characters: any[]; // Character type
  scenes: any[]; // Scene type
  onInsertReference: (type: 'character' | 'scene', id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const ReferencePanel: React.FC<ReferencePanelProps> = ({ 
  characters, 
  scenes, 
  onInsertReference,
  isOpen,
  onToggle
}) => {
  if (!isOpen) {
    return (
      <div className="w-16 bg-[#1a001f] border-r border-purple-900/30 flex items-center justify-center">
        <button
          onClick={onToggle}
          className="text-purple-400 hover:text-purple-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h2m8-9V9m8 0h-8m8 8H9a2 2 0 01-2-2V5a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2h-2m-2 8H7a2 2 0 01-2-2v-2a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2h-2z" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="w-64 bg-[#1a001f] border-l border-purple-900/30 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-purple-900/30">
        <h3 className="text-lg font-bold text-white">References</h3>
        <button
          onClick={onToggle}
          className="text-purple-400 hover:text-purple-300"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Characters */}
        <div className="space-y-3">
          <h4 className="text-purple-300 font-medium mb-2">Characters</h4>
          {characters.length > 0 ? (
            <div className="space-y-1">
              {characters.map(char => (
                <div 
                  key={char.id} 
                  className="flex items-center justify-between p-2 bg-[#2a003f] rounded hover:bg-[#2a003f]/50 transition-colors cursor-pointer"
                  onClick={() => onInsertReference('character', char.id)}
                >
                  <span className="text-gray-300">{char.name}</span>
                  <span className={`text-purple-300 px-2 py-0.5 rounded text-xs`}>
                    {char.role}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-2">No characters defined</p>
          )}
        </div>
        
        {/* Scenes */}
        <div className="space-y-3">
          <h4 className="text-purple-300 font-medium mb-2">Scenes</h4>
          {scenes.length > 0 ? (
            <div className="space-y-1">
              {scenes.map(scene => (
                <div 
                  key={scene.id} 
                  className="flex items-center justify-between p-2 bg-[#2a003f] rounded hover:bg-[#2a003f]/50 transition-colors cursor-pointer"
                  onClick={() => onInsertReference('scene', scene.id)}
                >
                  <span className="text-gray-300">{scene.title}</span>
                  <span className="text-xs text-purple-400">#{scene.order + 1}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-2">No scenes defined</p>
          )}
        </div>
      </div>
    </div>
  );
};