import React from 'react';

interface BasicInfoFormProps {
  data: {
    name?: string;
    role?: string;
    description?: string;
  };
  onUpdate: (data: {
    name?: string;
    role?: string;
    description?: string;
  }) => void;
  errors?: Record<string, string>;
}

export const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ data, onUpdate, errors = {} }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-purple-300 mb-2">Name</label>
        <input
          type="text"
          value={data.name || ''}
          onChange={(e) => onUpdate({ ...data, name: e.target.value })}
          className={`w-full bg-[#2a003f] border ${errors.name ? 'border-red-500' : 'border-purple-700/30'} rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none`}
          placeholder="Enter character name"
          maxLength={100}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-purple-300 mb-2">Role</label>
        <select
          value={data.role || 'supporting'}
          onChange={(e) => onUpdate({ ...data, role: e.target.value })}
          className={`w-full bg-[#2a003f] border ${errors.role ? 'border-red-500' : 'border-purple-700/30'} rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none`}
        >
          <option value="protagonist">Protagonist</option>
          <option value="antagonist">Antagonist</option>
          <option value="supporting">Supporting Character</option>
          <option value="minor">Minor Character</option>
        </select>
        {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
      </div>

      <div>
        <label className="block text-purple-300 mb-2">Description</label>
        <textarea
          value={data.description || ''}
          onChange={(e) => onUpdate({ ...data, description: e.target.value })}
          className={`w-full bg-[#2a003f] border ${errors.description ? 'border-red-500' : 'border-purple-700/30'} rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none min-h-[80px]`}
          placeholder="Describe the character"
          maxLength={3000}
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>
    </div>
  );
};