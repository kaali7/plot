import React, { useState } from 'react';
import type { Conflict } from '../../types/story.types';

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

  const handleSave = () => {
    onUpdate(formData);
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

  const getConflictTypeColor = (type: Conflict['type']) => {
    switch (type) {
      case 'internal': return 'bg-blue-900/50 text-blue-300 border-blue-700/30';
      case 'external': return 'bg-red-900/50 text-red-300 border-red-700/30';
      case 'society': return 'bg-purple-900/50 text-purple-300 border-purple-700/30';
      default: return 'bg-gray-900/50 text-gray-300 border-gray-700/30';
    }
  };

  if (editing) {
    return (
      <div className={`p-4 rounded-lg border ${getConflictTypeColor(formData.type)}`}>
        <div className="space-y-3">
          <div>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full bg-[#1a001f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
              placeholder="Conflict title"
            />
          </div>

          <div>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Conflict['type'] }))}
              className="w-full bg-[#1a001f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="internal">Internal</option>
              <option value="external">External</option>
              <option value="society">Society</option>
            </select>
          </div>

          <div>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-[#1a001f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none min-h-[60px]"
              placeholder="Conflict description"
            />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-purple-800 hover:bg-purple-900 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors ml-auto"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg border ${getConflictTypeColor(conflict.type)}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-white">{conflict.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs ${getConflictTypeColor(conflict.type)}`}>
          {conflict.type}
        </span>
      </div>
      
      {conflict.description && (
        <p className="text-gray-300 text-sm mb-3">{conflict.description}</p>
      )}

      <div className="flex space-x-2">
        <button
          onClick={() => setEditing(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};