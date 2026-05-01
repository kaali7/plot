import React from 'react';

interface ConflictFormProps {
  data: any;
  onUpdate: (data: any) => void;
}

export const ConflictForm: React.FC<ConflictFormProps> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Scene Conflicts</h3>
      <p className="text-purple-300">Conflict form placeholder</p>
    </div>
  );
};