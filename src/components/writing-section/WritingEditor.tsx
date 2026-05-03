import React, { useRef, useEffect } from 'react';

interface WritingEditorProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  placeholder?: string;
  isSaving?: boolean;
}

export const WritingEditor: React.FC<WritingEditorProps> = ({ 
  value, 
  onChange, 
  onKeyDown,
  placeholder,
  isSaving: _isSaving 
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync value to DOM only if it changed externally (not from user input)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  return (
    <div className="relative w-full h-full">
      <div
        ref={editorRef}
        contentEditable
        onInput={(e) => {
          const target = e.target as HTMLDivElement;
          onChange({ target: { value: target.innerHTML } } as any);
        }}
        onKeyDown={onKeyDown}
        onPaste={(e) => {
          e.preventDefault();
          const text = e.clipboardData.getData('text/plain');
          document.execCommand('insertText', false, text);
        }}
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
