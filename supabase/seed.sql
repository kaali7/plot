-- Seed data for Plot Application
-- This script inserts a sample story and character for testing purposes.

-- IMPORTANT: Replace 'YOUR_USER_ID' with a valid UUID from your auth.users table if running manually.
-- Or use the first user in the system if available:
DO $$
DECLARE
    v_user_id UUID;
    v_story_id UUID := gen_random_uuid();
BEGIN
    -- Find the specific user for seeding
    SELECT id INTO v_user_id FROM auth.users LIMIT 1;

    IF v_user_id IS NULL THEN
        RAISE NOTICE 'No users found. Please sign up first before running seed.';
        RETURN;
    END IF;

    -- 1. Insert a Sample Story
    INSERT INTO stories (
        id, 
        user_id, 
        title, 
        name,
        theme, 
        description, 
        world_settings
    ) VALUES (
        v_story_id,
        v_user_id,
        'The Neon Manuscript',
        'The Neon Manuscript',
        'Cyberpunk Noir / Existential Dread',
        'In a city where memories are traded like currency, a low-level data courier discovers a fragment of a lost history that could dismantle the digital hegemony.',
        '{
            "locations": ["Neo-Veridia", "The Under-Net", "Sanctum Heights"],
            "timePeriod": "2184 AD",
            "atmosphere": "Rain-slicked, neon-drenched, oppressive",
            "environmentDescription": "A sprawling megacity built on the ruins of the old world.",
            "linkedResources": []
        }'::jsonb
    );

    -- 2. Insert a Sample Character
    INSERT INTO characters (
        story_id,
        name,
        role,
        description,
        motivation,
        traits,
        conflicts,
        arc
    ) VALUES (
        v_story_id,
        'Kaelen Vane',
        'main',
        'A cynical data courier with a flickering cybernetic eye and a penchant for vintage physical books.',
        '{
            "goal": "Deliver the package and disappear",
            "fear": "Permanent deletion of his identity",
            "desire": "To see the real sun at least once"
        }'::jsonb,
        '{
            "strengths": ["Agile", "Sharp intuition", "Expert navigator"],
            "weaknesses": ["Socially isolated", "Addicted to stim-patches"],
            "personality": ["Cynical", "Quiet", "Determined"]
        }'::jsonb,
        '{
            "internal": "The struggle between survival and morality",
            "external": "Pursued by CorpSec assassins"
        }'::jsonb,
        '{
            "start": "Disillusioned loner running from his past",
            "end": "The spark that ignites a digital revolution"
        }'::jsonb
    );

    -- 3. Insert a Sample Conflict
    INSERT INTO conflicts (
        story_id,
        title,
        type,
        description
    ) VALUES (
        v_story_id,
        'Memory Fragmentation',
        'internal',
        'Kaelen''s own memories are beginning to overwrite the data he carries.'
    );

    -- 4. Insert a Sample Scene
    INSERT INTO scenes (
        story_id,
        title,
        type,
        "order",
        goal,
        setting,
        background,
        context,
        situation_details,
        outcome,
        impact
    ) VALUES (
        v_story_id,
        'The Drop-off',
        'conflict',
        0,
        'Reach the contact without being scanned.',
        '{"location": "Sector 4 Warehouse", "time": "02:44", "environment": "Freezing"}'::jsonb,
        'The air is thick with the smell of ozone and rotting kelp.',
        'Kaelen has been waiting for two hours. The contact is late.',
        'The warehouse is a known neutral zone, but CorpSec has been raiding them lately.',
        'The contact arrives but is wounded.',
        'Kaelen is now forced to protect the contact instead of just delivering.'
    );

    -- 5. Insert an Initial Writing Session
    INSERT INTO writing_sessions (
        story_id,
        content,
        version
    ) VALUES (
        v_story_id,
        '# Chapter 1: The Rain in Neo-Veridia\n\nThe rain didn''t fall in Neo-Veridia; it settled like a heavy, electric shroud. Kaelen Vane adjusted his collar, the synthetic leather squeaking against his damp skin.',
        1
    );

    RAISE NOTICE 'Seed data successfully inserted for story: The Neon Manuscript';
END $$;
