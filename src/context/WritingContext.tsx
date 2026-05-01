import React, { createContext, useContext, useState, useCallback } from 'react';

// Writing context for editor state
interface WritingState {
  content: string;
  isSaving: boolean;
  autosaveDelay: number;
}

interface WritingActions {
  setContent: (content: string) => void;
  setIsSaving: (isSaving: boolean) => void;
  triggerAutosave: () => void;
}

const WritingContext = createContext<{
  state: WritingState;
  actions: WritingActions;
} | null>(null);

export const useWriting = () => {
  const context = useContext(WritingContext);
  if (!context) {
    throw new Error('useWriting must be used within a WritingProvider');
  }
  return context;
};

interface WritingProviderProps {
  children: React.ReactNode;
  initialContent?: string;
  autosaveDelay?: number;
}

export const WritingProvider: React.FC<WritingProviderProps> = ({
  children,
  initialContent = '',
  autosaveDelay = 2000
}) => {
  const [content, setContentState] = useState<string>(initialContent);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  const setContent = useCallback((content: string) => {
    setContentState(content);
  }, []);

  const setIsSavingState = useCallback((isSaving: boolean) => {
    setIsSaving(isSaving);
  }, []);

  const triggerAutosave = useCallback(() => {
    // This would typically call an API to save the content
    // For now, we just set the saving state
    setIsSavingState(true);
    setTimeout(() => {
      setIsSavingState(false);
    }, 1000); // Simulate save duration
  }, [setIsSavingState]);

  return (
    <WritingContext.Provider
      value={{
        state: {
          content,
          isSaving,
          autosaveDelay
        },
        actions: {
          setContent,
          setIsSaving: setIsSavingState,
          triggerAutosave
        }
      }}
    >
      {children}
    </WritingContext.Provider>
  );
};