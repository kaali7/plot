import React, { useState } from 'react';
import { storySchema } from '../../lib/schemas';
import { Modal } from '../ui/Modal';

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

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Manuscript"
      description="Begin your journey here. Forge a new narrative world."
      maxWidth="md"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="text-editor-text-muted hover:text-white transition-all font-sans text-xs font-bold tracking-widest uppercase px-4 py-2"
          >
            Discard
          </button>
          <button
            onClick={() => handleSubmit()}
            disabled={!title.trim()}
            className="btn-primary px-8 py-2.5 rounded-full shadow-lg shadow-primary-glow/20"
          >
            Initialize
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted mb-3">
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
          {error && <p className="text-primary text-[10px] font-mono mt-2 font-medium uppercase tracking-wider">{error}</p>}
        </div>
      </form>
    </Modal>
  );
};
