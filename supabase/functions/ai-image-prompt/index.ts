import { corsHeaders } from '../_shared/cors.ts';
import { createAuthedClient } from '../_shared/auth.ts';
import { generateWithGemini, logAIUsage } from '../_shared/provider.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const json = (b: unknown, s = 200) =>
    new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  try {
    const supabase = createAuthedClient(req);
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) return json({ error: 'Unauthorized.' }, 401);

    const payload = await req.json();
    if (!payload?.storyId) return json({ error: 'Missing storyId.' }, 400);

    const { data: story, error: storyErr } = await supabase
      .from('stories').select('id,user_id,name,theme,description').eq('id', payload.storyId).single();
    if (storyErr || !story || story.user_id !== user.id) return json({ error: 'Access denied.' }, 403);

    const { entityType, entityPayload, style, entityName } = payload;

    const styleDescriptions: Record<string, string> = {
      cinematic: 'dramatic cinematic photography, golden hour lighting, film grain, highly detailed, 8k',
      anime: 'modern high-quality anime illustration style, vivid colors, expressive features, Makoto Shinkai aesthetic',
      'oil-painting': 'classical oil painting, textured brushwork, rich color palette, museum quality, Rembrandt lighting',
      photorealistic: 'hyperrealistic digital photography, 8K, studio lighting, sharp focus, professional color grading',
      'concept-art': 'epic concept art, matte painting, stylized, high fantasy / sci-fi aesthetic, atmospheric',
      noir: 'film noir, black and white, high contrast, dramatic shadows, moody atmosphere, gritty',
    };

    const prompt = `You are a visual prompt engineer for the story "${story.name}".
Story Theme: ${story.theme ?? 'not specified'}.

Task: Create a detailed image generation prompt for a ${entityType} named/titled "${entityName}".
Entity Details: ${JSON.stringify(entityPayload).slice(0, 1000)}

Style requested: ${style} (${styleDescriptions[style] ?? style})

Guidelines:
- Focus on visual elements: lighting, composition, colors, and key physical details.
- Avoid abstract narrative; describe what is seen.
- Return ONLY the final image prompt text. No "Here is your prompt" or markdown formatting.
- Maximum 150 words.`;

    const generatedPrompt = await generateWithGemini(prompt);

    // Log usage
    await logAIUsage(supabase, user.id, payload.storyId, 'image-prompt');

    return json({
      prompt: generatedPrompt.trim(),
      style,
      entityName
    });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Image prompt generation error.' }, 500);
  }
});
