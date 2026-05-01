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
}

export const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-purple-300 mb-2">Name</label>
        <input
          type="text"
          value={data.name || ''}
          onChange={(e) => onUpdate({ ...data, name: e.target.value })}
          className="w-full bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
          placeholder="Enter character name"
        />
      </div>

      <div>
        <label className="block text-purple-300 mb-2">Role</label>
        <select
          value={data.role || 'supporting'}
          onChange={(e) => onUpdate({ ...data, role: e.target.value })}
          className="w-full bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
        >
          <option value="main">Main Character</option>
          <option value="sub-main">Sub-Main Character</option>
          <option value="supporting">Supporting Character</option>
          <option value="antagonist">Antagonist</option>
        </select>
      </div>

      <div>
        <label className="block text-purple-300 mb-2">Description</label>
        <textarea
          value={data.description || ''}
          onChange={(e) => onUpdate({ ...data, description: e.target.value })}
          className="w-full bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none min-h-[80px]"
          placeholder="Describe the character"
        />
      </div>
    </div>
  );
};