import React from 'react';
import { InlineResourceAttacher } from '../../resources-section/InlineResourceAttacher';
import { useStory } from '../../../context/StoryContext';

interface SceneResourcesFormProps {
  sceneId?: string;
}

export const SceneResourcesForm: React.FC<SceneResourcesFormProps> = ({ sceneId }) => {
  const { resources } = useStory();
  
  // Calculate linked resource IDs for this scene
  const linkedResourceIds = resources
    .filter(r => r.linked_entities?.scenes?.includes(sceneId || ''))
    .map(r => r.id);

  // Resources can only be linked to persisted scenes (ones with an ID)
  if (!sceneId) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/10">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <div className="space-y-2">
          <p className="text-[11px] font-mono text-white/30 uppercase tracking-[0.2em] font-bold">Save Scene First</p>
          <p className="text-[10px] font-serif text-white/15 italic max-w-[280px] leading-relaxed">
            Resources can be attached after the scene has been committed to the chronicle.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted">Scene References</h3>
        <p className="text-[10px] font-serif text-white/20 italic leading-relaxed">
          Attach notes, links, and visual references to enrich this scene's narrative foundation.
        </p>
      </div>

      <InlineResourceAttacher
        entityType="scenes"
        entityId={sceneId}
        linkedResourceIds={linkedResourceIds}
      />
    </div>
  );
};
