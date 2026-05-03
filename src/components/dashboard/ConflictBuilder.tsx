import React, { useState } from 'react';
import type { Conflict } from '../../types/story.types';
import { ConflictCard } from './ConflictCard';
import { conflictSchema } from '../../lib/schemas';
import { Modal } from '../ui/Modal';

interface ConflictBuilderProps {
  storyId: string;
  conflicts: Conflict[];
  onConflictAdd: (conflict: Omit<Conflict, 'id' | 'story_id' | 'created_at' | 'updated_at'>) => void;
  onConflictUpdate: (id: string, updates: Partial<Conflict>) => void;
  onConflictDelete: (id: string) => void;
}

export const ConflictBuilder: React.FC<ConflictBuilderProps> = ({
  conflicts,
  onConflictAdd,
  onConflictUpdate,
  onConflictDelete
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newConflict, setNewConflict] = useState<{
    title: string;
    type: Conflict['type'];
    description: string;
  }>({
    title: '',
    type: 'internal',
    description: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddConflict = () => {
    const result = conflictSchema.safeParse(newConflict);
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    
    onConflictAdd(newConflict);
    setNewConflict({ title: '', type: 'internal', description: '' });
    setErrors({});
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setNewConflict({ title: '', type: 'internal', description: '' });
    setErrors({});
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 flex flex-col h-full">
      {/* Add Conflict Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full px-8 py-4 bg-white/[0.03] border border-white/10 rounded-full text-[9px] font-mono text-white/40 uppercase tracking-widest hover:bg-editor-magenta hover:text-white hover:border-editor-magenta transition-all"
      >
        Add New Conflict
      </button>

      {/* Conflict List */}
      <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-1">
        {conflicts.length === 0 ? (
          <div className="text-center py-12 card-tactile border-dashed opacity-50 bg-white/[0.01]">
            <p className="text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.2em]">No conflicts forged yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {conflicts.map(conflict => conflict && (
              <ConflictCard
                key={conflict.id}
                conflict={conflict}
                onUpdate={(updates) => onConflictUpdate(conflict.id, updates)}
                onDelete={() => onConflictDelete(conflict.id)}
              />
            ))}
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCancel} 
        title="Forge New Conflict"
      >
        <div className="space-y-6">
           <div>
             <label className="block text-[10px] font-mono text-editor-text-muted mb-2 uppercase tracking-[0.2em]">Conflict Title</label>
             <input
               type="text"
               value={newConflict.title}
               onChange={(e) => setNewConflict({ ...newConflict, title: e.target.value })}
               className={`w-full input-tactile font-serif text-lg ${errors.title ? 'border-red-500/50' : ''}`}
               placeholder="e.g., Internal struggle with morality"
               maxLength={200}
             />
             {errors.title && <p className="text-red-500 text-[10px] font-mono mt-1 uppercase tracking-wider">{errors.title}</p>}
           </div>

           <div>
             <label className="block text-[10px] font-mono text-editor-text-muted mb-2 uppercase tracking-[0.2em]">Conflict Nature</label>
             <select
               value={newConflict.type}
               onChange={(e) => setNewConflict({ ...newConflict, type: e.target.value as Conflict['type'] })}
               className="w-full input-tactile font-mono text-xs uppercase tracking-widest bg-[#0a0a0a]"
             >
               <option value="internal">Internal Tension</option>
               <option value="external">External Obstacle</option>
               <option value="society">Societal Pressure</option>
             </select>
           </div>

           <div>
             <label className="block text-[10px] font-mono text-editor-text-muted mb-2 uppercase tracking-[0.2em]">Description</label>
             <textarea
               value={newConflict.description}
               onChange={(e) => setNewConflict({ ...newConflict, description: e.target.value })}
               className={`w-full input-tactile font-serif min-h-[150px] leading-relaxed ${errors.description ? 'border-red-500/50' : ''}`}
               placeholder="Describe the tension..."
               maxLength={3000}
             />
             {errors.description && <p className="text-red-500 text-[10px] font-mono mt-1 uppercase tracking-wider">{errors.description}</p>}
           </div>

          <div className="flex justify-end space-x-6 pt-4">
            <button
              onClick={handleCancel}
              className="text-editor-text-muted hover:text-white transition-all font-mono text-[10px] uppercase tracking-widest"
            >
              Cancel
            </button>
            <button
              onClick={handleAddConflict}
              className="btn-magenta px-8 py-3 text-[10px] font-bold tracking-widest uppercase rounded-sm disabled:opacity-50"
              disabled={!newConflict.title.trim()}
            >
              Forge Conflict
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};