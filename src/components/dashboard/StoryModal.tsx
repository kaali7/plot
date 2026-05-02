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
        className="absolute inset-0 bg-black/40 backdrop-blur-md" 
        onClick={onClose} 
      />
      
      <div className="relative bg-surface-dark backdrop-blur-2xl border border-white/10 rounded-card w-full max-w-md shadow-glass overflow-hidden animate-slide-up">
        <div className="p-8 border-b border-white/5 bg-white/[0.02]">
          <h2 className="text-3xl font-sans font-bold text-white tracking-tight">New Manuscript</h2>
          <p className="text-editor-text-muted font-sans text-sm font-medium mt-2">Begin your journey here.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div>
            <label className="block text-sm font-sans font-medium text-editor-text-muted mb-3">
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
              className={`w-full input-tactile text-lg ${error ? 'border-primary/50 ring-1 ring-primary/50' : ''}`}
            />
            {error && <p className="text-primary text-xs font-sans mt-2 font-medium">{error}</p>}
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="text-editor-text-muted hover:text-white transition-all font-sans text-sm font-medium px-4 py-2"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="btn-magenta px-8 py-3 rounded-full"
            >
              Initialize
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
