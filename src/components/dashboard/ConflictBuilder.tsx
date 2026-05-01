import React, { useState } from 'react';
import type { Conflict } from '../../types/story.types';
import { ConflictCard } from './ConflictCard';
import { conflictSchema } from '../../lib/schemas';

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
  const [showAddForm, setShowAddForm] = useState(false);
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
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Add Conflict Button */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full btn-magenta px-4 py-4 text-[10px] font-bold tracking-widest uppercase rounded-sm"
        >
          Add New Conflict
        </button>
      )}

      {/* Add Conflict Form */}
      {showAddForm && (
        <div className="card-tactile p-6 space-y-6">
           <div>
             <label className="block text-[10px] font-mono text-editor-text-muted mb-2 uppercase tracking-[0.2em]">Conflict Title</label>
             <input
               type="text"
               value={newConflict.title}
               onChange={(e) => setNewConflict({ ...newConflict, title: e.target.value })}
               className={`w-full input-tactile font-serif ${errors.title ? 'border-red-500/50' : ''}`}
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
               className="w-full input-tactile font-mono text-xs uppercase tracking-widest"
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
               className={`w-full input-tactile font-serif min-h-[100px] leading-relaxed ${errors.description ? 'border-red-500/50' : ''}`}
               placeholder="Describe the tension..."
               maxLength={3000}
             />
             {errors.description && <p className="text-red-500 text-[10px] font-mono mt-1 uppercase tracking-wider">{errors.description}</p>}
           </div>

          <div className="flex space-x-4 pt-4 border-t border-editor-border">
            <button
              onClick={handleAddConflict}
              className="btn-magenta px-6 py-2.5 text-[10px] font-bold tracking-widest uppercase rounded-sm disabled:opacity-50"
              disabled={!newConflict.title.trim()}
            >
              Add Conflict
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewConflict({ title: '', type: 'internal', description: '' });
              }}
              className="text-editor-text-muted hover:text-white transition-all font-mono text-[10px] uppercase tracking-widest"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Conflict List */}
      {conflicts.length === 0 && !showAddForm ? (
        <div className="text-center py-12 card-tactile border-dashed opacity-50">
          <p className="text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.2em]">No conflicts added yet.</p>
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
  );
};