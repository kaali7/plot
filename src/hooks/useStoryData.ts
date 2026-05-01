import { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';
import type { Story, Character, Scene, Conflict, Resource, WritingSession } from '../types/story.types';

interface StoryData {
  story: Story | null;
  characters: Character[];
  scenes: Scene[];
  conflicts: Conflict[];
  resources: Resource[];
  writingSession: WritingSession | null;
}

interface StoryManager {
  data: StoryData;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateStory: (updates: Partial<Story>) => Promise<void>;
  addCharacter: (characterData: Partial<Character>) => Promise<void>;
  updateCharacter: (characterId: string, updates: Partial<Character>) => Promise<void>;
  deleteCharacter: (characterId: string) => Promise<void>;
  addScene: (sceneData: Partial<Scene>) => Promise<void>;
  updateScene: (sceneId: string, updates: Partial<Scene>) => Promise<void>;
  deleteScene: (sceneId: string) => Promise<void>;
  reorderScenes: (sceneIds: string[]) => Promise<void>;
  addConflict: (conflictData: Partial<Conflict>) => Promise<void>;
  updateConflict: (conflictId: string, updates: Partial<Conflict>) => Promise<void>;
  deleteConflict: (conflictId: string) => Promise<void>;
  addResource: (resourceData: Partial<Resource>) => Promise<void>;
  updateResource: (resourceId: string, updates: Partial<Resource>) => Promise<void>;
  deleteResource: (resourceId: string) => Promise<void>;
  updateWriting: (content: string) => Promise<void>;
}

export const useStoryManager = (storyId: string): StoryManager => {
  const [data, setData] = useState<StoryData>({
    story: null,
    characters: [],
    scenes: [],
    conflicts: [],
    resources: [],
    writingSession: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStoryData = useCallback(async () => {
    if (!storyId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.story.getFullStory(storyId);
      if (response.error) {
        throw new Error(response.error);
      }
      
      if (response.data) {
        setData({
          story: response.data,
          characters: response.data.characters || [],
          scenes: response.data.scenes || [],
          conflicts: response.data.conflicts || [],
          resources: response.data.resources || [],
          writingSession: response.data.writingSession || null
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load story data');
    } finally {
      setLoading(false);
    }
  }, [storyId]);

  useEffect(() => {
    loadStoryData();
  }, [loadStoryData]);

  // Optimistic update helper
  const optimisticUpdate = useCallback(
    <T extends { id: string }>(
      items: T[],
      newItem: T,
      tempId: string
    ): T[] => {
      return items.map(item => item.id === tempId ? newItem : item);
    },
    []
  );

  const updateStory = useCallback(async (updates: Partial<Story>) => {
    if (!data.story) return;
    
    const originalStory = data.story;
    setData(prev => ({ ...prev, story: { ...prev.story!, ...updates } }));
    
    try {
      await api.story.updateStoryBasics(data.story.id, updates);
    } catch (err) {
      setData(prev => ({ ...prev, story: originalStory }));
      throw err;
    }
  }, [data.story]);

  const addCharacter = useCallback(async (characterData: Partial<Character>) => {
    if (!data.story) return;
    
    const tempId = 'temp-' + Date.now();
    const tempCharacter: Character = {
      id: tempId,
      story_id: data.story.id,
      name: characterData.name || 'New Character',
      role: characterData.role || 'supporting',
      description: characterData.description,
      motivation: characterData.motivation || { goal: null, fear: null, desire: null },
      traits: characterData.traits || { strengths: [], weaknesses: [], personality: [] },
      conflicts: characterData.conflicts || { internal: null, external: null },
      relationships: characterData.relationships || [],
      arc: characterData.arc || { start: null, end: null },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setData(prev => ({ ...prev, characters: [...prev.characters, tempCharacter] }));
    
    try {
      const response = await api.character.createCharacter(data.story.id, characterData);
      if (response.error) throw new Error(response.error);
      
      setData(prev => ({
        ...prev,
        characters: optimisticUpdate(prev.characters, response.data!, tempId)
      }));
    } catch (err) {
      setData(prev => ({
        ...prev,
        characters: prev.characters.filter(c => c.id !== tempId)
      }));
      throw err;
    }
  }, [data.story, optimisticUpdate]);

  const updateCharacter = useCallback(async (characterId: string, updates: Partial<Character>) => {
    const originalCharacter = data.characters.find(c => c.id === characterId);
    if (!originalCharacter) return;
    
    setData(prev => ({
      ...prev,
      characters: prev.characters.map(c => 
        c.id === characterId ? { ...c, ...updates } : c
      )
    }));
    
    try {
      await api.character.updateCharacter(characterId, updates);
    } catch (err) {
      setData(prev => ({
        ...prev,
        characters: prev.characters.map(c => 
          c.id === characterId ? originalCharacter : c
        )
      }));
      throw err;
    }
  }, [data.characters]);

  const deleteCharacter = useCallback(async (characterId: string) => {
    const characterToDelete = data.characters.find(c => c.id === characterId);
    if (!characterToDelete) return;
    
    setData(prev => ({
      ...prev,
      characters: prev.characters.filter(c => c.id !== characterId)
    }));
    
    try {
      await api.character.deleteCharacter(characterId);
    } catch (err) {
      setData(prev => ({
        ...prev,
        characters: [...prev.characters, characterToDelete]
      }));
      throw err;
    }
  }, [data.characters]);

  const addScene = useCallback(async (sceneData: Partial<Scene>) => {
    if (!data.story) return;
    
    const tempId = 'temp-' + Date.now();
    const tempScene: Scene = {
      id: tempId,
      story_id: data.story.id,
      title: sceneData.title || 'New Scene',
      type: sceneData.type || 'transition',
      order: data.scenes.length,
      pov_character_id: sceneData.pov_character_id,
      goal: sceneData.goal,
      setting: sceneData.setting || { location: null, time: null, environment: null },
      characters: sceneData.characters || [],
      events: sceneData.events || { main: null, turningPoint: null },
      conflicts: sceneData.conflicts || { internal: null, external: null },
      dialogue: sceneData.dialogue || [],
      background: sceneData.background,
      outcome: sceneData.outcome,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setData(prev => ({ ...prev, scenes: [...prev.scenes, tempScene] }));
    
    try {
      const response = await api.scene.createScene(data.story.id, sceneData);
      if (response.error) throw new Error(response.error);
      
      setData(prev => ({
        ...prev,
        scenes: optimisticUpdate(prev.scenes, response.data!, tempId)
      }));
    } catch (err) {
      setData(prev => ({
        ...prev,
        scenes: prev.scenes.filter(s => s.id !== tempId)
      }));
      throw err;
    }
  }, [data.story, data.scenes.length, optimisticUpdate]);

  const updateScene = useCallback(async (sceneId: string, updates: Partial<Scene>) => {
    const originalScene = data.scenes.find(s => s.id === sceneId);
    if (!originalScene) return;
    
    setData(prev => ({
      ...prev,
      scenes: prev.scenes.map(s => 
        s.id === sceneId ? { ...s, ...updates } : s
      )
    }));
    
    try {
      await api.scene.updateScene(sceneId, updates);
    } catch (err) {
      setData(prev => ({
        ...prev,
        scenes: prev.scenes.map(s => 
          s.id === sceneId ? originalScene : s
        )
      }));
      throw err;
    }
  }, [data.scenes]);

  const deleteScene = useCallback(async (sceneId: string) => {
    const sceneToDelete = data.scenes.find(s => s.id === sceneId);
    if (!sceneToDelete) return;
    
    setData(prev => ({
      ...prev,
      scenes: prev.scenes.filter(s => s.id !== sceneId)
    }));
    
    try {
      await api.scene.deleteScene(sceneId);
    } catch (err) {
      setData(prev => ({
        ...prev,
        scenes: [...prev.scenes, sceneToDelete]
      }));
      throw err;
    }
  }, [data.scenes]);

  const reorderScenes = useCallback(async (sceneIds: string[]) => {
    const originalOrder = data.scenes.map(s => s.id);
    
    // Optimistically update order
    const reorderedScenes = sceneIds.map((id, index) => {
      const scene = data.scenes.find(s => s.id === id);
      return scene ? { ...scene, order: index } : null;
    }).filter(Boolean) as Scene[];
    
    setData(prev => ({ ...prev, scenes: reorderedScenes }));
    
    try {
      await api.scene.reorderScenes(data.story!.id, sceneIds);
    } catch (err) {
      setData(prev => ({ ...prev, scenes: data.scenes }));
      throw err;
    }
  }, [data.story, data.scenes]);

  const updateWriting = useCallback(async (content: string) => {
    if (!data.writingSession) return;
    
    const originalContent = data.writingSession.content;
    setData(prev => ({
      ...prev,
      writingSession: prev.writingSession ? 
        { ...prev.writingSession, content } : null
    }));
    
    try {
      await api.writing.updateWriting(data.writingSession.id, content);
    } catch (err) {
      setData(prev => ({
        ...prev,
        writingSession: prev.writingSession ? 
          { ...prev.writingSession, content: originalContent } : null
      }));
      throw err;
    }
  }, [data.writingSession]);

   return {
     data,
     loading,
     error,
     refetch: loadStoryData,
     updateStory,
     addCharacter,
     updateCharacter,
     deleteCharacter,
     addScene,
     updateScene,
     deleteScene,
     reorderScenes,
     addConflict: async (conflictData: Partial<Conflict>) => {
       if (!data.story) return;
       
       const tempId = 'temp-' + Date.now();
       const tempConflict: Conflict = {
         id: tempId,
         story_id: data.story.id,
         title: conflictData.title || 'New Conflict',
         type: conflictData.type || 'internal',
         description: conflictData.description,
         created_at: new Date().toISOString(),
         updated_at: new Date().toISOString()
       };
       
       setData(prev => ({ ...prev, conflicts: [...prev.conflicts, tempConflict] }));
       
       try {
         const response = await api.conflict.createConflict(data.story.id, conflictData);
         if (response.error) throw new Error(response.error);
         
         setData(prev => ({
           ...prev,
           conflicts: optimisticUpdate(prev.conflicts, response.data!, tempId)
         }));
       } catch (err) {
         setData(prev => ({
           ...prev,
           conflicts: prev.conflicts.filter(c => c.id !== tempId)
         }));
         throw err;
       }
     },
     updateConflict: async (conflictId: string, updates: Partial<Conflict>) => {
       const originalConflict = data.conflicts.find(c => c.id === conflictId);
       if (!originalConflict) return;
       
       setData(prev => ({
         ...prev,
         conflicts: prev.conflicts.map(c => 
           c.id === conflictId ? { ...c, ...updates } : c
         )
       }));
       
       try {
         await api.conflict.updateConflict(conflictId, updates);
       } catch (err) {
         setData(prev => ({
           ...prev,
           conflicts: prev.conflicts.map(c => 
             c.id === conflictId ? originalConflict : c
           )
         }));
         throw err;
       }
     },
     deleteConflict: async (conflictId: string) => {
       const conflictToDelete = data.conflicts.find(c => c.id === conflictId);
       if (!conflictToDelete) return;
       
       setData(prev => ({
         ...prev,
         conflicts: prev.conflicts.filter(c => c.id !== conflictId)
       }));
       
       try {
         await api.conflict.deleteConflict(conflictId);
       } catch (err) {
         setData(prev => ({
           ...prev,
           conflicts: [...prev.conflicts, conflictToDelete]
         }));
         throw err;
       }
     },
     addResource: async (resourceData: Partial<Resource>) => {
       if (!data.story) return;
       
       const tempId = 'temp-' + Date.now();
       const tempResource: Resource = {
         id: tempId,
         story_id: data.story.id,
         type: resourceData.type || 'note',
         title: resourceData.title || 'New Resource',
         content: resourceData.content,
         url: resourceData.url,
         file_path: resourceData.file_path,
         linked_entities: {
           characters: [],
           scenes: [],
           conflicts: [],
           worldSettings: []
         },
         created_at: new Date().toISOString(),
         updated_at: new Date().toISOString()
       };
       
       setData(prev => ({ ...prev, resources: [...prev.resources, tempResource] }));
       
       try {
         const response = await api.resource.createResource(data.story.id, {
           ...resourceData,
           linked_entities: {
             characters: [],
             scenes: [],
             conflicts: [],
             worldSettings: []
           }
         });
         if (response.error) throw new Error(response.error);
         
         setData(prev => ({
           ...prev,
           resources: optimisticUpdate(prev.resources, response.data!, tempId)
         }));
       } catch (err) {
         setData(prev => ({
           ...prev,
           resources: prev.resources.filter(r => r.id !== tempId)
         }));
         throw err;
       }
     },
     updateResource: async (resourceId: string, updates: Partial<Resource>) => {
       const originalResource = data.resources.find(r => r.id === resourceId);
       if (!originalResource) return;
       
       setData(prev => ({
         ...prev,
         resources: prev.resources.map(r => 
           r.id === resourceId ? { ...r, ...updates } : r
         )
       }));
       
       try {
         await api.resource.updateResource(resourceId, updates);
       } catch (err) {
         setData(prev => ({
           ...prev,
           resources: prev.resources.map(r => 
             r.id === resourceId ? originalResource : r
           )
         }));
         throw err;
       }
     },
     deleteResource: async (resourceId: string) => {
       const resourceToDelete = data.resources.find(r => r.id === resourceId);
       if (!resourceToDelete) return;
       
       setData(prev => ({
         ...prev,
         resources: prev.resources.filter(r => r.id !== resourceId)
       }));
       
       try {
         await api.resource.deleteResource(resourceId);
       } catch (err) {
         setData(prev => ({
           ...prev,
           resources: [...prev.resources, resourceToDelete]
         }));
         throw err;
       }
     }
   };
};