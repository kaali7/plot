import React from 'react';

interface ArcFormProps {
  data: {
    start?: string;
    end?: string;
  };
  onUpdate: (data: {
    start?: string;
    end?: string;
  }) => void;
}

export const ArcForm: React.FC<ArcFormProps> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-purple-300 mb-2">Starting Point</label>
        <textarea
          value={data.start || ''}
          onChange={(e) => onUpdate({ ...data, start: e.target.value })}
          className="w-full bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none min-h-[60px]"
          placeholder="Where does the character begin their journey?"
        />
      </div>

      <div>
        <label className="block text-purple-300 mb-2">Ending Point</label>
        <textarea
          value={data.end || ''}
          onChange={(e) => onUpdate({ ...data, end: e.target.value })}
          className="w-full bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none min-h-[60px]"
          placeholder="Where does the character end up?"
        />
      </div>
    </div>
  );
};