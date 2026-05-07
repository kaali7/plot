import React, { useRef, useEffect } from 'react';

interface WritingEditorProps {
  value: string;
  onChange: (content: string) => void;
  onSelectionChange?: (state: any) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  placeholder?: string;
  isSaving?: boolean;
}

export const WritingEditor: React.FC<WritingEditorProps> = ({ 
  value, 
  onChange, 
  onSelectionChange,
  onKeyDown,
  placeholder,
  isSaving: _isSaving 
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync value to DOM only if it changed externally
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleSelectionChange = () => {
    if (onSelectionChange) {
      // Basic selection state detection (simplified for this refinement)
      const selection = window.getSelection();
      if (selection) {
        onSelectionChange({
          bold: document.queryCommandState('bold'),
          italic: document.queryCommandState('italic'),
          underline: document.queryCommandState('underline'),
          blockType: 'p' // Default
        });
      }
    }
  };

  return (
    <div className="relative w-full h-full">
      <div
        ref={editorRef}
        contentEditable
        onInput={(e) => {
          const target = e.target as HTMLDivElement;
          onChange(target.innerHTML);
        }}
        onSelect={handleSelectionChange}
        onKeyUp={handleSelectionChange}
        onMouseUp={handleSelectionChange}
        onKeyDown={onKeyDown}
        onPaste={(e) => {
          e.preventDefault();
          const text = e.clipboardData.getData('text/plain');
          document.execCommand('insertText', false, text);
        }}
        className="w-full h-full min-h-[800px] bg-transparent text-editor-text font-serif text-base leading-[1.7] focus:outline-none selection:bg-primary/30"
        spellCheck="true"
        data-placeholder={placeholder}
        style={{ outline: 'none' }}
      />
      
      {/* Empty State Placeholder */}
      {!value && (
        <div className="absolute top-0 left-0 pointer-events-none text-editor-text-muted/30 font-serif text-base italic">
          {placeholder}
        </div>
      )}
      
      {/* Editorial Margin Line */}
      <div className="absolute left-[-60px] top-0 bottom-0 w-[2px] bg-white/[0.05] hidden lg:block" />
    </div>
  );
};
