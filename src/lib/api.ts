// API service layer for Unified Story Dashboard
// Based on the complete specification from unified-story-dashboard.md
import { supabase } from './supabase';
import type { Database } from '../types/story.types';

type Story = Database['public']['Tables']['stories']['Row'];
type Conflict = Database['public']['Tables']['conflicts']['Row'];
type Character = Database['public']['Tables']['characters']['Row'];
type Scene = Database['public']['Tables']['scenes']['Row'];
type Resource = Database['public']['Tables']['resources']['Row'];
type WritingSession = Database['public']['Tables']['writing_sessions']['Row'];
type WritingVersion = Database['public']['Tables']['writing_versions']['Row'];

// Helper function for API responses
const handleResponse = async <T>(promise: Promise<any>): Promise<{ data: T | null; error: string | null }> => {
  try {
    const { data, error } = await promise;
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Story Foundation API
export const storyAPI = {
  // Get complete story with nested data
  getFullStory: async (storyId: string) => {
    const storyResponse = await handleResponse(
      supabase.from('stories').select('*').eq('id', storyId).single()
    );
    
    if (storyResponse.error || !storyResponse.data) return storyResponse;
    
    // Fetch related data
    const [charactersResponse, scenesResponse, conflictsResponse, resourcesResponse, writingResponse] = await Promise.all([
      handleResponse(supabase.from('characters').select('*').eq('story_id', storyId)),
      handleResponse(supabase.from('scenes').select('*').eq('story_id', storyId).order('order')),
      handleResponse(supabase.from('conflicts').select('*').eq('story_id', storyId)),
      handleResponse(supabase.from('resources').select('*').eq('story_id', storyId)),
      handleResponse(supabase.from('writing_sessions').select('*').eq('story_id', storyId).single())
    ]);
    
    return {
      data: {
        ...storyResponse.data,
        characters: charactersResponse.data || [],
        scenes: scenesResponse.data || [],
        conflicts: conflictsResponse.data || [],
        resources: resourcesResponse.data || [],
        writingSession: writingResponse.data || null
      },
      error: null
    };
  },
  
  // Update story basics
  updateStoryBasics: async (storyId: string, updates: Partial<Pick<Story, 'title' | 'theme' | 'description'>>) => {
    return handleResponse(
      supabase.from('stories').update(updates).eq('id', storyId)
    );
  },
  
  // Update world settings
  updateWorldSettings: async (storyId: string, worldSettings: Story['world_settings']) => {
    return handleResponse(
      supabase.from('stories').update({ world_settings: worldSettings }).eq('id', storyId)
    );
  }
};

// Conflict API
export const conflictAPI = {
  // List all conflicts for a story
  listConflicts: async (storyId: string) => {
    return handleResponse(
      supabase.from('conflicts').select('*').eq('story_id', storyId)
    );
  },
  
  // Create new conflict
  createConflict: async (storyId: string, conflictData: Omit<Conflict, 'id' | 'story_id' | 'created_at' | 'updated_at'>) => {
    return handleResponse(
      supabase.from('conflicts').insert([
        {
          ...conflictData,
          story_id: storyId
        }
      ]).single()
    );
  },
  
  // Get specific conflict
  getConflict: async (conflictId: string) => {
    return handleResponse(
      supabase.from('conflicts').select('*').eq('id', conflictId).single()
    );
  },
  
  // Update conflict
  updateConflict: async (conflictId: string, updates: Partial<Omit<Conflict, 'id' | 'story_id' | 'created_at'>>) => {
    return handleResponse(
      supabase.from('conflicts').update(updates).eq('id', conflictId)
    );
  },
  
  // Delete conflict
  deleteConflict: async (conflictId: string) => {
    return handleResponse(
      supabase.from('conflicts').delete().eq('id', conflictId)
    );
  }
};

// Character API
export const characterAPI = {
  // List all characters for a story
  listCharacters: async (storyId: string) => {
    return handleResponse(
      supabase.from('characters').select('*').eq('story_id', storyId)
    );
  },
  
  // Create character
  createCharacter: async (storyId: string, characterData: Omit<Character, 'id' | 'story_id' | 'created_at' | 'updated_at'>) => {
    return handleResponse(
      supabase.from('characters').insert([
        {
          ...characterData,
          story_id: storyId
        }
      ]).single()
    );
  },
  
  // Get character
  getCharacter: async (characterId: string) => {
    return handleResponse(
      supabase.from('characters').select('*').eq('id', characterId).single()
    );
  },
  
  // Update character
  updateCharacter: async (characterId: string, updates: Partial<Omit<Character, 'id' | 'story_id' | 'created_at'>>) => {
    return handleResponse(
      supabase.from('characters').update(updates).eq('id', characterId)
    );
  },
  
  // Delete character
  deleteCharacter: async (characterId: string) => {
    return handleResponse(
      supabase.from('characters').delete().eq('id', characterId)
    );
  }
};

// Scene API
export const sceneAPI = {
  // List all scenes for a story
  listScenes: async (storyId: string) => {
    return handleResponse(
      supabase.from('scenes').select('*').eq('story_id', storyId).order('order')
    );
  },
  
  // Create scene
  createScene: async (storyId: string, sceneData: Omit<Scene, 'id' | 'story_id' | 'created_at' | 'updated_at'>) => {
    return handleResponse(
      supabase.from('scenes').insert([
        {
          ...sceneData,
          story_id: storyId
        }
      ]).single()
    );
  },
  
  // Get scene
  getScene: async (sceneId: string) => {
    return handleResponse(
      supabase.from('scenes').select('*').eq('id', sceneId).single()
    );
  },
  
  // Update scene
  updateScene: async (sceneId: string, updates: Partial<Omit<Scene, 'id' | 'story_id' | 'created_at'>>) => {
    return handleResponse(
      supabase.from('scenes').update(updates).eq('id', sceneId)
    );
  },
  
  // Delete scene
  deleteScene: async (sceneId: string) => {
    return handleResponse(
      supabase.from('scenes').delete().eq('id', sceneId)
    );
  },
  
  // Reorder scenes
  reorderScenes: async (storyId: string, sceneIds: string[]) => {
    const updates = sceneIds.map((id, index) => ({
      id,
      order: index
    }));
    
    // Using Supabase's update with filter
    const { data, error } = await supabase
      .from('scenes')
      .update({ order: 0 }) // Reset first
      .eq('story_id', storyId);
    
    if (error) return { data: null, error: error.message };
    
    // Then update each scene with correct order
    const promises = sceneIds.map((id, index) =>
      supabase.from('scenes').update({ order: index }).eq('id', id)
    );
    
    const results = await Promise.all(promises);
    const errors = results.map(r => r.error).filter(Boolean);
    
    if (errors.length > 0) {
      return { data: null, error: errors[0].message };
    }
    
    return { data: sceneIds, error: null };
  }
};

// Resource API
export const resourceAPI = {
  // List all resources for a story
  listResources: async (storyId: string) => {
    return handleResponse(
      supabase.from('resources').select('*').eq('story_id', storyId)
    );
  },
  
  // Create resource
  createResource: async (storyId: string, resourceData: Omit<Resource, 'id' | 'story_id' | 'created_at' | 'updated_at'>) => {
    return handleResponse(
      supabase.from('resources').insert([
        {
          ...resourceData,
          story_id: storyId,
          linked_entities: {
            characters: [],
            scenes: [],
            conflicts: [],
            worldSettings: []
          }
        }
      ]).single()
    );
  },
  
  // Get resource
  getResource: async (resourceId: string) => {
    return handleResponse(
      supabase.from('resources').select('*').eq('id', resourceId).single()
    );
  },
  
  // Update resource
  updateResource: async (resourceId: string, updates: Partial<Omit<Resource, 'id' | 'story_id' | 'created_at'>>) => {
    return handleResponse(
      supabase.from('resources').update(updates).eq('id', resourceId)
    );
  },
  
  // Delete resource
  deleteResource: async (resourceId: string) => {
    return handleResponse(
      supabase.from('resources').delete().eq('id', resourceId)
    );
  },
  
  // Link resource to entity
  linkResourceToEntity: async (resourceId: string, entityType: 'characters' | 'scenes' | 'conflicts' | 'worldSettings', entityId: string) => {
    return handleResponse(
      supabase.rpc('link_resource_to_entity', {
        resource_id: resourceId,
        entity_type: entityType,
        entity_id: entityId
      })
    );
  },
  
  // Unlink resource from entity
  unlinkResourceFromEntity: async (resourceId: string, entityType: 'characters' | 'scenes' | 'conflicts' | 'worldSettings', entityId: string) => {
    return handleResponse(
      supabase.rpc('unlink_resource_from_entity', {
        resource_id: resourceId,
        entity_type: entityType,
        entity_id: entityId
      })
    );
  }
};

// Writing API
export const writingAPI = {
  // Get writing session for a story
  getWritingSession: async (storyId: string) => {
    return handleResponse(
      supabase.from('writing_sessions').select('*').eq('story_id', storyId).single()
    );
  },
  
  // Update writing content
  updateWriting: async (sessionId: string, content: string) => {
    return handleResponse(
      supabase.from('writing_sessions').update({ content }).eq('id', sessionId)
    );
  },
  
  // Create new writing session
  createWritingSession: async (storyId: string, initialContent: string = '') => {
    return handleResponse(
      supabase.from('writing_sessions').insert([
        {
          story_id: storyId,
          content: initialContent,
          version: 1
        }
      ]).single()
    );
  },
  
  // Get version history
  getWritingVersions: async (sessionId: string) => {
    return handleResponse(
      supabase.from('writing_versions')
        .select('*')
        .eq('writing_session_id', sessionId)
        .order('version', { ascending: false })
    );
  },
  
  // Save version
  saveVersion: async (sessionId: string, content: string, version: number) => {
    return handleResponse(
      supabase.from('writing_versions').insert([
        {
          writing_session_id: sessionId,
          content,
          version
        }
      ])
    );
  }
};

// RPC Functions (these would need to be created in Supabase)
export const rpcAPI = {
  // Link resource to entity (needs to be created in Supabase)
  linkResourceToEntity: async (resourceId: string, entityType: string, entityId: string) => {
    return handleResponse(
      supabase.rpc('link_resource_to_entity', {
        resource_id: resourceId,
        entity_type: entityType,
        entity_id: entityId
      })
    );
  },
  
  // Reorder scenes (needs to be created in Supabase)
  reorderScenes: async (storyId: string, newOrder: string[]) => {
    return handleResponse(
      supabase.rpc('reorder_scenes', {
        story_id: storyId,
        new_order: newOrder
      })
    );
  }
};

export default {
  story: storyAPI,
  conflict: conflictAPI,
  character: characterAPI,
  scene: sceneAPI,
  resource: resourceAPI,
  writing: writingAPI,
  rpc: rpcAPI
};