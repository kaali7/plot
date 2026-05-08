# AI Features - Implementation Plan

**Project:** Plot App (`F:\_product\Plot\plot-app`)  
**Updated:** 2026-05-08  
**Source of truth:** current React/Supabase codebase in `src/` and `supabase/`

---

## 1. Purpose

This document updates the earlier AI plan to match the code that already exists in this repository.

The app is no longer a blank Vite starter. It already includes:

- Auth flows and protected routes
- A unified story workspace with tabs for overview, characters, scenes, writing, and resources
- A Supabase-backed CRUD layer in `src/lib/api.ts`
- Story state management in `src/hooks/useStoryData.ts` and `src/context/StoryContext.tsx`
- A custom writing editor in `src/components/writing-section/WritingEditor.tsx`
- Supabase schema and RPCs in `supabase/migrations/combined_migrations.sql`

The AI work should extend this architecture instead of introducing a parallel stack.

---

## 2. Current Codebase Reality

### Frontend status

- React + Vite + TypeScript are in place.
- Tailwind-based UI is implemented.
- `react-hook-form` is installed and already fits the modal-heavy CRUD flows.
- There is **no TipTap** dependency in `package.json`.
- The writing surface is a custom `contentEditable` editor, not a structured rich-text editor.

### Data and state status

- `src/lib/api.ts` already owns story, character, scene, resource, and writing-session CRUD.
- `useStoryManager()` provides optimistic updates and feeds `StoryContext`.
- The main extension point for AI actions is the existing dashboard flow:
  - `src/components/dashboard/UnifiedStoryDashboard.tsx`
  - `src/components/character-section/CharacterSection.tsx`
  - `src/components/scene-section/SceneSection.tsx`
  - `src/components/writing-section/WritingSection.tsx`
  - `src/components/resources-section/ResourcesSection.tsx`

### Backend status

- Supabase is already the backend of record.
- The schema already contains `stories`, `characters`, `scenes`, `conflicts`, `resources`, `writing_sessions`, and `writing_versions`.
- There is currently **no AI function layer** under `supabase/functions/`.

### Delivery implications

- AI features should be added as thin, well-scoped extensions.
- Avoid proposing a backend rewrite or separate service unless Supabase Edge Functions prove insufficient.
- The writing AI plan must account for raw HTML content coming from `contentEditable`.

---

## 3. AI Features In Scope

These remain the same product features, but the implementation path changes:

1. **AI-assisted writing**
2. **AI character generation**
3. **AI scene generation**
4. **AI image prompt generation**

Not in scope for this phase:

- Direct AI image generation
- Multi-provider orchestration UI
- Per-plan billing logic
- Full editor replacement

---

## 4. Recommended Architecture

### Backend choice

Use **Supabase Edge Functions** as the first implementation path.

Reasons:

- Fits the existing Supabase architecture
- Keeps provider secrets off the client
- Reuses auth context and story ownership rules
- Minimizes new infrastructure

### Provider abstraction

The code should not hardwire product logic directly to one model API.

Recommended starting point:

- One provider at launch
- One internal request/response format
- One shared server-side prompt assembly layer

Provider can be Gemini or OpenAI, but the code should expose an internal interface such as:

```ts
interface AIProvider {
  generateText(input: AITextRequest): Promise<AITextResponse>;
  generateObject<T>(input: AIObjectRequest): Promise<T>;
  streamText?(input: AITextRequest): Promise<ReadableStream>;
}
```

### Frontend integration rule

Do not bypass the existing story stack with ad hoc `fetch()` calls scattered across components.

Frontend AI calls should flow through:

1. `src/lib/ai-config.ts`
2. `src/lib/ai-service.ts`
3. section-level components and modals

---

## 5. Proposed File Additions

### Frontend

- `src/lib/ai-config.ts`
- `src/lib/ai-service.ts`
- `src/types/ai.types.ts`
- `src/lib/ai-context.ts`
- `src/components/ai/AIActionButton.tsx`
- `src/components/ai/AIGenerationPreview.tsx`
- `src/components/ai/AIErrorNotice.tsx`
- `src/components/writing-section/AIWritingPanel.tsx`
- `src/components/character-section/AICharacterGenerateModal.tsx`
- `src/components/scene-section/AISceneGenerateModal.tsx`
- `src/components/ai/ImagePromptModal.tsx`

### Supabase

- `supabase/functions/_shared/cors.ts`
- `supabase/functions/_shared/auth.ts`
- `supabase/functions/_shared/provider.ts`
- `supabase/functions/ai-writing/index.ts`
- `supabase/functions/ai-generate-character/index.ts`
- `supabase/functions/ai-generate-scene/index.ts`
- `supabase/functions/ai-image-prompt/index.ts`

### Migration

- new SQL migration for AI usage logging if we choose to track usage now

---

## 6. Proposed File Modifications

- `src/components/writing-section/WritingSection.tsx`
- `src/components/writing-section/EditorToolbar.tsx`
- `src/components/writing-section/WritingEditor.tsx`
- `src/components/character-section/CharacterSection.tsx`
- `src/components/scene-section/SceneSection.tsx`
- `src/components/resources-section/ResourcesSection.tsx` if prompt output should be savable as a resource
- `src/lib/api.ts` only if resource-save helpers need a cleaner wrapper
- `src/hooks/useStoryData.ts` only if AI-generated save flows need reusable optimistic helpers
- `.env.example`

---

## 7. Shared Foundation Work

### Phase 0.1 - AI config

Add `src/lib/ai-config.ts` with:

- feature flags
- function names
- timeout values
- simple rate-limit settings
- provider labels for UI copy

Example:

```ts
export const AI_CONFIG = {
  enabled: import.meta.env.VITE_AI_ENABLED === 'true',
  functions: {
    writing: 'ai-writing',
    character: 'ai-generate-character',
    scene: 'ai-generate-scene',
    imagePrompt: 'ai-image-prompt',
  },
  limits: {
    maxSelectionChars: 4000,
    maxContextScenes: 8,
    maxContextCharacters: 12,
  },
} as const;
```

### Phase 0.2 - Shared types

Add `src/types/ai.types.ts` with payloads derived from real app entities in `src/types/story.types.ts`.

Important: the current story model includes:

- `world_settings`
- scene `setting`, `events`, `conflicts`, `dialogue`, `background`, `context`, `situation_details`, `outcome`
- character `motivation`, `traits`, `relationships`, `arc`
- resource `linked_entities`

The AI payloads must reflect those exact shapes.

### Phase 0.3 - Story context builder

Add `src/lib/ai-context.ts` to build prompt-safe context snapshots from live story data.

This should:

- accept `story`, `characters`, `scenes`, `conflicts`, `resources`
- prioritize high-signal context
- trim large fields
- strip unsafe HTML from writing content before sending it to the backend

This is important because `WritingEditor` stores `innerHTML`, not plain text.

### Phase 0.4 - Frontend service layer

Add `src/lib/ai-service.ts` to centralize:

- invoking Supabase functions
- consistent request shape
- consistent error mapping
- cancellation via `AbortController` where practical

This avoids embedding provider/network logic inside UI components.

---

## 8. Feature 1 - AI-Assisted Writing

### Current integration point

Primary files:

- `src/components/writing-section/WritingSection.tsx`
- `src/components/writing-section/EditorToolbar.tsx`
- `src/components/writing-section/WritingEditor.tsx`

### Current editor constraint

The editor is a custom `contentEditable` surface using `document.execCommand()` and `innerHTML`.

That means:

- selection handling is limited
- range replacement will need careful DOM work
- AI output should probably be inserted at a coarse level first

### Recommended first version

Implement AI writing as a **side panel or modal preview flow**, not as deep inline editing on day one.

Why:

- lower risk with the current editor
- easier accept/discard flow
- avoids fragile DOM-range replacement bugs

### V1 writing actions

- Continue
- Rewrite selected text
- Expand selected text
- Generate dialogue from selected scene context
- Describe setting from scene context

### UX plan

1. Add an `AI Assist` action in `EditorToolbar.tsx`
2. Open `AIWritingPanel.tsx`
3. Read current editor selection where available
4. Show generated output in preview
5. Let user:
   - replace selection
   - append to manuscript
   - copy output
   - discard

### Technical notes

- `WritingSection.tsx` should own the AI panel state
- `WritingEditor.tsx` may need a small API for:
  - reading selected HTML/text
  - replacing selected content
  - inserting content at cursor
- If direct replacement is too unstable, ship append/copy first and defer selection replacement

### Backend function

`supabase/functions/ai-writing/index.ts`

Input:

- story context snapshot
- current manuscript excerpt
- selected text if any
- requested action
- optional custom instruction

Output:

- plain text or sanitized HTML

### Important decision

Do **not** stream in the first pass unless the Edge Function implementation is already straightforward.

For this codebase, a non-streaming response with solid accept/discard UX is more valuable than partial streaming complexity.

---

## 9. Feature 2 - AI Character Generation

### Current integration point

Primary files:

- `src/components/character-section/CharacterSection.tsx`
- `src/components/character-section/CharacterModal.tsx`
- `src/components/character-section/CharacterDetailView.tsx`

### Recommended UX

Add an `AI Generate` entry near the existing add-character flow in `CharacterSection.tsx`.

Flow:

1. User opens `AICharacterGenerateModal`
2. Provides optional seed fields:
   - name
   - role
   - short concept
3. Frontend sends story context plus seed
4. Preview generated character
5. User chooses:
   - save directly
   - open standard `CharacterModal` prefilled for editing
   - regenerate

### Backend function

`supabase/functions/ai-generate-character/index.ts`

It should return JSON aligned with the current `Character` shape:

```ts
{
  name,
  role,
  description,
  motivation,
  traits,
  conflicts,
  relationships,
  arc
}
```

### Save path

Use the existing `onCharacterAdd` flow through `StoryContext` / `useStoryManager`.

That preserves:

- optimistic updates
- existing CRUD wiring
- one consistent source of state updates

---

## 10. Feature 3 - AI Scene Generation

### Current integration point

Primary files:

- `src/components/scene-section/SceneSection.tsx`
- `src/components/scene-section/SceneModal.tsx`
- `src/components/scene-section/SceneDetailView.tsx`

### Recommended UX

Add `AI Generate` next to the existing scene creation flow.

Inputs:

- title seed
- scene type
- optional placement hint
- optional POV character
- include dialogue toggle

### Backend function

`supabase/functions/ai-generate-scene/index.ts`

Return JSON aligned with the current `Scene` model:

```ts
{
  title,
  type,
  goal,
  pov_character_id,
  setting,
  characters,
  events,
  conflicts,
  dialogue,
  background,
  context,
  situation_details,
  outcome,
  impact
}
```

### Important implementation detail

The function should prefer existing character IDs when generating:

- `pov_character_id`
- `dialogue[].characterId`
- `characters[].characterId`

If the model cannot map confidently, return empty IDs instead of fabricated IDs.

### Save path

Use the existing `onSceneAdd` handler through `StoryContext`.

The frontend should set `order` based on current scene count unless the backend explicitly leaves ordering to the client.

---

## 11. Feature 4 - AI Image Prompt Generation

### Current integration point

This feature can attach to:

- character detail actions
- scene detail actions
- resource creation flow

The existing codebase does not yet have a dedicated prompt UI, so this should be introduced as a modal.

### Recommended UX

`ImagePromptModal.tsx` should:

- show the current entity context
- allow style selection
- generate a prompt
- support copy
- optionally save prompt as a `note` resource

### Backend function

`supabase/functions/ai-image-prompt/index.ts`

Input:

- entity type
- entity payload
- story context
- requested visual style

Output:

- plain-text prompt

### Save-as-resource path

Reuse existing resource creation through the current CRUD layer.

Suggested behavior:

- create a `note` resource
- title format: `Image Prompt - {entity name}`
- optionally attach entity linkage in `linked_entities`

---

## 12. Security and Data Handling

### Required

- No provider API keys in Vite env
- All model calls go through Supabase functions
- Functions must validate authenticated user
- Functions must verify story ownership before using story context

### Content handling

Because writing content is stored as HTML:

- sanitize HTML before sending to AI
- prefer prompt-safe plain text extracts
- sanitize any returned HTML before insertion if HTML insertion is allowed

### Logging

At minimum, log:

- user id
- story id
- feature type
- request timestamp
- provider/model
- success/failure

Token logging is useful but optional for phase 1.

---

## 13. Database Changes

### Optional but recommended

Add an `ai_usage` table if we want visibility into usage and failures.

Suggested fields:

- `id`
- `user_id`
- `story_id`
- `feature`
- `provider`
- `model`
- `status`
- `input_size`
- `output_size`
- `error_message`
- `created_at`

This is not a blocker for shipping the first feature if speed matters.

---

## 14. Delivery Order

### Phase 1

- shared AI config
- shared AI types
- story context builder
- `ai-writing` function
- `AI Assist` entry in writing toolbar
- preview-only writing generation flow

### Phase 2

- `ai-generate-character`
- `AICharacterGenerateModal`
- save to existing character flow

### Phase 3

- `ai-generate-scene`
- `AISceneGenerateModal`
- save to existing scene flow

### Phase 4

- `ai-image-prompt`
- image prompt modal
- save prompt as resource

### Phase 5

- usage tracking
- tighter error states
- optional streaming
- optional regeneration history

---

## 15. Explicit Changes From The Previous Plan

The earlier version of this document is no longer accurate in these areas:

- It assumed a mostly greenfield app. The app already has the full story workspace.
- It referenced TipTap-style editor assumptions. The current editor is custom `contentEditable`.
- It implied AI could be added without accounting for raw HTML manuscript storage.
- It underused the existing `StoryContext` and `src/lib/api.ts` integration points.
- It treated some UI additions as standalone features instead of extensions to existing sections.
- It leaned harder into streaming than this codebase currently justifies.

---

## 16. Main Risks

1. **Editor fragility**
   Selection replacement inside `contentEditable` can be error-prone. Start with preview and append/copy flows if needed.

2. **Schema drift**
   AI payloads must match `src/types/story.types.ts`, not idealized structures from older planning docs.

3. **Prompt bloat**
   Story context can become large quickly. The context builder needs aggressive trimming rules.

4. **Untrusted model output**
   Never trust generated IDs or HTML directly.

5. **No existing test harness**
   The project currently lacks lint/test setup, so manual verification burden will be higher unless tooling is added.

---

## 17. Recommended Next Build Step

Start with **AI-assisted writing V1** because:

- it creates immediate visible value
- it exercises the full AI path end to end
- it does not require new database entities
- it surfaces the editor integration constraints early

If this phase works cleanly, character and scene generation can reuse most of the shared AI infrastructure.
