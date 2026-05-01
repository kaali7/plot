import React from 'react';

interface SceneEventsFormProps {
  data: {
    main?: string;
    turningPoint?: string;
  };
  onUpdate: (data: {
    main?: string;
    turningPoint?: string;
  }) => void;
}

export const SceneEventsForm: React.FC<SceneEventsFormProps> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-purple-300 mb-2">Main Event</label>
        <textarea
          value={data.main || ''}
          onChange={(e) => onUpdate({ ...data, main: e.target.value })}
          className="w-full bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none min-h-[80px]"
          placeholder="What is the main event of this scene?"
        />
      </div>

      <div>
        <label className="block text-purple-300 mb-2">Turning Point</label>
        <textarea
          value={data.turningPoint || ''}
          onChange={(e) => onUpdate({ ...data, turningPoint: e.target.value })}
          className="w-full bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none min-h-[80px]"
          placeholder="Is there a significant turning point in this scene?"
        />
      </div>
    </div>
  );
};