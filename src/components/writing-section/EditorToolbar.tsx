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
  isSaving: _isSaving
}) => {
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  return (
    <div className="flex items-center space-x-6">


      {/* Export & Save Menu */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            onClick={() => setExportMenuOpen(!exportMenuOpen)}
            className="p-2 md:p-3 bg-white/[0.03] hover:bg-white/[0.05] text-editor-text-muted hover:text-white rounded-lg md:rounded-xl border border-editor-border transition-all active:scale-95"
            title="Archive Manuscript"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
          
          {exportMenuOpen && (
            <div className="absolute right-0 mt-4 w-56 bg-surface border border-editor-border rounded-sm shadow-2xl z-50 overflow-hidden">
              <div className="p-1">
                {['Markdown', 'PDF', 'EPUB', 'Fountain'].map(format => (
                  <button
                    key={format}
                    onClick={() => { onExport(format.toLowerCase()); setExportMenuOpen(false); }}
                    className="w-full text-left px-4 py-4 text-[10px] font-mono text-editor-text-muted hover:text-white hover:bg-white/[0.03] transition-colors flex items-center justify-between group border-b border-editor-border/30 last:border-0"
                  >
                    <span className="uppercase tracking-widest">{format}</span>
                    <span className="text-[8px] font-bold text-editor-magenta opacity-0 group-hover:opacity-100 transition-opacity">EXPORT</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onSave}
          className="w-9 h-9 md:w-auto md:h-auto md:px-8 md:py-3 btn-magenta text-[10px] font-bold tracking-widest uppercase rounded-lg md:rounded-xl flex items-center justify-center"
        >
          <span className="hidden md:inline">{_isSaving ? 'Synchronizing...' : 'Save Manuscript'}</span>
          {_isSaving ? (
            <svg className="w-4 h-4 md:w-5 md:h-5 md:hidden animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-4 h-4 lg:w-5 lg:h-5 lg:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 21v-8H7v8M7 3v5h8" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};