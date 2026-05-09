import type { Character, Conflict, Resource, Scene, Story } from './story.types';

export type AIWritingAction =
  | 'continue'
  | 'expand'
  | 'rewrite'
  | 'dialogue'
  | 'describe';

export interface AIContextSnapshot {
  story: Pick<Story, 'id' | 'name' | 'theme' | 'description' | 'world_settings'>;
  characters: Array<
    Pick<Character, 'id' | 'name' | 'role' | 'description' | 'motivation' | 'traits'>
  >;
  scenes: Array<
    Pick<
      Scene,
      | 'id'
      | 'title'
      | 'type'
      | 'goal'
      | 'setting'
      | 'context'
      | 'situation_details'
      | 'outcome'
    >
  >;
  conflicts: Array<Pick<Conflict, 'id' | 'title' | 'type' | 'description'>>;
  resources: Array<Pick<Resource, 'id' | 'title' | 'type' | 'content' | 'url'>>;
}

export interface AIWritingRequest {
  action: AIWritingAction;
  storyId: string;
  context: AIContextSnapshot;
  manuscript: {
    html: string;
    text: string;
  };
  selection?: {
    text: string;
  };
  instructions?: string;
}

export interface AIWritingResponse {
  action: AIWritingAction;
  content: string;
  provider: string;
  model: string;
  usage?: {
    inputChars: number;
    outputChars: number;
  };
}

// ── Character generation ──────────────────────────────────────
export interface AICharacterSeed {
  name?: string;
  role?: string;
  concept?: string;
}

export interface AICharacterGenerateRequest {
  storyId: string;
  context: AIContextSnapshot;
  seed: AICharacterSeed;
}

export interface AICharacterGenerateResponse {
  name: string;
  role: string;
  description: string;
  motivation: { goal: string; fear: string; desire: string };
  traits: { strengths: string[]; weaknesses: string[]; personality: string[] };
  conflicts: { internal: string; external: string };
  relationships: any[];
  arc: { startingState: string; endingState: string };
}

// ── Scene generation ──────────────────────────────────────────
export interface AISceneSeed {
  title?: string;
  type?: string;
  placementHint?: string;
  povCharacterId?: string;
  includeDialogue?: boolean;
}

export interface AISceneGenerateRequest {
  storyId: string;
  context: AIContextSnapshot;
  seed: AISceneSeed;
}

export interface AISceneGenerateResponse {
  title: string;
  type: string;
  goal: string;
  pov_character_id: string;
  setting: { location: string; time: string; environment: string };
  events: string;
  conflicts: { internal: string; external: string };
  dialogue: Array<{ characterId: string; type: string; content: string }>;
  background: string;
  context: string;
  situation_details: string;
  outcome: string;
  impact: string;
}

// ── Image prompt generation ───────────────────────────────────
export type ImagePromptStyle =
  | 'cinematic'
  | 'anime'
  | 'oil-painting'
  | 'photorealistic'
  | 'concept-art'
  | 'noir';

export type ImagePromptEntityType = 'character' | 'scene' | 'world';

export interface AIImagePromptRequest {
  storyId: string;
  context: AIContextSnapshot;
  entityType: ImagePromptEntityType;
  entityPayload: Record<string, any>;
  style: ImagePromptStyle;
}

export interface AIImagePromptResponse {
  prompt: string;
  style: ImagePromptStyle;
  entityName: string;
}

