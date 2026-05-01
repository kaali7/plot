import React, { createContext, useContext, useState, useEffect } from 'react';
import { useStoryManager } from '../hooks/useStoryData';
import type { Story, Character, Scene, Conflict, Resource, WritingSession } from '../types/story.types';

interface StoryContextType {
  story: Story | null;
  characters: Character[];
  scenes: Scene[];
  conflicts: Conflict[];
  resources: Resource[];
  writingSession: WritingSession | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  
  // Story actions
  updateStory: (updates: Partial<Story>) => Promise<void>;
  updateWorldSettings: (settings: Story['world_settings']) => Promise<void>;
  
  // Character actions
  addCharacter: (characterData: Partial<Character>) => Promise<void>;
  updateCharacter: (characterId: string, updates: Partial<Character>) => Promise<void>;
  deleteCharacter: (characterId: string) => Promise<void>;
  
  // Scene actions
  addScene: (sceneData: Partial<Scene>) => Promise<void>;
  updateScene: (sceneId: string, updates: Partial<Scene>) => Promise<void>;
  deleteScene: (sceneId: string) => Promise<void>;
  reorderScenes: (sceneIds: string[]) => Promise<void>;
  
  // Conflict actions
  addConflict: (conflictData: Partial<Conflict>) => Promise<void>;
  updateConflict: (conflictId: string, updates: Partial<Conflict>) => Promise<void>;
  deleteConflict: (conflictId: string) => Promise<void>;
  
  // Resource actions
  addResource: (resourceData: Partial<Resource>) => Promise<void>;
  updateResource: (resourceId: string, updates: Partial<Resource>) => Promise<void>;
  deleteResource: (resourceId: string) => Promise<void>;
  
  // Writing actions
  updateWriting: (content: string) => Promise<void>;
}

const StoryContext = createContext<StoryContextType | null>(null);

interface StoryProviderProps {
  storyId: string;
  children: React.ReactNode;
}

export const StoryProvider: React.FC<StoryProviderProps> = ({ storyId, children }) => {
  const {
    data,
    loading,
    error,
    refetch,
    updateStory,
    addCharacter,
    updateCharacter,
    deleteCharacter,
    addScene,
    updateScene,
    deleteScene,
    reorderScenes,
    addConflict,
    updateConflict,
    deleteConflict,
    addResource,
    updateResource,
    deleteResource,
    updateWriting
  } = useStoryManager(storyId);
  
  // Extract data from the hook
  const { story, characters, scenes, conflicts, resources, writingSession } = data;

  const contextValue: StoryContextType = {
    story,
    characters,
    scenes,
    conflicts,
    resources,
    writingSession,
    loading,
    error,
    refetch,
    updateStory,
    updateWorldSettings: async (settings) => {
      // This would call the storyAPI.updateWorldSettings function
      // For now, we'll simulate it
      return updateStory({ world_settings: settings });
    },
    addCharacter,
    updateCharacter,
    deleteCharacter,
    addScene,
    updateScene,
    deleteScene,
    reorderScenes,
    addConflict,
    updateConflict,
    deleteConflict,
    addResource,
    updateResource,
    deleteResource,
    updateWriting
  };

  return (
    <StoryContext.Provider value={contextValue}>
      {children}
    </StoryContext.Provider>
  );
};

export const useStory = () => {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
};