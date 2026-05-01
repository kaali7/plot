import React from 'react';

interface WritingEditorProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  isSaving?: boolean;
}

export const WritingEditor: React.FC<WritingEditorProps> = ({ 
  value, 
  onChange, 
  placeholder,
  isSaving: _isSaving 
}) => {
  return (
    <div className="relative w-full h-full">
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-full min-h-[600px] bg-transparent text-editor-text font-serif text-xl leading-relaxed resize-none focus:outline-none selection:bg-editor-magenta/20 selection:text-white"
        spellCheck="true"
      />
      
      {/* Editorial Guidelines / Margin Line */}
      <div className="absolute left-[-48px] top-0 bottom-0 w-px bg-editor-border opacity-30 hidden lg:block" />
    </div>
  );
};
