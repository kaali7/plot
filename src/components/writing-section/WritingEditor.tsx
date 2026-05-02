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
      <div
        contentEditable
        onInput={(e) => {
          // Create a synthetic event matching the expected onChange signature
          const target = e.target as HTMLDivElement;
          onChange({ target: { value: target.innerHTML } } as any);
        }}
        onPaste={(e) => {
          e.preventDefault();
          const text = e.clipboardData.getData('text/plain');
          document.execCommand('insertText', false, text);
        }}
        dangerouslySetInnerHTML={{ __html: value || '' }}
        className="w-full h-full min-h-[600px] bg-transparent text-editor-text font-serif text-xl leading-relaxed focus:outline-none selection:bg-primary/20 selection:text-white"
        spellCheck="true"
        data-placeholder={placeholder}
        style={{ outline: 'none' }}
      />
      
      {/* Editorial Guidelines / Margin Line */}
      <div className="absolute left-[-48px] top-0 bottom-0 w-px bg-editor-border opacity-30 hidden lg:block" />
    </div>
  );
};
