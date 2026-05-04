-- Schema Health Check & Cache Reload
-- Run this if you are experiencing 406 (Not Acceptable) errors.

-- 1. Reload the PostgREST schema cache
NOTIFY pgrst, 'reload schema';

-- 2. Verify table structures
DO $$
DECLARE
    v_table_name TEXT;
    v_column_count INTEGER;
BEGIN
    FOR v_table_name IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('stories', 'characters', 'scenes', 'conflicts', 'resources', 'writing_sessions')
    LOOP
        SELECT count(*) INTO v_column_count FROM information_schema.columns WHERE table_schema = 'public' AND table_name = v_table_name;
        RAISE NOTICE 'Table % has % columns.', v_table_name, v_column_count;
    END LOOP;
END $$;

-- 3. Verify RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('stories', 'characters', 'scenes', 'conflicts', 'resources', 'writing_sessions');
