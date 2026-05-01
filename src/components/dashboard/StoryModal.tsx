import React, { useState } from 'react';
import { storySchema } from '../../lib/schemas';

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
  initialTitle?: string;
}

export const StoryModal: React.FC<StoryModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  initialTitle = ''
}) => {
  const [title, setTitle] = useState(initialTitle);

  if (!isOpen) return null;

  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = storySchema.safeParse({ name: title });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    onSave(title);
    setTitle('');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      <div className="relative bg-surface border border-editor-border rounded-sm w-full max-w-md shadow-magenta-glow overflow-hidden animate-slide-up">
        <div className="p-8 border-b border-editor-border">
          <h2 className="text-3xl font-serif font-bold text-white tracking-tight">New Manuscript</h2>
          <p className="text-editor-text-muted font-mono text-[10px] uppercase tracking-widest mt-2 italic">Begin your journey here.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div>
            <label className="block text-[10px] font-mono text-editor-text-muted mb-3 uppercase tracking-widest">
              Manuscript Title
            </label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. The Silent Echo"
              className={`w-full input-tactile text-lg font-serif ${error ? 'border-red-500/50' : ''}`}
            />
            {error && <p className="text-red-500 text-[10px] font-mono uppercase mt-2 tracking-wider">{error}</p>}
          </div>
          
          <div className="flex justify-end space-x-6 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="text-editor-text-muted hover:text-white transition-all font-mono text-[10px] uppercase tracking-widest"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="btn-magenta px-8 py-3 text-[10px] font-bold tracking-widest uppercase rounded-sm"
            >
              Initialize
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
