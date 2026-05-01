import React, { useState } from 'react';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSave(title);
      setTitle('');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      <div className="relative bg-[#1a001f] border border-purple-900/30 rounded-2xl w-full max-w-md shadow-[0_0_50px_rgba(138,0,194,0.3)] overflow-hidden">
        <div className="p-6 border-b border-purple-900/20 bg-gradient-to-r from-purple-900/20 to-transparent">
          <h2 className="text-xl font-bold text-white">Create New Story</h2>
          <p className="text-purple-300/60 text-sm mt-1">Every great narrative begins with a title.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2 uppercase tracking-wider">
              Story Title
            </label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. The Last Nebula"
              className="w-full bg-black/40 border border-purple-900/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all placeholder:text-purple-900/50"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-purple-300 hover:bg-purple-900/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(138,0,194,0.4)]"
            >
              Create Story
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
