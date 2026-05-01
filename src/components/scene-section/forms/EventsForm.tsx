import React from 'react';

interface EventsFormProps {
  data: any;
  onUpdate: (data: any) => void;
}

export const EventsForm: React.FC<EventsFormProps> = ({ data: _data, onUpdate: _onUpdate }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Scene Events</h3>
      <p className="text-purple-300">Events form placeholder</p>
    </div>
  );
};