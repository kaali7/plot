import { AI_CONFIG } from './ai-config';
import type { AIContextSnapshot } from '@/types/ai.types';
import type { Character, Conflict, Resource, Scene, Story } from '@/types/story.types';

const trimText = (value: string | undefined | null, maxLength: number) => {
  if (!value) return undefined;
  const normalized = value.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1)}…`;
};

const stripHtml = (value: string) => {
  if (!value) return '';

  if (typeof window === 'undefined') {
    return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(value, 'text/html');
  return (doc.body.textContent || '').replace(/\s+/g, ' ').trim();
};

export const plainTextFromHtml = (value: string) => stripHtml(value);

export const buildAIContextSnapshot = ({
  story,
  characters,
  scenes,
  conflicts,
  resources,
}: {
  story: Story;
  characters: Character[];
  scenes: Scene[];
  conflicts: Conflict[];
  resources: Resource[];
}): AIContextSnapshot => {
  const prioritizedCharacters = [...characters]
    .sort((a, b) => {
      const rank = { main: 0, antagonist: 1, 'sub-main': 2, supporting: 3 } as const;
      return rank[a.role] - rank[b.role];
    })
    .slice(0, AI_CONFIG.limits.maxContextCharacters);

  const prioritizedScenes = [...scenes]
    .sort((a, b) => a.order - b.order)
    .slice(0, AI_CONFIG.limits.maxContextScenes);

  const prioritizedResources = resources.slice(0, AI_CONFIG.limits.maxContextResources);

  return {
    story: {
      id: story.id,
      name: trimText(story.name, 200) || story.name,
      theme: trimText(story.theme, 180),
      description: trimText(story.description, 800),
      world_settings: {
        ...story.world_settings,
        atmosphere: trimText(story.world_settings.atmosphere, 180),
        environmentDescription: trimText(story.world_settings.environmentDescription, 600),
        locations: story.world_settings.locations.slice(0, 12),
      },
    },
    characters: prioritizedCharacters.map((character) => ({
      id: character.id,
      name: character.name,
      role: character.role,
      description: trimText(character.description, 240),
      motivation: {
        goal: trimText(character.motivation?.goal, 180),
        fear: trimText(character.motivation?.fear, 180),
        desire: trimText(character.motivation?.desire, 180),
      },
      traits: {
        strengths: character.traits?.strengths?.slice(0, 5) || [],
        weaknesses: character.traits?.weaknesses?.slice(0, 5) || [],
        personality: character.traits?.personality?.slice(0, 6) || [],
      },
    })),
    scenes: prioritizedScenes.map((scene) => ({
      id: scene.id,
      title: scene.title,
      type: scene.type,
      goal: trimText(scene.goal, 220),
      setting: {
        location: trimText(scene.setting?.location, 120),
        time: trimText(scene.setting?.time, 120),
        environment: trimText(scene.setting?.environment, 240),
      },
      context: trimText(scene.context, 320),
      situation_details: trimText(scene.situation_details, 320),
      outcome: trimText(scene.outcome, 220),
    })),
    conflicts: conflicts.slice(0, 8).map((conflict) => ({
      id: conflict.id,
      title: conflict.title,
      type: conflict.type,
      description: trimText(conflict.description, 240),
    })),
    resources: prioritizedResources.map((resource) => ({
      id: resource.id,
      title: resource.title,
      type: resource.type,
      content: trimText(resource.content, 220),
      url: resource.url,
    })),
  };
};
