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
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-purple-200">Version History</h3>
        <button
          onClick={onClose}
          className="text-purple-400 hover:text-purple-300 transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        {versions.map((version) => (
          <div
            key={version.id}
            className="border border-purple-800/20 rounded-lg p-4 hover:border-purple-600/30 transition-border"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                <span className="text-sm font-medium text-purple-300">
                  Version {version.version}
                </span>
              </div>
              <div className="text-xs text-purple-500">
                {new Date(version.createdAt).toLocaleString()}
              </div>
            </div>
            
            <div className="prose-sm text-purple-200 max-h-[200px] overflow-y-auto">
              {version.content.split('\n').map((line, index) => (
                <p key={index} className="mb-2">{line}</p>
              ))}
            </div>
            
            <div className="mt-3 flex justify-end">
              <button
                onClick={() => onRestore(version.id)}
                className="px-3 py-1 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded hover:text-purple-200 transition-colors text-sm"
              >
                Restore
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};