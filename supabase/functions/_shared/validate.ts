export function sanitizePromptInput(input: string, maxLength = 2000): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .slice(0, maxLength)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '') // control chars
    .trim();
}

export function validateStoryId(storyId: unknown): storyId is string {
  return typeof storyId === 'string' && /^[0-9a-f-]{36}$/i.test(storyId);
}

export function validateAction(action: unknown, allowed: string[]): boolean {
  return typeof action === 'string' && allowed.includes(action);
}
