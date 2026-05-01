# Implementation Plan: Unified Story Dashboard

## Overview
This plan outlines the phased implementation of the complete Unified Story Dashboard based on the comprehensive specification. The implementation will follow an iterative approach, building upon the existing codebase structure and maintaining the dark-purple design system.

## Phase 1: Database Schema Implementation (Week 1)

### Database Migrations
```sql
-- Migration 1: Enhance existing tables and add new ones
-- File: supabase/migrations/20250430000001_unified_dashboard_schema.sql

-- 1. Add JSONB columns to stories table for World Settings
ALTER TABLE stories 
ADD COLUMN world_settings JSONB DEFAULT '{"locations": [], "timePeriod": null, "atmosphere": null, "environmentDescription": null, "linkedResources": []}';

-- 2. Create conflicts table
CREATE TABLE conflicts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(title) > 0),
  type TEXT NOT NULL CHECK (type IN ('internal', 'external', 'society')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enhance characters table with JSONB fields
ALTER TABLE characters 
ADD COLUMN motivation JSONB DEFAULT '{"goal": null, "fear": null, "desire": null}',
ADD COLUMN traits JSONB DEFAULT '{"strengths": [], "weaknesses": [], "personality": []}',
ADD COLUMN conflicts JSONB DEFAULT '{"internal": null, "external": null}',
ADD COLUMN relationships JSONB DEFAULT '[]',
ADD COLUMN arc JSONB DEFAULT '{"start": null, "end": null}';

-- 4. Create scenes table
CREATE TABLE scenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(title) > 0),
  type TEXT NOT NULL DEFAULT 'transition' CHECK (type IN ('introduction', 'conflict', 'climax', 'resolution', 'transition')),
  "order" INTEGER NOT NULL DEFAULT 0,
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

-- 5. Enhance resources table with worldSettings tracking
ALTER TABLE resources 
ADD COLUMN linked_entities JSONB DEFAULT '{"characters": [], "scenes": [], "conflicts": [], "worldSettings": []}';

-- 6. Create writing sessions table
CREATE TABLE writing_sessions (
  id UUID PRIMARY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories ON DELETE CASCADE,
  content TEXT NOT NULL DEFAULT '',
  version INTEGER NOT NULL DEFAULT 1,
  format TEXT DEFAULT 'markdown' CHECK (format IN ('markdown', 'rich-text', 'plain')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create version history table
CREATE TABLE writing_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  writing_session_id UUID REFERENCES writing_sessions ON DELETE CASCADE,
  content TEXT NOT NULL,
  version INTEGER NOT NULL,
  format TEXT DEFAULT 'markdown',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Add performance indexes
CREATE INDEX idx_scenes_story_id ON scenes(story_id);
CREATE INDEX idx_scenes_order ON scenes(story_id, "order");
CREATE INDEX idx_conflicts_story_id ON conflicts(story_id);
CREATE INDEX idx_writing_sessions_story_id ON writing_sessions(story_id);
```

### RLS Policies Implementation
- Implement Row Level Security policies for all new tables
- Ensure proper user isolation for all story-related data
- Test security policies with multiple user scenarios

## Phase 2: Backend API Implementation (Week 2)

### API Service Layer
```typescript
// File: src/lib/api/

// 1. Story API service
const storyAPI = {
  getFullStory: (storyId: string) => supabase.rpc('get_full_story', { story_id: storyId }),
  updateWorldSettings: (storyId: string, settings: WorldSettings) => 
    supabase.from('stories').update({ world_settings: settings }).eq('id', storyId),
  // ... other story endpoints
};

// 2. Character API service
const characterAPI = {
  createCharacter: (storyId: string, characterData: Partial<Character>) =>
    supabase.from('characters').insert({ ...characterData, story_id: storyId }),
  updateCharacter: (characterId: string, updates: Partial<Character>) =>
    supabase.from('characters').update(updates).eq('id', characterId),
  // ... other character endpoints
};

// 3. Scene API service
const sceneAPI = {
  createScene: (storyId: string, sceneData: Partial<Scene>) =>
    supabase.from('scenes').insert({ ...sceneData, story_id: storyId }),
  reorderScenes: (storyId: string, newOrder: string[]) =>
    supabase.rpc('reorder_scenes', { story_id: storyId, new_order: newOrder }),
  // ... other scene endpoints
};

// 4. Resource API service
const resourceAPI = {
  linkResource: (resourceId: string, entityType: string, entityId: string) =>
    supabase.rpc('link_resource_to_entity', { 
      resource_id: resourceId, 
      entity_type: entityType, 
      entity_id: entityId 
    }),
  // ... other resource endpoints
};

// 5. Writing API service
const writingAPI = {
  getWritingSession: (storyId: string) =>
    supabase.from('writing_sessions').select('*').eq('story_id', storyId).single(),
  updateWriting: (sessionId: string, content: string) =>
    supabase.from('writing_sessions').update({ content }).eq('id', sessionId),
  // ... other writing endpoints
};
```

### Database Functions (RPC)
- Create Supabase RPC functions for complex operations
- Implement stored procedures for data integrity
- Add validation and error handling

## Phase 3: Frontend Component Implementation (Weeks 3-4)

### Component Development Order
1. **Layout Components** (Week 3)
   - `UnifiedStoryDashboard.tsx` - Main container
   - `NavigationTabs.tsx` - Section navigation
   - `DashboardHeader.tsx` - Story title and actions

2. **Story Foundation Components** (Week 3)
   - `BasicInfoPanel.tsx` - Story basics editor
   - `WorldSettingsPanel.tsx` - World settings with resource linking
   - `ConflictBuilder.tsx` - Conflict management
   - `ConflictCard.tsx` - Individual conflict display

3. **Character Management** (Week 4)
   - `CharacterGrid.tsx` - Grid layout for characters
   - `CharacterCard.tsx` - Individual character display
   - `CharacterModal.tsx` - Comprehensive character editor
   - `RelationshipGraph.tsx` - Visual relationship mapping
   - `EmotionTag.tsx` - Emotion-based tagging system

4. **Scene Building** (Week 4)
   - `SceneList.tsx` - Ordered scene list
   - `SceneCard.tsx` - Individual scene display
   - `SceneModal.tsx` - Detailed scene editor
   - `DialogueBuilder.tsx` - Dialogue system
   - `SceneReorder.tsx` - Drag-and-drop reordering

### Forms Implementation
- Create reusable form components
- Implement validation with Zod
- Add auto-save functionality
- Create resource attachment system

## Phase 4: State Management & Integration (Week 5)

### Context Implementation
```typescript
// File: src/context/StoryContext.tsx

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

const StoryContext = createContext<{
  state: StoryState;
  actions: {
    loadStory: (storyId: string) => Promise<void>;
    updateWorldSettings: (settings: WorldSettings) => Promise<void>;
    addCharacter: (characterData: Partial<Character>) => Promise<void>;
    updateSceneOrder: (newOrder: string[]) => Promise<void>;
    // ... other actions
  };
} | null>(null);
```

### Custom Hooks
- `useStoryData()` - Story CRUD operations
- `useCharacters()` - Character management
- `useScenes()` - Scene operations
- `useResources()` - Resource handling
- `useWritingSession()` - Writing mode functionality

### Performance Optimization
- Implement React.memo for expensive components
- Add virtualized lists for large datasets
- Implement lazy loading for tabs
- Add caching strategies

## Phase 5: Writing Mode Implementation (Week 6)

### Editor Components
- `WritingEditor.tsx` - Main editor component
- `EditorToolbar.tsx` - Formatting and actions
- `ReferencePanel.tsx` - Character/scene references
- `VersionHistory.tsx` - Version management

### Writing Features
- Real-time autosave with debounce
- Character and scene reference system
- Export functionality for multiple formats
- Version history and restoration

## Phase 6: Testing & Optimization (Week 7)

### Testing Strategy
1. **Unit Tests** - Component and utility functions
2. **Integration Tests** - API service layer
3. **E2E Tests** - User flows and interactions
4. **Performance Tests** - Load testing and optimization

### Performance Optimization
- Database query optimization
- Bundle size analysis and reduction
- CDN configuration for static assets
- Caching strategy implementation

### Security Testing
- RLS policy validation
- Input sanitization testing
- File upload security
- Authentication flow testing

## Phase 7: Deployment & Monitoring (Week 8)

### Deployment Process
1. **Database Migrations** - Apply production schema
2. **Build Process** - Optimized production build
3. **Vercel Deployment** - Automated CI/CD pipeline
4. **Environment Configuration** - Production environment variables

### Monitoring Setup
- Error tracking with Sentry
- Performance monitoring
- Usage analytics
- Database performance metrics

## Technical Dependencies

### Required Packages
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.105.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1", 
    "react-router-dom": "^6.30.3",
    "zod": "^3.22.4",
    "react-hook-form": "^7.48.2",
    "@hookform/resolvers": "^3.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.6.3",
    "vite": "^6.0.5",
    "tailwindcss": "^3.4.17"
  }
}
```

### Development Tools
- ESLint for code quality
- Prettier for code formatting
- TypeScript for type safety
- Vite for fast development
- Tailwind CSS for styling

## Risk Management

### Technical Risks
1. **Database Performance** - Large datasets may impact performance
   - Mitigation: Implement pagination, indexing, and query optimization

2. **Complex State Management** - Nested data structures may cause issues
   - Mitigation: Use React Query/SWR for server state, careful context design

3. **File Upload Limitations** - Large files may cause storage issues
   - Mitigation: Implement file size limits, compression, and CDN delivery

### Timeline Risks
1. **Scope Creep** - Additional features may extend timeline
   - Mitigation: Stick to MVP features, phase additional features

2. **Integration Complexity** - Connecting multiple systems may take longer
   - Mitigation: Thorough testing and incremental integration

## Success Metrics

### Technical Metrics
- Page load time < 2s
- API response time < 500ms
- Error rate < 1%
- Lighthouse score > 90

### User Metrics
- User adoption rate > 60%
- Feature completion rate > 75%
- User satisfaction score > 4/5
- Retention rate > 40%

## Next Steps

1. **Review this plan** with the development team
2. **Set up project management** with milestones
3. **Begin Phase 1 implementation** (Database schema)
4. **Weekly progress reviews** and adjustments
5. **User testing** after each major phase

This implementation plan provides a structured approach to building the Unified Story Dashboard while maintaining code quality, performance, and alignment with the existing codebase architecture.