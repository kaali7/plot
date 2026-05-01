import React from 'react';

interface CharactersFormProps {
  data: any[];
  onUpdate: (data: any[]) => void;
}

export const CharactersForm: React.FC<CharactersFormProps> = ({ data: _data, onUpdate: _onUpdate }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Scene Characters</h3>
      <p className="text-purple-300">Characters form placeholder</p>
    </div>
  );
};