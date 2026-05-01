import React, { useState } from 'react';
import type { Conflict } from '../../types/story.types';
import { conflictSchema } from '../../lib/schemas';

interface ConflictCardProps {
  conflict: Conflict;
  onUpdate: (updates: Partial<Conflict>) => void;
  onDelete: () => void;
}

export const ConflictCard: React.FC<ConflictCardProps> = ({ conflict, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: conflict.title,
    type: conflict.type,
    description: conflict.description || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = () => {
    const result = conflictSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    onUpdate(formData);
    setErrors({});
    setEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      title: conflict.title,
      type: conflict.type,
      description: conflict.description || ''
    });
    setEditing(false);
  };


  if (editing) {
    return (
      <div className="p-6 card-tactile">
        <div className="space-y-6">
           <div>
             <label className="block text-[10px] font-mono text-editor-text-muted mb-2 uppercase tracking-[0.2em]">Conflict Title</label>
             <input
               type="text"
               value={formData.title}
               onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
               className={`w-full input-tactile font-serif ${errors.title ? 'border-red-500/50' : ''}`}
               placeholder="The inciting incident..."
               maxLength={200}
             />
             {errors.title && <p className="text-red-500 text-[10px] font-mono mt-1 uppercase tracking-wider">{errors.title}</p>}
           </div>

          <div>
            <label className="block text-[10px] font-mono text-editor-text-muted mb-2 uppercase tracking-[0.2em]">Conflict Nature</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Conflict['type'] }))}
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
               value={formData.description}
               onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
               className={`w-full input-tactile font-serif min-h-[80px] leading-relaxed ${errors.description ? 'border-red-500/50' : ''}`}
               placeholder="Describe the tension..."
               maxLength={3000}
             />
             {errors.description && <p className="text-red-500 text-[10px] font-mono mt-1 uppercase tracking-wider">{errors.description}</p>}
           </div>

          <div className="flex space-x-4 pt-4 border-t border-editor-border">
            <button
              onClick={handleSave}
              className="btn-magenta px-4 py-2 text-[10px] font-bold tracking-widest uppercase rounded-sm"
            >
              Update
            </button>
            <button
              onClick={handleCancel}
              className="text-editor-text-muted hover:text-white transition-all font-mono text-[10px] uppercase tracking-widest"
            >
              Discard
            </button>
            <button
              onClick={onDelete}
              className="text-red-500/50 hover:text-red-500 transition-all font-mono text-[10px] uppercase tracking-widest ml-auto"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-tactile p-6 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-[9px] font-mono text-editor-magenta uppercase tracking-tighter border border-editor-magenta/30 px-2 py-0.5">
              {conflict.type}
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-editor-magenta shadow-magenta-glow opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <h3 className="text-xl font-serif font-bold text-editor-text group-hover:text-white transition-colors">{conflict.title}</h3>
        </div>
      </div>
      
      {conflict.description && (
        <p className="text-editor-text-muted font-serif italic text-base leading-relaxed mb-6 line-clamp-2 opacity-80 border-l border-editor-border pl-4">"{conflict.description}"</p>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-editor-border">
        <div className="flex space-x-4">
          <button
            onClick={() => setEditing(true)}
            className="text-[10px] font-mono text-editor-text-muted hover:text-white uppercase tracking-widest transition-all"
          >
            Refine
          </button>
          <button
            onClick={onDelete}
            className="text-[10px] font-mono text-red-500/50 hover:text-red-500 uppercase tracking-widest transition-all"
          >
            Remove
          </button>
        </div>
        <span className="text-[8px] font-mono text-editor-text-muted/40 uppercase tracking-[0.2em]">Conflict Ref #{conflict.id.slice(0, 4)}</span>
      </div>
    </div>
  );
};