-- Add JSONB column for structured overview data
ALTER TABLE stories ADD COLUMN overview_json JSONB DEFAULT '{}'::jsonb;

-- Create index for JSON queries
CREATE INDEX idx_stories_overview_json ON stories USING gin (overview_json);

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