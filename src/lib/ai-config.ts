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
    maxInstructionsChars: 1200,
    maxManuscriptChars: 12000,
    maxContextCharacters: 8,
    maxContextScenes: 6,
    maxContextResources: 6,
  },
  rateLimit: {
    windowMs: 60_000,
    maxAttempts: 10,
  },
} as const;
