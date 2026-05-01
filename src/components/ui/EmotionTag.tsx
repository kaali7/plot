import React from 'react';

interface EmotionTagProps {
  emotion: 'danger' | 'calm' | 'highlight' | 'info';
  label: string;
  size?: 'xs' | 'sm' | 'md';
}

export const EmotionTag: React.FC<EmotionTagProps> = ({
  emotion,
  label,
  size = 'sm'
}) => {
  // Size mapping
  const sizeMap: Record<string, string> = {
    xs: 'text-xs px-2 py-0.5',
    sm: 'text-sm px-3 py-1',
    md: 'text-base px-4 py-2'
  };

  // Emotion color mapping based on specification
  const emotionMap: Record<string, string> = {
    danger: 'bg-red-900/50 text-red-300',      // Deep red for conflict
    calm: 'bg-purple-900/50 text-purple-300',  // Muted purple for neutral
    highlight: 'bg-purple-700/50 text-purple-200', // Neon purple for emphasis
    info: 'bg-indigo-900/50 text-indigo-300'   // Indigo for information
  };

   return (
     <span 
       className={`${sizeMap[size]} rounded-full ${emotionMap[emotion]}`}
     >
       {label}
     </span>
   );
};