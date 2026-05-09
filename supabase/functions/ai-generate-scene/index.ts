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
    const chars = (payload.context?.characters ?? []);
    const charList = chars.map((c: any) => `${c.name} (ID: ${c.id}, Role: ${c.role})`).join(', ');

    const prompt = `You are a scene architect for a story titled "${story.name}".
Theme: ${story.theme ?? 'not specified'}.
Description: ${story.description ?? ''}.
Available characters: ${charList || 'none yet'}.

User Seed:
${seed.title ? `- Title hint: ${seed.title}` : ''}
${seed.type ? `- Scene type: ${seed.type}` : ''}
${seed.placementHint ? `- Placement: ${seed.placementHint}` : ''}
${seed.povCharacterId ? `- POV Character ID: ${seed.povCharacterId}` : ''}
${seed.includeDialogue ? `- Include initial dialogue: Yes` : ''}

Return ONLY valid JSON matching this exact shape:
{
  "title": "",
  "type": "introduction",
  "goal": "",
  "pov_character_id": "",
  "setting": { "location": "", "time": "", "environment": "" },
  "events": "",
  "conflicts": { "internal": "", "external": "" },
  "dialogue": [],
  "background": "",
  "context": "",
  "situation_details": "",
  "outcome": "",
  "impact": ""
}

IMPORTANT: For pov_character_id and dialogue character IDs, use the provided character IDs exactly. Never fabricate new IDs.`;

    const raw = await generateWithGemini(prompt);

    // Log usage
    await logAIUsage(supabase, user.id, payload.storyId, 'scene');

    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    const scene = JSON.parse(raw.slice(start, end + 1));

    return json(scene);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Scene generation error.' }, 500);
  }
});
