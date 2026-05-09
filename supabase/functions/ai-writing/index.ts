import { getCorsHeaders } from '../_shared/cors.ts';
import { createAuthedClient } from '../_shared/auth.ts';
import { generateWithGemini, logAIUsage } from '../_shared/provider.ts';
import { checkRateLimit } from '../_shared/rate-limit.ts';
import { sanitizePromptInput, validateStoryId, validateAction } from '../_shared/validate.ts';
import type { AIWritingRequest, AIWritingResponse } from '../../../src/types/ai.types.ts';

const json = (body: unknown, status = 200, request?: Request) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...(request ? getCorsHeaders(request) : { 'Access-Control-Allow-Origin': '*' }),
      'Content-Type': 'application/json',
    },
  });

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: getCorsHeaders(request) });
  }

  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed.' }, 405, request);
  }

  try {
    const supabase = createAuthedClient(request);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return json({ error: 'Unauthorized.' }, 401, request);
    }

    const payload = (await request.json()) as AIWritingRequest;

    // Validate inputs
    if (!validateStoryId(payload?.storyId) || !validateAction(payload?.action, ['continue', 'expand', 'rewrite', 'dialogue', 'describe'])) {
      return json({ error: 'Invalid AI writing request parameters.' }, 400, request);
    }

    // Rate Limit Check
    const rateCheck = await checkRateLimit(supabase, user.id, 'writing');
    if (!rateCheck.allowed) {
      return json({ error: rateCheck.error }, 429, request);
    }

    const { data: story, error: storyError } = await supabase
      .from('stories')
      .select('id, user_id, name, theme, description')
      .eq('id', payload.storyId)
      .single();

    if (storyError || !story || story.user_id !== user.id) {
      return json({ error: 'Story not found or access denied.' }, 403, request);
    }

    const prompt = buildWritingPrompt(payload, story.name, story.theme, story.description);
    const content = await generateWithGemini(prompt);

    // Log usage
    await logAIUsage(supabase, user.id, payload.storyId, 'writing');

    const response: AIWritingResponse = {
      action: payload.action,
      content,
      provider: 'gemini',
      model: 'gemini-1.5-pro',
      usage: {
        inputChars: (payload.manuscript?.text || '').length + (payload.selection?.text || '').length,
        outputChars: content.length,
      },
    };

    return json(response, 200, request);

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected AI function error.';
    return json({ error: message }, 500, request);
  }
});

function buildWritingPrompt(
  payload: AIWritingRequest, 
  storyName: string, 
  storyTheme?: string, 
  storyDescription?: string
): string {
  const { action, context, manuscript, selection, instructions } = payload;

  // Sanitize all inputs used in the prompt
  const safeName = sanitizePromptInput(storyName, 200);
  const safeTheme = sanitizePromptInput(storyTheme || 'not specified', 200);
  const safeDesc = sanitizePromptInput(storyDescription || '', 1000);
  const safeManuscript = sanitizePromptInput(manuscript?.text || '', 3000);
  const safeSelection = sanitizePromptInput(selection?.text || '', 1000);
  const safeInstructions = sanitizePromptInput(instructions || '', 1000);

  const base = `You are a creative writing assistant for a story titled "${safeName}".
Theme: ${safeTheme}.
Description: ${safeDesc}.
Characters: ${context.characters.map(c => `${sanitizePromptInput(c.name, 50)} (${c.role})`).join(', ')}.

Current manuscript excerpt:
${safeManuscript}

${safeSelection ? `Selected passage:\n${safeSelection}\n` : ''}
${safeInstructions ? `Author instruction: ${safeInstructions}\n` : ''}
Task: ${action === 'continue' ? 'Continue the story naturally from where it ends.' :
       action === 'expand' ? 'Expand the selected passage with more detail.' :
       action === 'rewrite' ? 'Rewrite the selected passage, preserving intent.' :
       action === 'dialogue' ? 'Write natural dialogue for the next scene beat.' :
       'Describe the setting and atmosphere of the current moment.'}
Return only the creative writing output, no commentary.`;

  return base;
}

