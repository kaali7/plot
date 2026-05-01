import React, { useState } from 'react';

interface EditorToolbarProps {
  onSave: () => void;
  onExport: (format: string) => void;
  onInsertReference: (type: 'character' | 'scene', id: string) => void;
  characters: any[];
  scenes: any[];
  isSaving: boolean;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onSave,
  onExport,
  onInsertReference,
  characters,
  scenes,
  isSaving: _isSaving
}) => {
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [activeRefType, setActiveRefType] = useState<'character' | 'scene' | null>(null);

  const handleInsert = (type: 'character' | 'scene', id: string) => {
    onInsertReference(type, id);
    setActiveRefType(null);
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Quick Insert Actions */}
      <div className="flex items-center bg-purple-900/20 rounded-xl border border-purple-500/10 p-1">
        <div className="relative">
          <button
            onClick={() => setActiveRefType(activeRefType === 'character' ? null : 'character')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
              activeRefType === 'character' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40' : 'text-purple-400 hover:text-purple-300'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Character</span>
          </button>
          
          {activeRefType === 'character' && (
            <div className="absolute right-0 mt-3 w-56 bg-[#1a001f] border border-purple-500/20 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl">
              <div className="p-2 max-h-64 overflow-y-auto custom-scrollbar">
                {characters.length === 0 && <div className="p-4 text-xs text-gray-500 italic">No characters found</div>}
                {characters.map(char => (
                  <button
                    key={char.id}
                    onClick={() => handleInsert('character', char.id)}
                    className="w-full text-left px-4 py-3 text-sm text-purple-200 hover:bg-purple-600/20 rounded-xl transition-colors flex items-center space-x-3 group"
                  >
                    <div className="w-6 h-6 rounded-full bg-purple-900/40 border border-purple-500/20 flex items-center justify-center text-[10px] group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      {char.name.charAt(0)}
                    </div>
                    <span className="font-medium">{char.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setActiveRefType(activeRefType === 'scene' ? null : 'scene')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
              activeRefType === 'scene' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40' : 'text-purple-400 hover:text-purple-300'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            <span>Scene</span>
          </button>

          {activeRefType === 'scene' && (
            <div className="absolute right-0 mt-3 w-64 bg-[#1a001f] border border-purple-500/20 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl">
              <div className="p-2 max-h-64 overflow-y-auto custom-scrollbar">
                {scenes.length === 0 && <div className="p-4 text-xs text-gray-500 italic">No scenes found</div>}
                {scenes.map(scene => (
                  <button
                    key={scene.id}
                    onClick={() => handleInsert('scene', scene.id)}
                    className="w-full text-left px-4 py-3 text-sm text-purple-200 hover:bg-purple-600/20 rounded-xl transition-colors flex items-center space-x-3 group"
                  >
                    <div className="w-6 h-6 rounded-lg bg-purple-900/40 border border-purple-500/20 flex items-center justify-center text-[10px] font-black group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      {scene.order + 1}
                    </div>
                    <span className="font-medium truncate">{scene.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="h-6 w-px bg-purple-900/30"></div>

      {/* Export & Save Menu */}
      <div className="flex items-center space-x-2">
        <div className="relative">
          <button
            onClick={() => setExportMenuOpen(!exportMenuOpen)}
            className="p-2.5 bg-purple-900/20 hover:bg-purple-800/40 text-purple-400 rounded-xl border border-purple-500/10 transition-all active:scale-95"
            title="Export Manuscript"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
          
          {exportMenuOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-[#1a001f] border border-purple-500/20 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl">
              <div className="p-1.5">
                {['Markdown', 'PDF', 'EPUB', 'Fountain'].map(format => (
                  <button
                    key={format}
                    onClick={() => { onExport(format.toLowerCase()); setExportMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 text-sm text-purple-200 hover:bg-purple-600/40 rounded-xl transition-colors flex items-center justify-between group"
                  >
                    <span>{format}</span>
                    <span className="text-[9px] font-bold text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">EXPORT</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onSave}
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white text-sm font-bold rounded-xl shadow-lg shadow-purple-900/40 transition-all active:scale-95"
        >
          {_isSaving ? 'Syncing...' : 'Save Draft'}
        </button>
      </div>
    </div>
  );
};