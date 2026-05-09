import React, { useState } from 'react';
import type { Conflict } from '../../types/story.types';
import { conflictSchema } from '../../lib/schemas';
import { InlineResourceAttacher } from '../resources-section/InlineResourceAttacher';
import { useStory } from '../../context/StoryContext';
import { Modal } from '../ui/Modal';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

interface ConflictCardProps {
  conflict: Conflict;
  onUpdate: (updates: Partial<Conflict>) => void;
  onDelete: () => void;
}

export const ConflictCard: React.FC<ConflictCardProps> = ({ conflict, onUpdate, onDelete }) => {
  const [modalMode, setModalMode] = useState<'closed' | 'view' | 'edit' | 'delete'>('closed');
  const [formData, setFormData] = useState({
    title: conflict.title,
    type: conflict.type,
    description: conflict.description || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { resources } = useStory();

  const linkedResourceIds = resources
    .filter(r => r.linked_entities?.conflicts?.includes(conflict.id))
    .map(r => r.id);

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
    setModalMode('view');
  };

  const handleCancel = () => {
    setFormData({
      title: conflict.title,
      type: conflict.type,
      description: conflict.description || ''
    });
    setErrors({});
    setModalMode('view');
  };

  const closeAndReset = () => {
    setModalMode('closed');
    setTimeout(() => {
      setFormData({
        title: conflict.title,
        type: conflict.type,
        description: conflict.description || ''
      });
      setErrors({});
    }, 300);
  };


  return (
    <>
      {/* Streamlined Card View */}
      <div 
        onClick={() => setModalMode('view')}
        className="card-tactile p-4 group border border-white/5 hover:border-orange-500/30 transition-all duration-300 bg-[#1a1b1e]/50 cursor-pointer relative"
      >
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] font-mono text-orange-500/50 uppercase tracking-widest">Open ↗</span>
        </div>
        <div className="flex items-center space-x-3 mb-2 pr-12">
          <span className="text-[9px] font-mono text-orange-400 uppercase tracking-[0.2em] bg-orange-500/10 px-1.5 py-0.5 rounded shadow-sm font-bold border border-orange-500/20 shrink-0">
            {conflict.type}
          </span>
          <h3 className="text-[14px] font-serif font-bold text-white/90 group-hover:text-orange-400 transition-colors leading-tight line-clamp-1">{conflict.title}</h3>
        </div>
        
        {conflict.description && (
          <div className="relative">
            <p className="text-[12px] text-white/60 font-serif italic leading-relaxed line-clamp-2">
              "{conflict.description}"
            </p>
          </div>
        )}
      </div>

      {/* Detail & Edit Modal */}
      <Modal
        isOpen={modalMode !== 'closed'}
        onClose={closeAndReset}
        title={modalMode === 'delete' ? 'Delete Conflict' : modalMode === 'edit' ? 'Edit Conflict' : 'Conflict Details'}
        description={modalMode === 'view' ? `Viewing details for conflict #${conflict.id.slice(0,4)}.` : undefined}
        footer={
          modalMode === 'delete' ? (
            <div className="flex items-center w-full justify-between">
              <button
                onClick={() => setModalMode('view')}
                className="text-editor-text-muted hover:text-white transition-all font-mono text-[10px] uppercase tracking-widest"
              >
                Cancel
              </button>
              <button
                onClick={onDelete}
                className="btn-primary bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20 px-6 py-2.5 text-[10px] font-bold tracking-widest uppercase rounded-full shadow-lg"
              >
                Confirm Deletion
              </button>
            </div>
          ) : modalMode === 'edit' ? (
            <div className="flex items-center w-full justify-end space-x-4">
              <button
                onClick={handleCancel}
                className="text-editor-text-muted hover:text-white transition-all font-mono text-[10px] uppercase tracking-widest"
              >
                Discard
              </button>
              <button
                onClick={handleSave}
                className="btn-primary px-6 py-2.5 text-[10px] font-bold tracking-widest uppercase rounded-full shadow-lg shadow-primary-glow/20"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div className="flex justify-end w-full">
              <button
                onClick={closeAndReset}
                className="text-editor-text-muted hover:text-white transition-all font-mono text-[10px] uppercase tracking-widest"
              >
                Close
              </button>
            </div>
          )
        }
      >
        <div className="space-y-6">
          {modalMode === 'view' && (
            <div className="animate-fade-in relative pt-4">
              <div className="absolute top-0 right-0 flex space-x-3">
                <button 
                  onClick={() => setModalMode('edit')} 
                  className="p-1.5 rounded-md text-editor-text-muted hover:text-primary hover:bg-primary/10 transition-all group"
                  title="Edit Conflict"
                >
                  <FiEdit2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
                <button 
                  onClick={() => setModalMode('delete')} 
                  className="p-1.5 rounded-md text-editor-text-muted hover:text-red-500 hover:bg-red-500/10 transition-all group"
                  title="Remove Conflict"
                >
                  <FiTrash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
              </div>

              <div className="space-y-4 mt-2">
                <div>
                  <span className="text-[10px] font-mono text-orange-400 uppercase tracking-[0.2em] bg-orange-500/10 px-2 py-1 rounded border border-orange-500/20 font-bold mb-3 inline-block">
                    {conflict.type}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-white tracking-tight">{conflict.title}</h3>
                </div>
                
                {conflict.description ? (
                  <p className="text-[14px] text-white/80 font-serif leading-relaxed italic border-l-2 border-orange-500/30 pl-4 py-1">
                    {conflict.description}
                  </p>
                ) : (
                  <p className="text-[12px] text-white/30 font-serif italic">No detailed description provided.</p>
                )}
              </div>
            </div>
          )}

          {modalMode === 'edit' && (
            <div className="space-y-6 animate-fade-in pt-2">
               <div>
                 <label className="block text-[10px] font-mono text-editor-text-muted mb-2 uppercase tracking-[0.2em] font-bold">Conflict Title</label>
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
                <label className="block text-[10px] font-mono text-editor-text-muted mb-2 uppercase tracking-[0.2em] font-bold">Conflict Nature</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Conflict['type'] }))}
                  className="w-full select-tactile font-mono text-xs uppercase tracking-widest"
                >
                  <option value="internal">Internal Tension</option>
                  <option value="external">External Obstacle</option>
                  <option value="society">Societal Pressure</option>
                </select>
              </div>

               <div>
                 <label className="block text-[10px] font-mono text-editor-text-muted mb-2 uppercase tracking-[0.2em] font-bold">Description</label>
                 <textarea
                   value={formData.description}
                   onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                   className={`w-full input-tactile font-serif min-h-[120px] leading-relaxed ${errors.description ? 'border-red-500/50' : ''}`}
                   placeholder="Describe the tension..."
                   maxLength={3000}
                 />
                 {errors.description && <p className="text-red-500 text-[10px] font-mono mt-1 uppercase tracking-wider">{errors.description}</p>}
               </div>
            </div>
          )}

          {modalMode === 'delete' && (
            <div className="space-y-4 py-8 text-center animate-fade-in">
               <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 border border-red-500/20">
                 <span className="text-red-500 font-bold text-xl">!</span>
               </div>
               <h3 className="text-xl font-serif font-bold text-white">Permanently remove this conflict?</h3>
               <p className="text-[13px] text-white/60 font-serif max-w-sm mx-auto leading-relaxed">
                 This action cannot be undone. All linked resources will be unlinked, but will remain in your library.
               </p>
            </div>
          )}

          {/* Resources are visible in both view and edit modes, but hidden during delete confirmation */}
          {modalMode !== 'delete' && (
            <div className="pt-2">
              <InlineResourceAttacher
                entityType="conflicts"
                entityId={conflict.id}
                linkedResourceIds={linkedResourceIds}
              />
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};