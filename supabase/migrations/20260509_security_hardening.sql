-- Revoke anon access from SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION link_resource_to_entity FROM anon;
REVOKE EXECUTE ON FUNCTION unlink_resource_from_entity FROM anon;
REVOKE EXECUTE ON FUNCTION reorder_scenes FROM anon;

-- Add deduplication to link_resource_to_entity
CREATE OR REPLACE FUNCTION link_resource_to_entity(
  p_resource_id UUID,
  p_entity_type TEXT,
  p_entity_id UUID
)
RETURNS VOID AS $$
DECLARE
  v_story_id UUID;
  v_current_links JSONB;
BEGIN
  SELECT r.story_id, r.linked_entities INTO v_story_id, v_current_links
  FROM resources r
  JOIN stories s ON r.story_id = s.id
  WHERE r.id = p_resource_id AND s.user_id = auth.uid();

  IF v_story_id IS NULL THEN
    RAISE EXCEPTION 'Access denied: resource not found or not owned by current user';
  END IF;

  -- Skip if already linked (deduplication)
  IF COALESCE(v_current_links->p_entity_type, '[]'::jsonb) ? p_entity_id::text THEN
    RETURN;
  END IF;

  UPDATE resources
  SET linked_entities = jsonb_set(
    linked_entities,
    ARRAY[p_entity_type],
    COALESCE(linked_entities->p_entity_type, '[]'::jsonb) || to_jsonb(p_entity_id)
  )
  WHERE id = p_resource_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-grant only to authenticated
GRANT EXECUTE ON FUNCTION link_resource_to_entity TO authenticated;
GRANT EXECUTE ON FUNCTION unlink_resource_from_entity TO authenticated;
GRANT EXECUTE ON FUNCTION reorder_scenes TO authenticated;
