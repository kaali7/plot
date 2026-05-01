import React from 'react';

interface SettingFormProps {
  data: any;
  onUpdate: (data: any) => void;
}

export const SettingForm: React.FC<SettingFormProps> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Scene Setting</h3>
      <p className="text-purple-300">Setting form placeholder</p>
    </div>
  );
};