import type { AIWritingAction } from '../../../src/types/ai.types.ts';

const actionLabels: Record<AIWritingAction, string> = {
  continue: 'Continue the manuscript from the existing narrative momentum.',
  expand: 'Expand the selected passage with more detail and texture.',
  rewrite: 'Rewrite the selected passage with clearer prose while keeping intent.',
  dialogue: 'Draft dialogue that fits the current characters and scene context.',
  describe: 'Describe the setting and atmosphere in vivid prose.',
};

export const generateMockWritingDraft = ({
  action,
  selectedText,
  manuscriptText,
  title,
}: {
  action: AIWritingAction;
  selectedText?: string;
  manuscriptText: string;
  title: string;
}) => {
  const excerpt = (selectedText || manuscriptText).trim().slice(0, 220);

  return [
    `[Mock AI Draft for "${title}"]`,
    actionLabels[action],
    excerpt ? `Reference excerpt: ${excerpt}` : 'Reference excerpt: none provided.',
    'This mock response is in place so the full writing flow can be tested before a provider key is configured.',
  ].join('\n\n');
};

export async function logAIUsage(
  supabase: any,
  userId: string,
  storyId: string | null,
  featureName: string,
  modelName: string = 'gemini-1.5-pro'
) {
  try {
    await supabase.from('ai_usage').insert({
      user_id: userId,
      story_id: storyId,
      feature_name: featureName,
      model_name: modelName,
    });
  } catch (e) {
    console.error('Failed to log AI usage:', e);
  }
}

export async function generateWithGemini(prompt: string): Promise<string> {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) throw new Error('GEMINI_API_KEY not set.');

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 1024 },
      }),
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Gemini API error: ${error}`);
  }

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}
