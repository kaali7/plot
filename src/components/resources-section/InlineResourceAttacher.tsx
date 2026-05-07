import React, { useState } from 'react';
import { useStory } from '../../context/StoryContext';
import { resourceAPI } from '../../lib/api';

interface InlineResourceAttacherProps {
  entityType: 'characters' | 'scenes' | 'conflicts' | 'worldSettings';
  entityId: string;
  linkedResourceIds: string[];
  onLink?: (resourceId: string) => void;
  onUnlink?: (resourceId: string) => void;
}

export const InlineResourceAttacher: React.FC<InlineResourceAttacherProps> = ({
  entityType,
  entityId,
  linkedResourceIds,
  onLink,
  onUnlink,
}) => {
  const { resources, refetch } = useStory();
  const [isOpen, setIsOpen] = useState(false);
  const [isLinking, setIsLinking] = useState<string | null>(null);

  const linkedResources = resources.filter(r => linkedResourceIds?.includes(r.id));
  const availableResources = resources.filter(r => !linkedResourceIds?.includes(r.id));

  const handleLink = async (resourceId: string) => {
    setIsLinking(resourceId);
    try {
      await resourceAPI.linkResourceToEntity(resourceId, entityType, entityId);
      if (onLink) onLink(resourceId);
      await refetch();
    } catch (err) {
      console.error('Failed to link resource:', err);
    } finally {
      setIsLinking(null);
      setIsOpen(false);
    }
  };

  const handleUnlink = async (resourceId: string) => {
    try {
      await resourceAPI.unlinkResourceFromEntity(resourceId, entityType, entityId);
      if (onUnlink) onUnlink(resourceId);
      await refetch();
    } catch (err) {
      console.error('Failed to unlink resource:', err);
    }
  };

  return (
    <div className="mt-6 pt-6 border-t border-white/5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-[9px] font-mono text-editor-text-muted uppercase tracking-[0.3em] font-bold">
          Attached Resources ({linkedResources.length})
        </h4>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-[9px] font-mono text-primary hover:text-white uppercase tracking-widest transition-all"
        >
          {isOpen ? 'Close' : '+ Attach'}
        </button>
      </div>

      {/* Linked resources list */}
      <div className="space-y-2">
        {linkedResources.map(res => (
          <div key={res.id} className="flex items-center justify-between px-4 py-3 bg-white/[0.02] border border-white/5 rounded-lg group hover:border-white/10 transition-all">
            <div className="flex items-center space-x-3">
              <span className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded-sm border ${
                res.type === 'link' ? 'border-blue-500/30 text-blue-400/70' :
                res.type === 'note' ? 'border-amber-500/30 text-amber-400/70' :
                res.type === 'image' ? 'border-purple-500/30 text-purple-400/70' :
                'border-white/20 text-white/40'
              }`}>
                {res.type}
              </span>
              <span className="text-sm font-serif text-white/80">{res.title}</span>
            </div>
            <button
              onClick={() => handleUnlink(res.id)}
              className="text-[9px] font-mono text-red-500/0 group-hover:text-red-500/40 hover:text-red-500 transition-all uppercase tracking-widest"
            >
              Detach
            </button>
          </div>
        ))}
        {linkedResources.length === 0 && !isOpen && (
          <p className="text-[9px] font-mono text-white/10 italic py-2">No references linked to this entity.</p>
        )}
      </div>

      {/* Attach dropdown */}
      {isOpen && (
        <div className="mt-3 p-2 bg-black/40 border border-white/10 rounded-xl max-h-48 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-300">
          {availableResources.length > 0 ? (
            availableResources.map(res => (
              <button
                key={res.id}
                disabled={isLinking === res.id}
                onClick={() => handleLink(res.id)}
                className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-lg transition-all flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-[9px] font-mono text-white/30 uppercase">{res.type}</span>
                  <span className="text-sm font-serif text-white/60 group-hover:text-white transition-colors">{res.title}</span>
                </div>
                {isLinking === res.id && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
              </button>
            ))
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-[9px] font-mono text-white/20 italic">
                All library items are already linked or none exist.
              </p>
              <p className="text-[8px] font-mono text-primary/40 uppercase tracking-widest mt-2">
                Create new resources in Narrative Library
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
