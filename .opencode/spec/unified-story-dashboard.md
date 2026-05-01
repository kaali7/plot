# Complete Feature Specification: Unified Story Dashboard

## 1. Problem Statement
Writers need a cohesive environment that integrates story planning, character development, scene creation, and writing into a single unified workspace. Current solutions force context switching between fragmented tools, breaking creative flow and making it difficult to maintain story coherence across multiple interrelated components.

**Target Users**: Fiction writers, scriptwriters, content creators, and storytellers who develop structured narratives with complex character relationships and scene progression.

**Expected Outcome**: A single dashboard that seamlessly integrates story foundation elements, character management, scene building, and writing mode while maintaining the dark-purple gradient design system and existing technical infrastructure.

## 2. Functional Requirements

### Core Features
1. **Unified Story Overview**
   - Integrated story basics (title, theme, description) with world settings
   - Conflict builder with type categorization and resource linking
   - Global resource management with cross-entity attachment system
   - Tab-based navigation between foundation elements

2. **Enhanced Character Management**
   - Comprehensive character creation with 6 structured sections
   - Emotion-based tagging system using purple theme colors
   - Visual relationship mapping between characters
   - Character-specific resource attachments and inspiration tracking

3. **Advanced Scene Builder**
   - Scene creation with 8 structural components
   - Integrated dialogue system with character assignment
   - Scene conflict mapping and outcome tracking
   - Visual inspiration and reference attachment
   - Drag-and-drop scene reordering

4. **Writing Mode Integration**
   - Distraction-free editor with context-aware references
   - Real-time autosave with version history
   - Character and scene reference linking
   - Export-ready formatting for multiple output formats

### User Flows
1. **Story Creation Flow**: Create story → Dashboard → Build foundation → Develop characters → Construct scenes → Write narrative
2. **Context Switching Flow**: Writing mode → Click reference → Modal detail view → Return to writing
3. **Resource Management Flow**: Attach resource → Global panel → Multi-entity linking → Contextual display

### Input/Output
- **Input**: Structured JSON forms for all entity types
- **Output**: Relational PostgreSQL data with proper foreign keys
- **Visual**: Dark-purple theme, rounded components, emotion-color coding

## 3. API Contracts

### Complete RESTful API Structure
```
# Story Foundation Endpoints
GET    /api/stories/{id}                    # Complete story with nested data
PUT    /api/stories/{id}                    # Update story basics

# Overview Section
GET    /api/stories/{id}/overview           # Get overview data
PUT    /api/stories/{id}/overview           # Update overview

# World Settings
GET    /api/stories/{id}/world-settings     # Get world settings
PUT    /api/stories/{id}/world-settings     # Update world settings

# Conflicts Management
GET    /api/stories/{id}/conflicts          # List all conflicts
POST   /api/stories/{id}/conflicts          # Create new conflict
GET    /api/stories/{id}/conflicts/{cid}    # Get specific conflict
PUT    /api/stories/{id}/conflicts/{cid}    # Update conflict
DELETE /api/stories/{id}/conflicts/{cid}    # Delete conflict

# Characters Management
GET    /api/stories/{id}/characters         # List characters
POST   /api/stories/{id}/characters         # Create character
GET    /api/stories/{id}/characters/{cid}   # Get character
PUT    /api/stories/{id}/characters/{cid}   # Update character
DELETE /api/stories/{id}/characters/{cid}   # Delete character

# Scenes Management
GET    /api/stories/{id}/scenes             # List scenes
POST   /api/stories/{id}/scenes             # Create scene
GET    /api/stories/{id}/scenes/{sid}       # Get scene
PUT    /api/stories/{id}/scenes/{sid}       # Update scene
DELETE /api/stories/{id}/scenes/{sid}       # Delete scene
PUT    /api/stories/{id}/scenes/order       # Reorder scenes

# Resources Management
GET    /api/stories/{id}/resources          # List resources
POST   /api/stories/{id}/resources          # Create resource
GET    /api/stories/{id}/resources/{rid}    # Get resource
PUT    /api/stories/{id}/resources/{rid}    # Update resource
DELETE /api/stories/{id}/resources/{rid}    # Delete resource

# Writing Mode
GET    /api/stories/{id}/writing            # Get writing content
PUT    /api/stories/{id}/writing            # Update writing content
GET    /api/stories/{id}/writing/versions   # Get version history
```

### Complete TypeScript Interfaces
```typescript
// Story Foundation
interface Story {
  id: string;
  title: string;
  theme?: string;
  description?: string;
  worldSettings: WorldSettings;
  createdAt: string;
  updatedAt: string;
}

interface WorldSettings {
  timePeriod?: string;
  locations: string[];
  atmosphere?: string;
  environmentDescription?: string;
  linkedResources: string[];  // Resource IDs linked to world settings
}

interface Conflict {
  id: string;
  title: string;
  type: 'internal' | 'external' | 'society';
  description: string;
  linkedResources: string[];
}

// Character Management
interface Character {
  id: string;
  name: string;
  role: 'main' | 'sub-main' | 'supporting' | 'antagonist';
  description?: string;
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
}

interface Relationship {
  characterId: string;
  type: 'friend' | 'rival' | 'mentor' | 'enemy' | 'family' | 'romantic';
  description?: string;
}

// Scene Building
interface Scene {
  id: string;
  title: string;
  type: 'introduction' | 'conflict' | 'climax' | 'resolution' | 'transition';
  order: number;
  povCharacterId?: string;
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
  resources: string[];
}

interface SceneCharacter {
  characterId: string;
  role: 'lead' | 'support' | 'antagonist' | 'background';
}

interface Dialogue {
  characterId: string;
  content: string;
  order: number;
}

// Resources
interface Resource {
  id: string;
  type: 'url' | 'note' | 'image' | 'reference' | 'inspiration';
  title: string;
  content?: string;
  url?: string;
  filePath?: string;
  linkedEntities: {
    stories?: string[];
    characters?: string[];
    scenes?: string[];
    conflicts?: string[];
  };
}

// Writing Mode
interface WritingSession {
  id: string;
  storyId: string;
  content: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}
```

## 4. Complete Database Schema

### PostgreSQL Schema with RLS
```sql
-- Stories Table (Basic Info + World Settings)
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL CHECK (char_length(title) > 0),
  theme TEXT,
  description TEXT,
  
  -- World Settings (JSONB for flexibility)
  world_settings JSONB DEFAULT '{"locations": [], "timePeriod": null, "atmosphere": null, "environmentDescription": null, "linkedResources": []}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- RLS Policies
  CONSTRAINT stories_owner_check CHECK (auth.uid() = user_id)
);

ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access own stories" 
  ON stories FOR ALL USING (auth.uid() = user_id);

-- Conflicts Table
CREATE TABLE conflicts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(title) > 0),
  type TEXT NOT NULL CHECK (type IN ('internal', 'external', 'society')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE conflicts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access own story conflicts" 
  ON conflicts FOR ALL USING (
    EXISTS (SELECT 1 FROM stories WHERE stories.id = conflicts.story_id AND stories.user_id = auth.uid())
  );

-- Characters Table (Enhanced with all PRD fields)
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (char_length(name) > 0),
  role TEXT NOT NULL DEFAULT 'supporting' CHECK (role IN ('main', 'sub-main', 'supporting', 'antagonist')),
  description TEXT,
  
  -- Structured fields as JSONB
  motivation JSONB DEFAULT '{"goal": null, "fear": null, "desire": null}',
  traits JSONB DEFAULT '{"strengths": [], "weaknesses": [], "personality": []}',
  conflicts JSONB DEFAULT '{"internal": null, "external": null}',
  relationships JSONB DEFAULT '[]',
  arc JSONB DEFAULT '{"start": null, "end": null}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access own story characters" 
  ON characters FOR ALL USING (
    EXISTS (SELECT 1 FROM stories WHERE stories.id = characters.story_id AND stories.user_id = auth.uid())
  );

-- Scenes Table
CREATE TABLE scenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(title) > 0),
  type TEXT NOT NULL DEFAULT 'transition' CHECK (type IN ('introduction', 'conflict', 'climax', 'resolution', 'transition')),
  "order" INTEGER NOT NULL DEFAULT 0,
  
  -- Scene components as JSONB
  pov_character_id UUID REFERENCES characters,
  goal TEXT,
  setting JSONB DEFAULT '{"location": null, "time": null, "environment": null}',
  characters JSONB DEFAULT '[]',
  events JSONB DEFAULT '{"main": null, "turningPoint": null}',
  conflicts JSONB DEFAULT '{"internal": null, "external": null}',
  dialogue JSONB DEFAULT '[]',
  background TEXT,
  outcome TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE scenes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access own story scenes" 
  ON scenes FOR ALL USING (
    EXISTS (SELECT 1 FROM stories WHERE stories.id = scenes.story_id AND stories.user_id = auth.uid())
  );

-- Resources Table
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('url', 'note', 'image', 'reference', 'inspiration')),
  title TEXT NOT NULL CHECK (char_length(title) > 0),
  content TEXT,
  url TEXT,
  file_path TEXT,
  
  -- Tracking which entities use this resource
  linked_entities JSONB DEFAULT '{"characters": [], "scenes": [], "conflicts": [], "worldSettings": []}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access own story resources" 
  ON resources FOR ALL USING (
    EXISTS (SELECT 1 FROM stories WHERE stories.id = resources.story_id AND stories.user_id = auth.uid())
  );

-- Writing Sessions Table
CREATE TABLE writing_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories ON DELETE CASCADE,
  content TEXT NOT NULL DEFAULT '',
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE writing_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access own writing sessions" 
  ON writing_sessions FOR ALL USING (
    EXISTS (SELECT 1 FROM stories WHERE stories.id = writing_sessions.story_id AND stories.user_id = auth.uid())
  );

-- Version History Table
CREATE TABLE writing_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  writing_session_id UUID REFERENCES writing_sessions ON DELETE CASCADE,
  content TEXT NOT NULL,
  version INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE writing_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access own writing versions" 
  ON writing_versions FOR ALL USING (
    EXISTS (
      SELECT 1 FROM writing_sessions ws
      JOIN stories s ON ws.story_id = s.id
      WHERE ws.id = writing_versions.writing_session_id AND s.user_id = auth.uid()
    )
  );
```

### Database Indexes for Performance
```sql
-- Performance optimization indexes
CREATE INDEX idx_stories_user_id ON stories(user_id);
CREATE INDEX idx_characters_story_id ON characters(story_id);
CREATE INDEX idx_scenes_story_id ON scenes(story_id);
CREATE INDEX idx_scenes_order ON scenes(story_id, "order");
CREATE INDEX idx_conflicts_story_id ON conflicts(story_id);
CREATE INDEX idx_resources_story_id ON resources(story_id);
CREATE INDEX idx_writing_sessions_story_id ON writing_sessions(story_id);
```

## 5. Frontend Architecture

### Component Hierarchy Structure
```
src/
├── components/
│   ├── dashboard/
│   │   ├── UnifiedStoryDashboard.tsx           # Main container
│   │   ├── DashboardHeader.tsx                 # Story title + actions
│   │   ├── NavigationTabs.tsx                  # Section switching
│   │   ├── OverviewSection/                    # Story foundation
│   │   │   ├── BasicInfoPanel.tsx
│   │   │   ├── WorldSettingsPanel.tsx
│   │   │   ├── ConflictBuilder.tsx
│   │   │   └── ConflictCard.tsx
│   │   ├── CharacterSection/                   # Character management
│   │   │   ├── CharacterGrid.tsx
│   │   │   ├── CharacterCard.tsx
│   │   │   ├── CharacterModal.tsx
│   │   │   ├── RelationshipGraph.tsx
│   │   │   └── EmotionTag.tsx
│   │   ├── SceneSection/                       # Scene building
│   │   │   ├── SceneList.tsx
│   │   │   ├── SceneCard.tsx
│   │   │   ├── SceneModal.tsx
│   │   │   ├── DialogueBuilder.tsx
│   │   │   └── SceneReorder.tsx
│   │   ├── WritingSection/                     # Writing mode
│   │   │   ├── WritingEditor.tsx
│   │   │   ├── EditorToolbar.tsx
│   │   │   ├── ReferencePanel.tsx
│   │   │   └── VersionHistory.tsx
│   │   └── ResourcesSection/                   # Global resources
│   │       ├── ResourceManager.tsx
│   │       ├── ResourceCard.tsx
│   │       ├── ResourceModal.tsx
│   │       └── ResourceLinker.tsx
│   ├── forms/
│   │   ├── CharacterForm/                      # Multi-section form
│   │   │   ├── BasicInfoForm.tsx
│   │   │   ├── MotivationForm.tsx
│   │   │   ├── TraitsForm.tsx
│   │   │   ├── ConflictsForm.tsx
│   │   │   ├── RelationshipsForm.tsx
│   │   │   ├── ArcForm.tsx
│   │   │   └── ResourcesForm.tsx
│   │   ├── SceneForm/                          # Scene creation
│   │   │   ├── BasicInfoForm.tsx
│   │   │   ├── SettingForm.tsx
│   │   │   ├── CharactersForm.tsx
│   │   │   ├── EventsForm.tsx
│   │   │   ├── DialogueForm.tsx
│   │   │   ├── ConflictForm.tsx
│   │   │   └── OutcomeForm.tsx
│   │   └── Common/
│   │       ├── ResourceAttachment.tsx
│   │       ├── TagInput.tsx
│   │       └── RichTextEditor.tsx
│   └── ui/
│       ├── Modal/
│       │   ├── BaseModal.tsx
│       │   ├── CharacterModal.tsx
│       │   ├── SceneModal.tsx
│       │   └── ResourceModal.tsx
│       ├── Cards/
│       │   ├── BaseCard.tsx
│       │   ├── CharacterCard.tsx
│       │   ├── SceneCard.tsx
│       │   └── ResourceCard.tsx
│       └── Navigation/
│           ├── TabNavigation.tsx
│           ├── Breadcrumbs.tsx
│           └── QuickActions.tsx
├── context/
│   ├── StoryContext.tsx                        # Global story state
│   ├── WritingContext.tsx                      # Editor state
│   └── UIStateContext.tsx                      # Modal/panel states
├── hooks/
│   ├── useStoryData.ts                         # Story CRUD operations
│   ├── useCharacters.ts                        # Character management
│   ├── useScenes.ts                           # Scene operations
│   ├── useResources.ts                         # Resource handling
│   └── useWritingSession.ts                    # Writing mode
├── lib/
│   ├── supabase.ts                            # Existing client
│   ├── validation.ts                           # Form validation
│   ├── storage.ts                              # File upload handling
│   └── export.ts                               # Export utilities
└── types/
    ├── story.types.ts                          # All TypeScript interfaces
    ├── api.types.ts                            # API response types
    └── ui.types.ts                             # UI component props
```

### UI Design System Implementation
```typescript
// Design tokens from frontend-designer skill
const theme = {
  colors: {
    primary: {
      gradient: 'linear-gradient(90deg, #000000, #2a003f, #5a007a, #8a00c2)',
      deepPurple: '#5a007a',
      brightPurple: '#8a00c2',
      surface: '#1a001f'
    },
    emotion: {
      danger: '#dc2626',      // Deep red for conflict
      calm: '#7e22ce',        // Muted purple for neutral
      highlight: '#c084fc',   // Neon purple for emphasis
      info: '#4f46e5'         // Indigo for information
    },
    text: {
      primary: '#ffffff',
      secondary: '#cfcfcf',
      muted: '#6b7280'
    }
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  },
  borderRadius: {
    sm: '8px',
    md: '16px',
    lg: '20px',
    pill: '999px'
  },
  shadows: {
    glow: '0 0 20px rgba(138, 0, 194, 0.2)',
    card: '0 4px 12px rgba(0, 0, 0, 0.3)'
  }
};

// Example component styling
const CharacterCardStyles = `
  bg-[#1a001f] 
  rounded-2xl 
  p-4 
  shadow-[0_0_20px_rgba(138,0,194,0.2)]
  border border-purple-500/20
  hover:border-purple-400/30
  transition-colors
`;

const EmotionTagStyles = (emotion: string) => `
  px-3 py-1 
  text-xs 
  rounded-full 
  ${emotion === 'danger' ? 'bg-red-900/50 text-red-300' :
    emotion === 'calm' ? 'bg-purple-900/50 text-purple-300' :
    emotion === 'highlight' ? 'bg-purple-700/50 text-purple-200' :
    'bg-indigo-900/50 text-indigo-300'
  }
`;
```

### State Management Strategy
```typescript
// StoryContext for global state management
interface StoryState {
  currentStory: Story | null;
  characters: Character[];
  scenes: Scene[];
  conflicts: Conflict[];
  resources: Resource[];
  writingSession: WritingSession | null;
  loading: boolean;
  error: string | null;
}

const useStoryManager = (storyId: string) => {
  // Data fetching hooks
  const { data: story } = useStoryData(storyId);
  const { data: characters } = useCharacters(storyId);
  const { data: scenes } = useScenes(storyId);
  const { data: resources } = useResources(storyId);
  const { data: writing } = useWritingSession(storyId);
  
  // Optimistic updates
  const addCharacter = useCallback(async (characterData: Partial<Character>) => {
    // Optimistic UI update
    setCharacters(prev => [...prev, { ...characterData, id: 'temp' }]);
    
    try {
      const character = await createCharacter(storyId, characterData);
      // Replace temp ID with real ID
      setCharacters(prev => prev.map(c => c.id === 'temp' ? character : c));
    } catch (error) {
      // Rollback on error
      setCharacters(prev => prev.filter(c => c.id !== 'temp'));
    }
  }, [storyId]);
  
  return {
    story, characters, scenes, resources, writing,
    addCharacter, updateCharacter, deleteCharacter,
    // ... other CRUD operations
  };
};
```

## 6. Writing Mode Implementation

### Database Structure for Writing
```sql
-- Additional tables for writing mode (already defined above)
-- writing_sessions: Current writing content
-- writing_versions: Version history

-- Additional columns for rich text features
ALTER TABLE writing_sessions 
ADD COLUMN format TEXT DEFAULT 'markdown' CHECK (format IN ('markdown', 'rich-text', 'plain'));

ALTER TABLE writing_versions
ADD COLUMN format TEXT DEFAULT 'markdown';
```

### Frontend Writing Component
```tsx
const WritingEditor: React.FC<{ storyId: string }> = ({ storyId }) => {
  const { writingSession, updateWriting } = useWritingSession(storyId);
  const { characters, scenes } = useStoryManager(storyId);
  
  // Real-time autosave with debounce
  const [content, setContent] = useState(writingSession?.content || '');
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (content !== writingSession?.content) {
        updateWriting(content);
      }
    }, 2000); // 2-second debounce
    
    return () => clearTimeout(timeoutId);
  }, [content, writingSession?.content]);
  
  // Character and scene reference system
  const insertReference = (type: 'character' | 'scene', id: string) => {
    const reference = type === 'character' 
      ? characters.find(c => c.id === id)?.name
      : scenes.find(s => s.id === id)?.title;
    
    if (reference) {
      const refText = `[${type}:${reference}]`;
      setContent(prev => prev + refText);
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      <EditorToolbar 
        onSave={() => updateWriting(content)}
        onExport={() => exportContent(content)}
        onInsertReference={insertReference}
        characters={characters}
        scenes={scenes}
      />
      
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main editor */}
        <div className="lg:col-span-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Begin writing your story..."
            className="w-full h-full bg-[#1a001f] border border-purple-900/30 rounded-xl p-6 text-gray-200 resize-none outline-none focus:border-purple-600 transition-colors"
          />
        </div>
        
        {/* Reference panel */}
        <div className="lg:col-span-1">
          <ReferencePanel 
            characters={characters}
            scenes={scenes}
            onInsertReference={insertReference}
          />
        </div>
      </div>
    </div>
  );
};
```

### Export Functionality
```typescript
// Export utilities for multiple formats
const exportFormats = {
  pdf: (content: string, story: Story) => {
    // PDF generation logic
  },
  epub: (content: string, story: Story) => {
    // EPUB generation logic
  },
  markdown: (content: string) => {
    // Simple markdown export
    return content;
  },
  fountain: (content: string, scenes: Scene[]) => {
    // Fountain screenplay format
    return generateFountainScript(content, scenes);
  }
};

const useExportManager = (storyId: string) => {
  const { story, writingSession, scenes } = useStoryManager(storyId);
  
  const exportStory = async (format: keyof typeof exportFormats) => {
    if (!writingSession || !story) return;
    
    try {
      const exportedContent = exportFormats[format](
        writingSession.content,
        story,
        scenes
      );
      
      // Download logic
      const blob = new Blob([exportedContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${story.title}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Export failed:', error);
    }
  };
  
  return { exportStory };
};
```

## 7. Constraints & Optimization

### Performance Optimization
- **Virtualized Lists**: For character/scene grids with 100+ items
- **Lazy Loading**: Load writing mode editor only when tab active
- **Query Optimization**: Use Supabase RPC for complex joins
- **CDN Caching**: Static assets and exported files

### Security Implementation
- **Row Level Security**: All tables have proper RLS policies
- **Input Validation**: Zod validation for all API inputs
- **File Upload**: Virus scanning for uploaded resources
- **XSS Protection**: Content sanitization for user-generated text

### Cost Management
- **Efficient Queries**: Select only needed columns, use indexes
- **Batch Operations**: Group related writes/updates
- **Cache Strategy**: Client-side caching with stale-while-revalidate
- **Storage Optimization**: Image compression, file size limits

## 8. Future Enhancements

### AI Integration Roadmap
1. **Character AI**: Personality generation based on archetypes
2. **Scene Suggestions**: Context-aware scene ideas
3. **Dialogue Assistant**: Character-consistent dialogue generation
4. **Continuity Checker**: Plot hole and consistency detection

### Collaboration Features
1. **Real-time Co-writing**: Operational transform for concurrent editing
2. **Comment System**: Inline annotations and feedback
3. **Version Control**: Git-like branching and merging
4. **Permission System**: Role-based access control

### Advanced Visualization
1. **Timeline View**: Visual scene progression with character arcs
2. **Relationship Graph**: Interactive character relationship mapping
3. **Conflict Map**: Visual representation of story conflicts
4. **Theme Analysis**: Automated theme identification and tracking

This comprehensive specification provides complete technical details for implementation while maintaining alignment with the existing codebase architecture and design system.