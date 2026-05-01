import React from 'react';
import { useUIState } from '../../context/UIStateContext';

export const Toast: React.FC = () => {
  const { state: { notification }, actions: { hideNotification } } = useUIState();

  if (!notification || !notification.visible) return null;

  const bgColors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    warning: 'bg-yellow-600',
    info: 'bg-blue-600'
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠️',
    info: 'ℹ️'
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-slide-up">
      <div className={`${bgColors[notification.type]} text-white px-5 py-3 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.3)] flex items-center space-x-4 border border-white/10`}>
        <span className="text-xl">{icons[notification.type]}</span>
        <span className="font-medium pr-2">{notification.message}</span>
        <button 
          onClick={hideNotification}
          className="ml-auto hover:opacity-75 transition-opacity opacity-60 text-sm"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
