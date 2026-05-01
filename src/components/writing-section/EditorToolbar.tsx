import React, { useState } from 'react';

interface EditorToolbarProps {
  onSave: () => void;
  onExport: (format: string) => void;
  onInsertReference: (type: 'character' | 'scene', id: string) => void;
  characters: { id: string; name: string }[];
  scenes: { id: string; title: string }[];
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onSave,
  onExport,
  onInsertReference,
  characters,
  scenes,
  content,
  setContent
}) => {
  const [referenceType, setReferenceType] = useState<'character' | 'scene' | null>(null);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>('');
  const [selectedSceneId, setSelectedSceneId] = useState<string>('');

  const handleInsertReference = () => {
    if (referenceType === 'character' && selectedCharacterId) {
      onInsertReference('character', selectedCharacterId);
      setReferenceType(null);
      setSelectedCharacterId('');
    } else if (referenceType === 'scene' && selectedSceneId) {
      onInsertReference('scene', selectedSceneId);
      setReferenceType(null);
      setSelectedSceneId('');
    }
  };

  const handleFormat = (format: string) => {
    // Simple formatting - in a real app, this would manipulate the selected text
    const formatted = `\n\n${format}\n\n`;
    setContent(prev => prev + formatted);
  };

  return (
    <div className="border-b border-purple-800/20 pb-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Save Button */}
        <button
          onClick={onSave}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          Save
        </button>

        {/* Export Dropdown */}
        <div className="relative">
          <button
            className="flex items-center space-x-2 px-3 py-2 bg-purple-800/50 hover:bg-purple-800 text-purple-300 rounded-lg transition-colors"
          >
            Export
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className="absolute left-0 mt-2 w-32 bg-[#1a001f] border border-purple-800/20 rounded-lg shadow-lg z-10">
            <button
              onClick={() => onExport('markdown')}
              className="w-full text-left px-3 py-2 text-sm text-purple-300 hover:bg-purple-900/20"
            >
              Markdown
            </button>
            <button
              onClick={() => onExport('pdf')}
              className="w-full text-left px-3 py-2 text-sm text-purple-300 hover:bg-purple-900/20"
            >
              PDF
            </button>
            <button
              onClick={() => onExport('epub')}
              className="w-full text-left px-3 py-2 text-sm text-purple-300 hover:bg-purple-900/20"
            >
              EPUB
            </button>
            <button
              onClick={() => onExport('fountain')}
              className="w-full text-left px-3 py-2 text-sm text-purple-300 hover:bg-purple-900/20"
            >
              Fountain
            </button>
          </div>
        </div>

        {/* Reference Insertion */}
        <div className="relative">
          <button
            onClick={() => setReferenceType(referenceType ? null : 'character')}
            className="flex items-center space-x-2 px-3 py-2 bg-purple-800/50 hover:bg-purple-800 text-purple-300 rounded-lg transition-colors"
          >
            {referenceType === 'character' ? 'Cancel' : 'Character Ref'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {referenceType === 'character' && (
            <div className="absolute left-0 mt-2 w-48 bg-[#1a001f] border border-purple-800/20 rounded-lg shadow-lg z-10">
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-purple-300 mb-2">Select Character</p>
                <select
                  value={selectedCharacterId}
                  onChange={(e) => setSelectedCharacterId(e.target.value)}
                  className="w-full px-2 py-1 bg-purple-900/20 border border-purple-700/30 rounded text-purple-200 focus:border-purple-500"
                >
                  <option value="">Select a character</option>
                  {characters.map(char => (
                    <option key={char.id} value={char.id}>
                      {char.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleInsertReference}
                  className="w-full mt-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                >
                  Insert Reference
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setReferenceType(referenceType ? null : 'scene')}
            className="flex items-center space-x-2 px-3 py-2 bg-purple-800/50 hover:bg-purple-800 text-purple-300 rounded-lg transition-colors"
          >
            {referenceType === 'scene' ? 'Cancel' : 'Scene Ref'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {referenceType === 'scene' && (
            <div className="absolute left-0 mt-2 w-48 bg-[#1a001f] border border-purple-800/20 rounded-lg shadow-lg z-10">
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-purple-300 mb-2">Select Scene</p>
                <select
                  value={selectedSceneId}
                  onChange={(e) => setSelectedSceneId(e.target.value)}
                  className="w-full px-2 py-1 bg-purple-900/20 border border-purple-700/30 rounded text-purple-200 focus:border-purple-500"
                >
                  <option value="">Select a scene</option>
                  {scenes.map(scene => (
                    <option key={scene.id} value={scene.id}>
                      {scene.title}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleInsertReference}
                  className="w-full mt-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                >
                  Insert Reference
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};