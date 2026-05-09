-- Create AI Usage Tracking Table
CREATE TABLE IF NOT EXISTS public.ai_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    story_id UUID REFERENCES public.stories(id) ON DELETE SET NULL,
    feature_name TEXT NOT NULL, -- 'writing', 'character', 'scene', 'image-prompt'
    model_name TEXT NOT NULL,
    prompt_tokens INTEGER,
    completion_tokens INTEGER,
    total_tokens INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own AI usage" 
ON public.ai_usage FOR SELECT 
USING (auth.uid() = user_id);

-- Only service role can insert (for now, or authed users if we want to trust client tokens)
-- Actually, since we're calling from Edge Functions, we should use service role or let authed users insert.
-- Let's allow authed users to insert their own records.
CREATE POLICY "Users can log their own AI usage" 
ON public.ai_usage FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS ai_usage_user_id_idx ON public.ai_usage (user_id);
CREATE INDEX IF NOT EXISTS ai_usage_story_id_idx ON public.ai_usage (story_id);
CREATE INDEX IF NOT EXISTS ai_usage_created_at_idx ON public.ai_usage (created_at);
