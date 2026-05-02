-- Unified Story Dashboard - Complete Database Schema
-- This migration combines all previous migrations into a single comprehensive setup

-- 1. Create profiles table that extends auth.users
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subscription_tier TEXT DEFAULT 'free',
  last_login TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT
   USING (auth.uid() = id);

-- Policy: Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE
   USING (auth.uid() = id);

-- Policy: Users can insert their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT
   WITH CHECK (auth.uid() = id);

-- Create updated_at trigger
CREATE EXTENSION IF NOT EXISTS "moddatetime" SCHEMA extensions;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION moddatetime();

-- 2. Create stories table
CREATE TABLE IF NOT EXISTS stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  overview TEXT DEFAULT '',
  characters TEXT DEFAULT '',
  plot TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view own stories" ON stories;
CREATE POLICY "Users can view own stories" ON stories FOR SELECT
   USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own stories" ON stories;
CREATE POLICY "Users can insert own stories" ON stories FOR INSERT
   WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own stories" ON stories;
CREATE POLICY "Users can update own stories" ON stories FOR UPDATE
   USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own stories" ON stories;
CREATE POLICY "Users can delete own stories" ON stories FOR DELETE
   USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stories_user_id ON stories(user_id);
CREATE INDEX IF NOT EXISTS idx_stories_updated_at ON stories(updated_at);

-- 3. Add JSONB column for structured overview data
ALTER TABLE stories ADD COLUMN IF NOT EXISTS overview_json JSONB DEFAULT '{}'::jsonb;

-- Create index for JSON queries
CREATE INDEX IF NOT EXISTS idx_stories_overview_json ON stories USING gin (overview_json);

-- Create function to migrate existing overview text to JSON structure
CREATE OR REPLACE FUNCTION migrate_overview_to_json() 
RETURNS void AS $$
BEGIN
    UPDATE stories 
    SET overview_json = jsonb_build_object(
        'premise', overview,
        'characters', '[]'::jsonb,
        'conflicts', jsonb_build_object('internal', '', 'external', ''),
        'acts', jsonb_build_object('setup', '', 'confrontation', '', 'resolution', '')
    )
    WHERE overview IS NOT NULL AND overview != '' 
    AND (overview_json IS NULL OR overview_json = '{}'::jsonb);
END;
$$ LANGUAGE plpgsql;

-- Execute migration for existing data
SELECT migrate_overview_to_json();

-- 4. Phase 1: Unified Story Dashboard Schema Implementation
-- This migration creates all tables needed for the unified story dashboard
-- Based on the complete specification from unified-story-dashboard.md

-- Update existing stories table with new schema
ALTER TABLE stories 
ADD COLUMN IF NOT EXISTS title TEXT CHECK (char_length(title) > 0),
ADD COLUMN IF NOT EXISTS theme TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS world_settings JSONB DEFAULT '{"locations": [], "timePeriod": null, "atmosphere": null, "environmentDescription": null, "linkedResources": []}';

-- Update existing stories to use title field if name exists
UPDATE stories SET title = name WHERE title IS NULL AND name IS NOT NULL;

-- Create conflicts table
CREATE TABLE IF NOT EXISTS conflicts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(title) > 0),
  type TEXT NOT NULL CHECK (type IN ('internal', 'external', 'society')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Check if characters table exists, if not create it
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'characters') THEN
    -- Create characters table with all PRD fields
    CREATE TABLE characters (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      story_id UUID REFERENCES stories ON DELETE CASCADE,
      name TEXT NOT NULL CHECK (char_length(name) > 0),
      role TEXT NOT NULL DEFAULT 'supporting' CHECK (role IN ('protagonist', 'antagonist', 'supporting', 'minor')),
      description TEXT,
      image_url TEXT,
      
      -- Structured fields as JSONB
      motivation JSONB DEFAULT '{"goal": null, "fear": null, "desire": null}',
      traits JSONB DEFAULT '{"strengths": [], "weaknesses": [], "personality": []}',
      conflicts JSONB DEFAULT '{"internal": null, "external": null}',
      relationships JSONB DEFAULT '[]',
      arc JSONB DEFAULT '{"start": null, "end": null}',
      
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  ELSE
    -- Enhance existing characters table with JSONB fields
    ALTER TABLE characters 
    ADD COLUMN IF NOT EXISTS image_url TEXT,
    ADD COLUMN IF NOT EXISTS motivation JSONB DEFAULT '{"goal": null, "fear": null, "desire": null}',
    ADD COLUMN IF NOT EXISTS traits JSONB DEFAULT '{"strengths": [], "weaknesses": [], "personality": []}',
    ADD COLUMN IF NOT EXISTS conflicts JSONB DEFAULT '{"internal": null, "external": null}',
    ADD COLUMN IF NOT EXISTS relationships JSONB DEFAULT '[]',
    ADD COLUMN IF NOT EXISTS arc JSONB DEFAULT '{"start": null, "end": null}';
  END IF;
END $$;

-- Create scenes table
CREATE TABLE IF NOT EXISTS scenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(title) > 0),
  type TEXT NOT NULL DEFAULT 'transition' CHECK (type IN ('introduction', 'conflict', 'climax', 'resolution', 'transition')),
  "order" INTEGER NOT NULL DEFAULT 0,
  
  -- Scene components as JSONB
  pov_character_id UUID REFERENCES characters,
  goal TEXT,
  setting JSONB DEFAULT '{"location": null, "time": null, "environment": null}',
  characters JSONB DEFAULT '[]',
  events JSONB DEFAULT '{"main": null, "turningPoint": null}',
  conflicts JSONB DEFAULT '{"internal": null, "external": null}',
  dialogue JSONB DEFAULT '[]',
  background TEXT,
  outcome TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create resources table
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('url', 'note', 'image', 'reference', 'inspiration')),
  title TEXT NOT NULL CHECK (char_length(title) > 0),
  content TEXT,
  url TEXT,
  file_path TEXT,
  
  -- Tracking which entities use this resource
  linked_entities JSONB DEFAULT '{"characters": [], "scenes": [], "conflicts": [], "worldSettings": []}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create writing sessions table
CREATE TABLE IF NOT EXISTS writing_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories ON DELETE CASCADE,
  content TEXT NOT NULL DEFAULT '',
  version INTEGER NOT NULL DEFAULT 1,
  format TEXT DEFAULT 'markdown' CHECK (format IN ('markdown', 'rich-text', 'plain')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create version history table
CREATE TABLE IF NOT EXISTS writing_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  writing_session_id UUID REFERENCES writing_sessions ON DELETE CASCADE,
  content TEXT NOT NULL,
  version INTEGER NOT NULL,
  format TEXT DEFAULT 'markdown',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for all tables
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE writing_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE writing_versions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Conflicts policies
DROP POLICY IF EXISTS "Users can only access own story conflicts" ON conflicts;
CREATE POLICY "Users can only access own story conflicts" 
ON conflicts FOR ALL USING (
   EXISTS (SELECT 1 FROM stories WHERE stories.id = conflicts.story_id AND stories.user_id = auth.uid())
);

-- Characters policies
DROP POLICY IF EXISTS "Users can only access own story characters" ON characters;
CREATE POLICY "Users can only access own story characters" 
ON characters FOR ALL USING (
   EXISTS (SELECT 1 FROM stories WHERE stories.id = characters.story_id AND stories.user_id = auth.uid())
);

-- Scenes policies
DROP POLICY IF EXISTS "Users can only access own story scenes" ON scenes;
CREATE POLICY "Users can only access own story scenes" 
ON scenes FOR ALL USING (
   EXISTS (SELECT 1 FROM stories WHERE stories.id = scenes.story_id AND stories.user_id = auth.uid())
);

-- Resources policies
DROP POLICY IF EXISTS "Users can only access own story resources" ON resources;
CREATE POLICY "Users can only access own story resources" 
ON resources FOR ALL USING (
   EXISTS (SELECT 1 FROM stories WHERE stories.id = resources.story_id AND stories.user_id = auth.uid())
);

-- Writing sessions policies
DROP POLICY IF EXISTS "Users can only access own writing sessions" ON writing_sessions;
CREATE POLICY "Users can only access own writing sessions" 
ON writing_sessions FOR ALL USING (
   EXISTS (SELECT 1 FROM stories WHERE stories.id = writing_sessions.story_id AND stories.user_id = auth.uid())
);

-- Writing versions policies
DROP POLICY IF EXISTS "Users can only access own writing versions" ON writing_versions;
CREATE POLICY "Users can only access own writing versions" 
ON writing_versions FOR ALL USING (
   EXISTS (
     SELECT 1 FROM writing_sessions ws
     JOIN stories s ON ws.story_id = s.id
     WHERE ws.id = writing_versions.writing_session_id AND s.user_id = auth.uid()
   )
);

-- Performance optimization indexes
CREATE INDEX IF NOT EXISTS idx_stories_user_id ON stories(user_id);
CREATE INDEX IF NOT EXISTS idx_characters_story_id ON characters(story_id);
CREATE INDEX IF NOT EXISTS idx_scenes_story_id ON scenes(story_id);
CREATE INDEX IF NOT EXISTS idx_scenes_order ON scenes(story_id, "order");
CREATE INDEX IF NOT EXISTS idx_conflicts_story_id ON conflicts(story_id);
CREATE INDEX IF NOT EXISTS idx_resources_story_id ON resources(story_id);
CREATE INDEX IF NOT EXISTS idx_writing_sessions_story_id ON writing_sessions(story_id);

-- Add triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_stories_updated_at ON stories;
CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON stories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_conflicts_updated_at ON conflicts;
CREATE TRIGGER update_conflicts_updated_at BEFORE UPDATE ON conflicts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_characters_updated_at ON characters;
CREATE TRIGGER update_characters_updated_at BEFORE UPDATE ON characters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_scenes_updated_at ON scenes;
CREATE TRIGGER update_scenes_updated_at BEFORE UPDATE ON scenes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_resources_updated_at ON resources;
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_writing_sessions_updated_at ON writing_sessions;
CREATE TRIGGER update_writing_sessions_updated_at BEFORE UPDATE ON writing_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. RPC Functions for Unified Story Dashboard
-- Function to link a resource to an entity
CREATE OR REPLACE FUNCTION link_resource_to_entity(
  resource_id UUID,
  entity_type TEXT,
  entity_id UUID
)
RETURNS VOID AS $$
DECLARE
  current_links JSONB;
BEGIN
  -- Get current linked entities for the resource
  SELECT linked_entities INTO current_links
  FROM resources
  WHERE id = resource_id;
  
  -- Update the appropriate entity array
  IF entity_type = 'characters' THEN
    UPDATE resources
    SET linked_entities = jsonb_set(
      linked_entities,
      '{characters}',
      COALESCE(linked_entities->'characters', '[]'::jsonb) || to_jsonb(entity_id)
    )
    WHERE id = resource_id;
  ELSIF entity_type = 'scenes' THEN
    UPDATE resources
    SET linked_entities = jsonb_set(
      linked_entities,
      '{scenes}',
      COALESCE(linked_entities->'scenes', '[]'::jsonb) || to_jsonb(entity_id)
    )
    WHERE id = resource_id;
  ELSIF entity_type = 'conflicts' THEN
    UPDATE resources
    SET linked_entities = jsonb_set(
      linked_entities,
      '{conflicts}',
      COALESCE(linked_entities->'conflicts', '[]'::jsonb) || to_jsonb(entity_id)
    )
    WHERE id = resource_id;
  ELSIF entity_type = 'worldSettings' THEN
    UPDATE resources
    SET linked_entities = jsonb_set(
      linked_entities,
      '{worldSettings}',
      COALESCE(linked_entities->'worldSettings', '[]'::jsonb) || to_jsonb(entity_id)
    )
    WHERE id = resource_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to unlink a resource from an entity
CREATE OR REPLACE FUNCTION unlink_resource_from_entity(
  resource_id UUID,
  entity_type TEXT,
  entity_id UUID
)
RETURNS VOID AS $$
DECLARE
  current_links JSONB;
  updated_links JSONB;
BEGIN
  -- Get current linked entities for the resource
  SELECT linked_entities INTO current_links
  FROM resources
  WHERE id = resource_id;
  
  -- Remove the entity ID from the appropriate array
  IF entity_type = 'characters' THEN
    updated_links := current_links - 'characters' || 
      jsonb_build_object('characters', 
        (COALESCE(current_links->'characters', '[]'::jsonb) - to_jsonb(entity_id))
      );
    UPDATE resources
    SET linked_entities = updated_links
    WHERE id = resource_id;
  ELSIF entity_type = 'scenes' THEN
    updated_links := current_links - 'scenes' || 
      jsonb_build_object('scenes', 
        (COALESCE(current_links->'scenes', '[]'::jsonb) - to_jsonb(entity_id))
      );
    UPDATE resources
    SET linked_entities = updated_links
    WHERE id = resource_id;
  ELSIF entity_type = 'conflicts' THEN
    updated_links := current_links - 'conflicts' || 
      jsonb_build_object('conflicts', 
        (COALESCE(current_links->'conflicts', '[]'::jsonb) - to_jsonb(entity_id))
      );
    UPDATE resources
    SET linked_entities = updated_links
    WHERE id = resource_id;
  ELSIF entity_type = 'worldSettings' THEN
    updated_links := current_links - 'worldSettings' || 
      jsonb_build_object('worldSettings', 
        (COALESCE(current_links->'worldSettings', '[]'::jsonb) - to_jsonb(entity_id))
      );
    UPDATE resources
    SET linked_entities = updated_links
    WHERE id = resource_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reorder scenes
CREATE OR REPLACE FUNCTION reorder_scenes(
  story_id UUID,
  new_order UUID[]
)
RETURNS VOID AS $$
DECLARE
  index INTEGER := 0;
  scene_id UUID;
BEGIN
  FOREACH scene_id IN ARRAY new_order
  LOOP
    UPDATE scenes
    SET "order" = index
    WHERE id = scene_id AND story_id = story_id;
    
    index := index + 1;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on RPC functions
GRANT EXECUTE ON FUNCTION link_resource_to_entity TO anon, authenticated;
GRANT EXECUTE ON FUNCTION unlink_resource_from_entity TO anon, authenticated;
GRANT EXECUTE ON FUNCTION reorder_scenes TO anon, authenticated;

-- Migration complete - Unified Story Dashboard schema is ready!