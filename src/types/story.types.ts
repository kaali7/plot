// TypeScript interfaces for Unified Story Dashboard
// Based on the complete specification from unified-story-dashboard.md

export interface Story {
  id: string;
  user_id: string;
  name: string;
  theme?: string;
  description?: string;
  world_settings: WorldSettings;
  created_at: string;
  updated_at: string;
}

export interface WorldSettings {
  locations: string[];
  timePeriod?: string;
  atmosphere?: string;
  environmentDescription?: string;
  linkedResources: string[];
}

export interface Conflict {
  id: string;
  story_id: string;
  title: string;
  type: 'internal' | 'external' | 'society';
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Character {
  id: string;
  story_id: string;
  name: string;
  role: 'protagonist' | 'antagonist' | 'supporting' | 'minor';
  description?: string;
  image_url?: string;
  motivation: {
    goal?: string;
    fear?: string;
    desire?: string;
  };
  traits: {
    strengths: string[];
    weaknesses: string[];
    personality: string[];
  };
  conflicts: {
    internal?: string;
    external?: string;
  };
  relationships: Relationship[];
  arc: {
    start?: string;
    end?: string;
  };
  resources: string[];
  created_at: string;
  updated_at: string;
}

export interface Relationship {
  characterId: string;
  type: 'friend' | 'rival' | 'mentor' | 'enemy' | 'family' | 'romantic';
  description?: string;
}

export interface Scene {
  id: string;
  story_id: string;
  title: string;
  type: 'action' | 'dialogue' | 'suspense' | 'transition' | 'climax';
  order: number;
  pov_character_id?: string;
  goal?: string;
  setting: {
    location?: string;
    time?: string;
    environment?: string;
  };
  characters: SceneCharacter[];
  events: {
    main?: string;
    turningPoint?: string;
  };
  conflicts: {
    internal?: string;
    external?: string;
  };
  dialogue: Dialogue[];
  background?: string;
  outcome?: string;
  created_at: string;
  updated_at: string;
}

export interface SceneCharacter {
  characterId: string;
  role: 'lead' | 'support' | 'antagonist' | 'background';
}

export interface Dialogue {
  characterId: string;
  content: string;
  order: number;
  type?: 'dialogue' | 'action';
}

export interface Resource {
  id: string;
  story_id: string;
  type: 'link' | 'note' | 'image' | 'document' | 'other';
  title: string;
  content?: string;
  url?: string;
  file_path?: string;
  linked_entities: {
    characters: string[];
    scenes: string[];
    conflicts: string[];
    worldSettings: string[];
  };
  created_at: string;
  updated_at: string;
}

export interface WritingSession {
  id: string;
  story_id: string;
  content: string;
  version: number;
  format: 'markdown' | 'rich-text' | 'plain';
  created_at: string;
  updated_at: string;
}

export interface WritingVersion {
  id: string;
  writing_session_id: string;
  content: string;
  version: number;
  format: 'markdown' | 'rich-text' | 'plain';
  created_at: string;
}

// Database table types for Supabase

export type Database = {
  public: {
    Tables: {
      stories: {
        Row: Story;
        Insert: Omit<Story, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Story, 'id' | 'created_at' | 'user_id'>> & {
          updated_at?: string;
        };
      };
      conflicts: {
        Row: Conflict;
        Insert: Omit<Conflict, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Conflict, 'id' | 'created_at' | 'story_id'>> & {
          updated_at?: string;
        };
      };
      characters: {
        Row: Character;
        Insert: Omit<Character, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Character, 'id' | 'created_at' | 'story_id'>> & {
          updated_at?: string;
        };
      };
      scenes: {
        Row: Scene;
        Insert: Omit<Scene, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Scene, 'id' | 'created_at' | 'story_id'>> & {
          updated_at?: string;
        };
      };
      resources: {
        Row: Resource;
        Insert: Omit<Resource, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Resource, 'id' | 'created_at' | 'story_id'>> & {
          updated_at?: string;
        };
      };
      writing_sessions: {
        Row: WritingSession;
        Insert: Omit<WritingSession, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<WritingSession, 'id' | 'created_at' | 'story_id'>> & {
          updated_at?: string;
        };
      };
      writing_versions: {
        Row: WritingVersion;
        Insert: Omit<WritingVersion, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<WritingVersion, 'id' | 'created_at' | 'writing_session_id'>>;
      };
    };
  };
};

// API response types
export interface APIResponse<T = any> {
  data: T | null;
  error: string | null;
  status: number;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Form data types for UI components
export interface CharacterFormData {
  name: string;
  role: Character['role'];
  description?: string;
  image_url?: string;
  motivation: Character['motivation'];
  traits: Character['traits'];
  conflicts: Character['conflicts'];
  relationships: Character['relationships'];
  arc: Character['arc'];
}

export interface SceneFormData {
  title: string;
  type: Scene['type'];
  order: number;
  pov_character_id?: string;
  goal?: string;
  setting: Scene['setting'];
  characters: Scene['characters'];
  events: Scene['events'];
  conflicts: Scene['conflicts'];
  dialogue: Scene['dialogue'];
  background?: string;
  outcome?: string;
}

export interface ResourceFormData {
  type: Resource['type'];
  title: string;
  content?: string;
  url?: string;
  file_path?: string;
}

// UI state types
export interface DashboardState {
  activeTab: 'overview' | 'characters' | 'scenes' | 'writing' | 'resources';
  selectedCharacter?: string;
  selectedScene?: string;
  selectedConflict?: string;
  editingResource?: string;
  isWritingMode: boolean;
}

export interface WritingState {
  content: string;
  isSaving: boolean;
  lastSaved: Date | null;
  version: number;
  referencePanelOpen: boolean;
}

// Emotion-based tagging system
export type EmotionType = 'danger' | 'calm' | 'highlight' | 'info';

export interface EmotionTag {
  type: EmotionType;
  label: string;
  description?: string;
}

// Export formats
export type ExportFormat = 'pdf' | 'epub' | 'markdown' | 'fountain';