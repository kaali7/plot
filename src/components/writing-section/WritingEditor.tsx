import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

export interface WritingEditorHandle {
  getSelectionText: () => string;
  replaceSelectionWithText: (text: string) => string;
  insertTextAtCursor: (text: string) => string;
  focus: () => void;
}

interface WritingEditorProps {
  value: string;
  onChange: (content: string) => void;
  onSelectionChange?: (state: any) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  placeholder?: string;
  isSaving?: boolean;
}

export const WritingEditor = forwardRef<WritingEditorHandle, WritingEditorProps>(({
  value, 
  onChange, 
  onSelectionChange,
  onKeyDown,
  placeholder,
  isSaving: _isSaving 
}, ref) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);

  // Sync value to DOM only if it changed externally
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleSelectionChange = () => {
    const selection = window.getSelection();
    const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

    if (
      range &&
      editorRef.current &&
      range.commonAncestorContainer &&
      editorRef.current.contains(range.commonAncestorContainer)
    ) {
      savedRangeRef.current = range.cloneRange();
    }

    if (onSelectionChange) {
      // Basic selection state detection (simplified for this refinement)
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

  const restoreRange = (range: Range | null) => {
    if (!range) return false;

    const selection = window.getSelection();
    if (!selection) return false;

    selection.removeAllRanges();
    selection.addRange(range);
    return true;
  };

  useImperativeHandle(ref, () => ({
    getSelectionText: () => window.getSelection()?.toString() || '',
    replaceSelectionWithText: (text: string) => {
      const range = savedRangeRef.current ? savedRangeRef.current.cloneRange() : null;
      editorRef.current?.focus();
      restoreRange(range);
      document.execCommand('insertText', false, text);
      return editorRef.current?.innerHTML || '';
    },
    insertTextAtCursor: (text: string) => {
      editorRef.current?.focus();
      const selection = window.getSelection();

      if (
        editorRef.current &&
        (!selection ||
          selection.rangeCount === 0 ||
          !editorRef.current.contains(selection.anchorNode))
      ) {
        const range = document.createRange();
        range.selectNodeContents(editorRef.current);
        range.collapse(false);
        restoreRange(range);
      }

      document.execCommand('insertText', false, text);
      return editorRef.current?.innerHTML || '';
    },
    focus: () => {
      editorRef.current?.focus();
    },
  }), []);

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
});

WritingEditor.displayName = 'WritingEditor';
