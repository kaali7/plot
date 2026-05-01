import React, { useState } from 'react';
import type { Conflict } from '../../types/story.types';
import { ConflictCard } from './ConflictCard';

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
  const [newConflict, setNewConflict] = useState({
    title: '',
    type: 'internal' as const,
    description: ''
  });

  const handleAddConflict = () => {
    if (!newConflict.title.trim()) return;
    
    onConflictAdd(newConflict);
    setNewConflict({ title: '', type: 'internal', description: '' });
    setShowAddForm(false);
  };

  const getConflictTypeColor = (type: Conflict['type']) => {
    switch (type) {
      case 'internal': return 'bg-blue-900/50 text-blue-300';
      case 'external': return 'bg-red-900/50 text-red-300';
      case 'society': return 'bg-purple-900/50 text-purple-300';
      default: return 'bg-gray-900/50 text-gray-300';
    }
  };

  return (
    <div className="space-y-4">
      {/* Add Conflict Button */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <span>+</span>
          <span>Add New Conflict</span>
        </button>
      )}

      {/* Add Conflict Form */}
      {showAddForm && (
        <div className="bg-[#2a003f] border border-purple-700/30 rounded-lg p-4 space-y-3">
          <div>
            <label className="block text-purple-300 mb-2">Conflict Title</label>
            <input
              type="text"
              value={newConflict.title}
              onChange={(e) => setNewConflict(prev => ({ ...prev, title: e.target.value }))}
              className="w-full bg-[#1a001f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
              placeholder="e.g., Internal struggle with morality"
            />
          </div>

          <div>
            <label className="block text-purple-300 mb-2">Conflict Type</label>
            <select
              value={newConflict.type}
              onChange={(e) => setNewConflict(prev => ({ ...prev, type: e.target.value as Conflict['type'] }))}
              className="w-full bg-[#1a001f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="internal">Internal</option>
              <option value="external">External</option>
              <option value="society">Society</option>
            </select>
          </div>

          <div>
            <label className="block text-purple-300 mb-2">Description</label>
            <textarea
              value={newConflict.description}
              onChange={(e) => setNewConflict(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-[#1a001f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none min-h-[80px]"
              placeholder="Describe the conflict"
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleAddConflict}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
              disabled={!newConflict.title.trim()}
            >
              Add Conflict
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewConflict({ title: '', type: 'internal', description: '' });
              }}
              className="bg-purple-800 hover:bg-purple-900 text-white px-4 py-2 rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Conflict List */}
      {conflicts.length === 0 && !showAddForm ? (
        <div className="text-center py-8 text-purple-400">
          No conflicts added yet. Click "Add New Conflict" to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {conflicts.map(conflict => (
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