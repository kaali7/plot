// API service layer for Unified Story Dashboard
// Based on the complete specification from unified-story-dashboard.md
import { supabase } from './supabase';
import type { Database } from '../types/story.types';
import { getCurrentUserId } from './auth-helpers';
import { sanitizeError } from './error-mapper';
import { logger } from './logger';

type Story = Database['public']['Tables']['stories']['Row'];
type Conflict = Database['public']['Tables']['conflicts']['Row'];
type Character = Database['public']['Tables']['characters']['Row'];
type Scene = Database['public']['Tables']['scenes']['Row'];
type Resource = Database['public']['Tables']['resources']['Row'];

// Helper function for API responses
const handleResponse = async <T>(promise: PromiseLike<any>): Promise<{ data: T | null; error: string | null }> => {
  try {
    const { data, error } = await promise;
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    // Log the actual error for developers
    logger.error('API Error:', error);
    // Return a sanitized message for the user
    return { data: null, error: sanitizeError(error) };
  }
};

// Story Foundation API
export const storyAPI = {
  // Get complete story with nested data
  getFullStory: async (storyId: string) => {
    const userId = await getCurrentUserId();
    
    const storyResponse = await handleResponse(
      supabase.from('stories').select('*').eq('id', storyId).eq('user_id', userId).single()
    );
    
    if (storyResponse.error || !storyResponse.data) return storyResponse;
    
    // Fetch related data
    const [charactersResponse, scenesResponse, conflictsResponse, resourcesResponse, writingResponse] = await Promise.all([
      handleResponse(supabase.from('characters').select('*').eq('story_id', storyId)),
      handleResponse(supabase.from('scenes').select('*').eq('story_id', storyId).order('order')),
      handleResponse(supabase.from('conflicts').select('*').eq('story_id', storyId)),
      handleResponse(supabase.from('resources').select('*').eq('story_id', storyId)),
      handleResponse(supabase.from('writing_sessions').select('*').eq('story_id', storyId).maybeSingle())
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
  updateStoryBasics: async (storyId: string, updates: Partial<Pick<Story, 'name' | 'theme' | 'description'>>) => {
    const userId = await getCurrentUserId();
    return handleResponse(
      supabase.from('stories').update(updates).eq('id', storyId).eq('user_id', userId)
    );
  },
  
  // Update world settings
  updateWorldSettings: async (storyId: string, worldSettings: Story['world_settings']) => {
    const userId = await getCurrentUserId();
    return handleResponse(
      supabase.from('stories').update({ world_settings: worldSettings }).eq('id', storyId).eq('user_id', userId)
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
      ]).select().single()
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
    const { resources: characterResources, ...data } = characterData as any;
    
    const result = await handleResponse<Character>(
      supabase.from('characters').insert([
        {
          ...data,
          story_id: storyId
        }
      ]).select().single()
    );

    if (result.data && characterResources?.length) {
      for (const resourceId of characterResources) {
        await resourceAPI.linkResourceToEntity(resourceId, 'characters', result.data.id);
      }
    }

    return result;
  },
  
  // Get character
  getCharacter: async (characterId: string) => {
    return handleResponse(
      supabase.from('characters').select('*').eq('id', characterId).single()
    );
  },
  
  // Update character
  updateCharacter: async (characterId: string, updates: Partial<Omit<Character, 'id' | 'story_id' | 'created_at'>>) => {
    const { resources: characterResources, ...data } = updates as any;
    
    const result = await handleResponse(
      supabase.from('characters').update(data).eq('id', characterId)
    );

    // Diff-based resource link management
    if (characterResources !== undefined) {
      const newIds: string[] = characterResources || [];
      
      // Fetch currently linked resources for this character
      const { data: allResources } = await supabase
        .from('resources')
        .select('id, linked_entities')
        .contains('linked_entities', { characters: [characterId] });
      
      const currentlyLinked = (allResources || []).map(r => r.id);
      
      // Unlink removed resources
      const toUnlink = currentlyLinked.filter(id => !newIds.includes(id));
      for (const resourceId of toUnlink) {
        await resourceAPI.unlinkResourceFromEntity(resourceId, 'characters', characterId);
      }
      
      // Link newly added resources
      const toLink = newIds.filter(id => !currentlyLinked.includes(id));
      for (const resourceId of toLink) {
        await resourceAPI.linkResourceToEntity(resourceId, 'characters', characterId);
      }
    }

    return result;
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
    const { resources: sceneResources, ...data } = sceneData as any;
    
    const result = await handleResponse<Scene>(
      supabase.from('scenes').insert([
        {
          ...data,
          story_id: storyId
        }
      ]).select().single()
    );

    if (result.data && sceneResources?.length) {
      for (const resourceId of sceneResources) {
        await resourceAPI.linkResourceToEntity(resourceId, 'scenes', result.data.id);
      }
    }

    return result;
  },
  
  // Get scene
  getScene: async (sceneId: string) => {
    return handleResponse(
      supabase.from('scenes').select('*').eq('id', sceneId).single()
    );
  },
  
  // Update scene
  updateScene: async (sceneId: string, updates: Partial<Omit<Scene, 'id' | 'story_id' | 'created_at'>>) => {
    const { resources: sceneResources, ...data } = updates as any;
    
    const result = await handleResponse(
      supabase.from('scenes').update(data).eq('id', sceneId)
    );

    // Diff-based resource link management
    if (sceneResources !== undefined) {
      const newIds: string[] = sceneResources || [];
      
      // Fetch currently linked resources for this scene
      const { data: allResources } = await supabase
        .from('resources')
        .select('id, linked_entities')
        .contains('linked_entities', { scenes: [sceneId] });
      
      const currentlyLinked = (allResources || []).map(r => r.id);
      
      // Unlink removed resources
      const toUnlink = currentlyLinked.filter(id => !newIds.includes(id));
      for (const resourceId of toUnlink) {
        await resourceAPI.unlinkResourceFromEntity(resourceId, 'scenes', sceneId);
      }
      
      // Link newly added resources
      const toLink = newIds.filter(id => !currentlyLinked.includes(id));
      for (const resourceId of toLink) {
        await resourceAPI.linkResourceToEntity(resourceId, 'scenes', sceneId);
      }
    }

    return result;
  },
  
  // Delete scene
  deleteScene: async (sceneId: string) => {
    return handleResponse(
      supabase.from('scenes').delete().eq('id', sceneId)
    );
  },
  
  // Reorder scenes
  reorderScenes: async (storyId: string, sceneIds: string[]) => {
    return handleResponse(
      supabase.rpc('reorder_scenes', {
        p_story_id: storyId,
        p_new_order: sceneIds
      })
    );
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
      ]).select().single()
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
      supabase.from('writing_sessions').select('*').eq('story_id', storyId).maybeSingle()
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
      ]).select().single()
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

const ALLOWED_MIME_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
  'application/pdf', 'text/plain', 'text/markdown',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Storage API
export const storageAPI = {
  uploadFile: async (bucket: string, path: string, file: File) => {
    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return { data: null, error: `File type "${file.type}" is not allowed. Accepted: images, PDFs, text documents.` };
    }
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return { data: null, error: `File exceeds maximum size of 10MB.` };
    }
    return handleResponse(
      supabase.storage.from(bucket).upload(path, file, {
        upsert: true
      })
    );
  },
  
  getPublicUrl: (bucket: string, path: string) => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }
};

export default {
  story: storyAPI,
  conflict: conflictAPI,
  character: characterAPI,
  scene: sceneAPI,
  resource: resourceAPI,
  writing: writingAPI,
  storage: storageAPI
};