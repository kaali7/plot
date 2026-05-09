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

    const seed = payload.seed ?? {};
    const chars = (payload.context?.characters ?? []).map((c: any) => c.name).join(', ');

    const prompt = `You are a character designer for a story titled "${story.name}".
Theme: ${story.theme ?? 'not specified'}.
Existing characters: ${chars || 'none yet'}.
${seed.name ? `Name hint: ${seed.name}.` : ''}
${seed.role ? `Role: ${seed.role}.` : ''}
${seed.concept ? `Concept: ${seed.concept}.` : ''}
Return ONLY valid JSON matching this exact shape (no markdown, no commentary):
{
  "name": "",
  "role": "main",
  "description": "",
  "motivation": { "goal": "", "fear": "", "desire": "" },
  "traits": { "strengths": [], "weaknesses": [], "personality": [] },
  "conflicts": { "internal": "", "external": "" },
  "relationships": [],
  "arc": { "startingState": "", "endingState": "" }
}`;

    const raw = await generateWithGemini(prompt);
    
    // Log usage
    await logAIUsage(supabase, user.id, payload.storyId, 'character');

    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    const character = JSON.parse(raw.slice(start, end + 1));

    return json(character);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Character generation error.' }, 500);
  }
});
