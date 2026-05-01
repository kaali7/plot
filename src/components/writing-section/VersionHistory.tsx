import React from 'react';

interface WritingVersion {
  id: string;
  content: string;
  version: number;
  createdAt: string;
}

interface VersionHistoryProps {
  versions: WritingVersion[];
  onRestore: (versionId: string) => void;
  onClose: () => void;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({
  versions,
  onRestore,
  onClose
}) => {
  if (versions.length === 0) {
    return (
      <div className="text-center py-8 text-purple-400">
        No version history available
      </div>
    );
  }

  return (
    <div className="space-y-12 h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-editor-border pb-6">
        <div>
          <h3 className="text-2xl font-serif font-bold text-white tracking-tight">Manuscript Archives</h3>
          <p className="text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.2em] mt-1 italic">Historical Revisions ({versions.length})</p>
        </div>
        <button
          onClick={onClose}
          className="text-editor-text-muted hover:text-white transition-all p-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar">
        {versions.map((version) => (
          <div
            key={version.id}
            className="group card-tactile p-6 transition-all hover:bg-white/[0.01]"
          >
            <div className="flex items-start justify-between mb-4 pb-4 border-b border-editor-border/30">
              <div className="flex items-center space-x-3">
                <span className="text-[10px] font-mono font-bold text-editor-magenta uppercase tracking-widest border border-editor-magenta/20 px-2 py-0.5">
                  Rev v{version.version}
                </span>
                <span className="text-[9px] font-mono text-editor-text-muted uppercase tracking-tighter italic">
                  {new Date(version.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-editor-magenta shadow-magenta-glow opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <div className="text-editor-text-muted font-serif text-sm italic leading-relaxed line-clamp-3 mb-6 opacity-60">
              {version.content}
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-[8px] font-mono text-editor-text-muted/40 uppercase tracking-[0.2em]">Revision Ref #{version.id.slice(0, 4)}</span>
              <button
                onClick={() => onRestore(version.id)}
                className="text-[10px] font-mono text-editor-magenta hover:text-white uppercase tracking-widest transition-all"
              >
                Restore Version
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};