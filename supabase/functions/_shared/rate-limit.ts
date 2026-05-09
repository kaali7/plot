import { createClient } from 'jsr:@supabase/supabase-js@2';

const LIMITS = {
  writing: { maxPerHour: 30, maxPerDay: 100 },
  character: { maxPerHour: 20, maxPerDay: 50 },
  scene: { maxPerHour: 20, maxPerDay: 50 },
  'image-prompt': { maxPerHour: 15, maxPerDay: 40 },
};

export async function checkRateLimit(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  featureName: keyof typeof LIMITS
): Promise<{ allowed: boolean; error?: string }> {
  const limits = LIMITS[featureName];
  if (!limits) return { allowed: true };

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  // Count hourly usage
  const { count: hourlyCount } = await supabase
    .from('ai_usage')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('feature_name', featureName)
    .gte('created_at', oneHourAgo);

  if ((hourlyCount ?? 0) >= limits.maxPerHour) {
    return { allowed: false, error: `Rate limit exceeded. Max ${limits.maxPerHour} requests per hour for ${featureName}.` };
  }

  // Count daily usage
  const { count: dailyCount } = await supabase
    .from('ai_usage')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('feature_name', featureName)
    .gte('created_at', oneDayAgo);

  if ((dailyCount ?? 0) >= limits.maxPerDay) {
    return { allowed: false, error: `Daily limit exceeded. Max ${limits.maxPerDay} requests per day for ${featureName}.` };
  }

  return { allowed: true };
}
