import React, { useEffect, useRef } from 'react';

interface WritingEditorProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onAutoSave?: (content: string) => void;
  placeholder?: string;
  isSaving?: boolean;
  autosaveDelay?: number; // in milliseconds
}

export const WritingEditor: React.FC<WritingEditorProps> = ({ 
  value, 
  onChange, 
  onAutoSave,
  placeholder, 
  isSaving = false,
  autosaveDelay = 2000 // 2 seconds default
}) => {
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const contentRef = useRef<string>(value);

  useEffect(() => {
    contentRef.current = value;
    
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Set new autosave timeout if we have an onAutoSave handler
    if (onAutoSave && value.trim() !== '') {
      saveTimeoutRef.current = setTimeout(() => {
        onAutoSave(value);
      }, autosaveDelay);
    }
    
    // Cleanup function
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [value, onAutoSave, autosaveDelay]);

  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder || "Begin writing your story..."}
      className={`w-full h-full bg-[#1a001f] border border-purple-900/30 rounded-xl p-6 text-gray-200 resize-none outline-none 
      ${isSaving ? 'animate-pulse' : ''}
      focus:border-purple-600 transition-colors`}
    />
  );
};