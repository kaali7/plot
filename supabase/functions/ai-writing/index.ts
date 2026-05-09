import { corsHeaders } from '../_shared/cors.ts';
import { createAuthedClient } from '../_shared/auth.ts';
import { generateWithGemini, logAIUsage } from '../_shared/provider.ts';
import type { AIWritingRequest, AIWritingResponse } from '../../../src/types/ai.types.ts';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed.' }, 405);
  }

  try {
    const supabase = createAuthedClient(request);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return json({ error: 'Unauthorized.' }, 401);
    }

    const payload = (await request.json()) as AIWritingRequest;

    if (!payload?.storyId || !payload?.action || !payload?.context?.story?.id) {
      return json({ error: 'Invalid AI writing request.' }, 400);
    }

    const { data: story, error: storyError } = await supabase
      .from('stories')
      .select('id, user_id, name, theme, description')
      .eq('id', payload.storyId)
      .single();

    if (storyError || !story || story.user_id !== user.id) {
      return json({ error: 'Story not found or access denied.' }, 403);
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

    return json(response);

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected AI function error.';
    return json({ error: message }, 500);
  }
});

function buildWritingPrompt(
  payload: AIWritingRequest, 
  storyName: string, 
  storyTheme?: string, 
  storyDescription?: string
): string {
  const { action, context, manuscript, selection, instructions } = payload;

  const base = `You are a creative writing assistant for a story titled "${storyName}".
Theme: ${storyTheme ?? 'not specified'}.
Description: ${storyDescription ?? ''}.
Characters: ${context.characters.map(c => `${c.name} (${c.role})`).join(', ')}.

Current manuscript excerpt:
${manuscript.text.slice(0, 3000)}

${selection?.text ? `Selected passage:\n${selection.text}\n` : ''}
${instructions ? `Author instruction: ${instructions}\n` : ''}
Task: ${action === 'continue' ? 'Continue the story naturally from where it ends.' :
       action === 'expand' ? 'Expand the selected passage with more detail.' :
       action === 'rewrite' ? 'Rewrite the selected passage, preserving intent.' :
       action === 'dialogue' ? 'Write natural dialogue for the next scene beat.' :
       'Describe the setting and atmosphere of the current moment.'}
Return only the creative writing output, no commentary.`;

  return base;
}

