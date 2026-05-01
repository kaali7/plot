# Feature Specification: Story List & Writing Dashboard

## 1. Problem Statement
Users need a frictionless way to create and manage stories with immediate access to a distraction-free writing workspace. Current story creation flows often require multiple steps and forms before users can begin writing, creating barriers to creative expression.

Target users: Writers, authors, and creative individuals who want to quickly capture story ideas and develop them in an organized environment.

Expected outcome: A streamlined experience where users can create a story with minimal input (just a name) and immediately transition to a purpose-built writing workspace.

## 2. Functional Requirements

### Core Features
1. **Story List Dashboard**
   - Grid-based display of all user stories
   - Each story card shows story name and metadata
   - Prominent "Add Story" button in top-right corner
   - Clicking a story card navigates to its writing dashboard

2. **Story Writing Dashboard (Editor Workspace)**
   - Split layout: collapsible left sidebar + main content area
   - Left sidebar navigation: Overview, Characters, Plot/Scenes, Notes/Resources
   - Main content area for distraction-free writing/editing
   - Instant redirection after story creation

### User Flows
1. **Story Creation Flow**
   - User lands on Story List Dashboard
   - Clicks "Add Story" button (top-right)
   - Modal appears requesting only Story Name
   - On submit: story created, user redirected to Story Writing Dashboard
   - No intermediate forms or confirmation steps

2. **Story Navigation Flow**
   - From Story List Dashboard: click any story card
   - System loads story data and opens Story Writing Dashboard
   - Left sidebar defaults to "Overview" section
   - Main content area displays selected section content

### Input/Output
- **Story Creation Input**: Story Name (string, required)
- **Story Creation Output**: Story object with ID, name, creation timestamp
- **Dashboard Data Input**: Story ID to load specific story data
- **Dashboard Data Output**: Story content organized by section (overview, characters, etc.)

### Future Enhancements
- Story templates selection during creation
- Auto-save with version history
- AI-assisted story suggestions in sidebar
- Tags/categories for story organization
- Collaboration features (comments, sharing)
- Export/import functionality

## 3. API Contracts

### Story Management Endpoints
```
GET /api/stories
  - Returns: Array of story objects
  - Auth: Required (Supabase JWT)
  - Response: 
    [
      {
        "id": "string (uuid)",
        "name": "string",
        "created_at": "timestamp",
        "updated_at": "timestamp"
      }
    ]

POST /api/stories
  - Body: { "name": "string" }
  - Auth: Required
  - Response: 
    {
      "id": "string (uuid)",
      "name": "string",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }

GET /api/stories/{storyId}
  - Auth: Required
  - Response: Full story object with all sections
    {
      "id": "string",
      "name": "string",
      "overview": "string",
      "characters": "string",
      "plot": "string",
      "notes": "string",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }

PUT /api/stories/{storyId}
  - Body: Partial story object (any section)
  - Auth: Required
  - Response: Updated story object
```

## 4. Constraints

### Tech Stack Alignment
- Frontend: React 18 + Vite + Tailwind CSS
- Backend: Supabase (PostgreSQL + Auth)
- State Management: React Context (existing pattern in codebase)
- Must use existing Supabase client setup in `/plot-app/lib/`

### Performance Expectations
- Story list loads in <1s for up to 100 stories
- Story creation redirect <500ms
- Initial editor load <1s
- Optimistic UI updates for story creation

### Security Considerations
- All API endpoints require Supabase authentication
- Row-level security (RLS) enforced on Supabase tables
- Input sanitization for story content to prevent XSS
- Story data isolation (users can only access their own stories)

### Scalability Strategy
- Pagination for story list (>50 stories)
- Lazy loading of story sections (load only active section initially)
- Database indexing on user_id and created_at columns
- CDN caching for static assets

### Cost Optimization
- Supabase free tier utilization during development
- Efficient database queries (select only needed fields)
- Client-side caching to reduce API calls
- Optimized image/assets loading

## 5. Edge Cases

### Validation Issues
- Empty story name: Show error "Story name is required"
- Duplicate story names: Allow (no uniqueness constraint)
- Special characters in story name: Allow all Unicode
- Extremely long story names (>200 chars): Truncate in UI, store full

### API Failures
- Network error during story creation: Show retryable error
- 401/403 errors: Redirect to login
- 500 errors: Show generic error with retry option
- Partial failures: Allow writing dashboard to load with available data

### User Misuse
- Rapid double-click on "Add Story": Disable button during submission
- Navigation away during save: Warn user of unsaved changes
- Browser back/forward: Preserve state where possible
- Large story content: Implement text area with proper height management

### Fallback Strategies
- Offline capability: Not required for MVP
- Degraded experience: Show cached story list if API fails
- Error boundaries: Isolate faulty components without crashing app

## 6. Acceptance Criteria

### Measurable Success Conditions
- 90% of users can create a story in <15 seconds
- <5% error rate on story creation API calls
- Page load time <2s on 3G network simulation
- Zero critical console errors in production

### UX Expectations
- Visual consistency with dark-purple theme system
- Accessible contrast ratios (WCAG AA minimum)
- Keyboard navigable all interactive elements
- Mobile-responsive layout (breakpoints: 640px, 768px, 1024px)
- Touch-friendly controls (minimum 48x48pt tappable areas)

### Performance Benchmarks
- Story creation: <800ms from click to editor view
- Story list rendering: <1s for 50 stories
- Section tab switching: <100ms
- Autosave (future): <2s debounce

## 7. System Design

### Architecture Overview
```
User Interface (React/Vite)
       ↓
Application State (React Context)
       ↓
API Service Layer (Supabase Client)
       ↓
Supabase (PostgreSQL + Auth + Storage)
```

### Data Flow
1. **Story Creation**
   - User input → Form state → Supabase insert → Optimistic UI update → Redirect

2. **Story Viewing**
   - Route param → Supabase query → Context state → Component rendering

3. **Story Updates** (Future)
   - Edit event → Debounced save → Supabase update → Context sync

### Components Structure
```
src/
├── components/
│   ├── layout/
│   │   ├── MainLayout.tsx
│   │   └── Sidebar.tsx
│   ├── stories/
│   │   ├── StoryList.tsx
│   │   ├── StoryCard.tsx
│   │   └── CreateStoryModal.tsx
│   └── dashboard/
│       ├── StoryDashboard.tsx
│       ├── SidebarNavigation.tsx
│       └── ContentArea.tsx
├── context/
│   └── StoryContext.tsx
├── lib/
│   └── supabase.ts
└── pages/
    ├── Dashboard.tsx (Story List)
    └── StoryEditor.tsx (Story Writing)
```

### Database Schema (Supabase)
```sql
Table: stories
- id: UUID (primary key)
- user_id: UUID (foreign key to auth.users)
- name: TEXT
- overview: TEXT
- characters: TEXT
- plot: TEXT
- notes: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Security Policies (Supabase RLS)
```sql
-- Users can only see their own stories
CREATE POLICY "Users can view own stories"
ON stories FOR SELECT
USING (auth.uid() = user_id);

-- Users can only insert their own stories
CREATE POLICY "Users can insert own stories"
ON stories FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can only update their own stories
CREATE POLICY "Users can update own stories"
ON stories FOR UPDATE
USING (auth.uid() = user_id);
```

## 8. Optimization Strategy

### Token Optimization (for Future AI Features)
- Prompt templating for consistent AI outputs
- Context window management (summarize long sections)
- Token counting and limiting in UI
- Streaming responses for better UX

### Parallel Processing
- Concurrent loading of story metadata and content
- Prefetching of likely next story based on recency
- Background saving without blocking UI

### Caching Layer
- React Query/SWR for server state (to be evaluated)
- Client-side story list caching with stale-while-revalidate
- SessionStorage for unsaved editor changes
- IndexedDB for offline capabilities (future)

### Cost vs Performance
- Trade-off: More frequent saves → better UX but higher API costs
- Solution: Debounced saves (2s) with visual indicators
- Trade-off: Rich text editor → better UX but larger bundle
- Solution: Lazy load editor dependencies when needed

## 9. Future Enhancements

1. **Rich Text Editing**
   - Implement Slate.js or Lexical for advanced formatting
   - Support for markdown shortcuts
   - Image embedding and upload to Supabase Storage

2. **AI Writing Assistant**
   - Context-aware suggestions based on current section
   - Tone adjustment and style guidance
   - Plot hole detection and consistency checking

3. **Collaboration Features**
   - Real-time co-editing with operational transforms
   - Commenting and discussion threads
   - Role-based permissions (viewer, editor, admin)

4. **Advanced Organization**
   - Custom tagging system with color coding
   - Story folders/categories
   - Search and filtering capabilities
   - Template library for different genres

5. **Export & Publishing**
   - Multiple format export (PDF, EPUB, DOCX)
   - Direct publishing to platforms (Medium, WordPress)
   - Print-ready formatting options