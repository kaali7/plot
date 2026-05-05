import React from 'react';
import { InlineResourceAttacher } from '../../resources-section/InlineResourceAttacher';

interface ResourcesFormProps {
  characterId?: string;
  linkedResourceIds: string[];
}

export const ResourcesForm: React.FC<ResourcesFormProps> = ({ characterId, linkedResourceIds }) => {
  // If we don't have a characterId, we can't link resources yet
  if (!characterId) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/10">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <div className="space-y-2">
          <p className="text-[11px] font-mono text-white/30 uppercase tracking-[0.2em] font-bold">Forge Character First</p>
          <p className="text-[10px] font-serif text-white/15 italic max-w-[280px] leading-relaxed">
            Resources can be attached after the character's identity has been committed to the forge.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted">Character Assets</h3>
        <p className="text-[10px] font-serif text-white/20 italic leading-relaxed">
          Link external research, visual inspiration, and secret notes to this character's inventory.
        </p>
      </div>

      <InlineResourceAttacher
        entityType="characters"
        entityId={characterId}
        linkedResourceIds={linkedResourceIds}
      />
    </div>
  );
};