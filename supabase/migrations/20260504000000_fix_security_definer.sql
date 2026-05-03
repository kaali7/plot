-- Fix 1: link_resource_to_entity — add ownership check
CREATE OR REPLACE FUNCTION link_resource_to_entity(
  p_resource_id UUID,
  p_entity_type TEXT,
  p_entity_id UUID
)
RETURNS VOID AS $$
DECLARE
  v_story_id UUID;
BEGIN
  -- Verify the calling user owns the story that contains this resource
  SELECT r.story_id INTO v_story_id
  FROM resources r
  JOIN stories s ON r.story_id = s.id
  WHERE r.id = p_resource_id AND s.user_id = auth.uid();

  IF v_story_id IS NULL THEN
    RAISE EXCEPTION 'Access denied: resource not found or not owned by current user';
  END IF;

  -- Perform the link update
  IF p_entity_type = 'characters' THEN
    UPDATE resources
    SET linked_entities = jsonb_set(
      linked_entities,
      '{characters}',
      COALESCE(linked_entities->'characters', '[]'::jsonb) || to_jsonb(p_entity_id)
    )
    WHERE id = p_resource_id;
  ELSIF p_entity_type = 'scenes' THEN
    UPDATE resources
    SET linked_entities = jsonb_set(
      linked_entities,
      '{scenes}',
      COALESCE(linked_entities->'scenes', '[]'::jsonb) || to_jsonb(p_entity_id)
    )
    WHERE id = p_resource_id;
  ELSIF p_entity_type = 'conflicts' THEN
    UPDATE resources
    SET linked_entities = jsonb_set(
      linked_entities,
      '{conflicts}',
      COALESCE(linked_entities->'conflicts', '[]'::jsonb) || to_jsonb(p_entity_id)
    )
    WHERE id = p_resource_id;
  ELSIF p_entity_type = 'worldSettings' THEN
    UPDATE resources
    SET linked_entities = jsonb_set(
      linked_entities,
      '{worldSettings}',
      COALESCE(linked_entities->'worldSettings', '[]'::jsonb) || to_jsonb(p_entity_id)
    )
    WHERE id = p_resource_id;
  ELSE
    RAISE EXCEPTION 'Invalid entity_type: %', p_entity_type;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Fix 2: unlink_resource_from_entity — add ownership check
CREATE OR REPLACE FUNCTION unlink_resource_from_entity(
  p_resource_id UUID,
  p_entity_type TEXT,
  p_entity_id UUID
)
RETURNS VOID AS $$
DECLARE
  v_story_id UUID;
  current_links JSONB;
  updated_links JSONB;
BEGIN
  -- Verify ownership
  SELECT r.story_id INTO v_story_id
  FROM resources r
  JOIN stories s ON r.story_id = s.id
  WHERE r.id = p_resource_id AND s.user_id = auth.uid();

  IF v_story_id IS NULL THEN
    RAISE EXCEPTION 'Access denied: resource not found or not owned by current user';
  END IF;

  SELECT linked_entities INTO current_links
  FROM resources WHERE id = p_resource_id;

  IF p_entity_type = 'characters' THEN
    updated_links := current_links - 'characters' ||
      jsonb_build_object('characters',
        (COALESCE(current_links->'characters', '[]'::jsonb) - to_jsonb(p_entity_id))
      );
  ELSIF p_entity_type = 'scenes' THEN
    updated_links := current_links - 'scenes' ||
      jsonb_build_object('scenes',
        (COALESCE(current_links->'scenes', '[]'::jsonb) - to_jsonb(p_entity_id))
      );
  ELSIF p_entity_type = 'conflicts' THEN
    updated_links := current_links - 'conflicts' ||
      jsonb_build_object('conflicts',
        (COALESCE(current_links->'conflicts', '[]'::jsonb) - to_jsonb(p_entity_id))
      );
  ELSIF p_entity_type = 'worldSettings' THEN
    updated_links := current_links - 'worldSettings' ||
      jsonb_build_object('worldSettings',
        (COALESCE(current_links->'worldSettings', '[]'::jsonb) - to_jsonb(p_entity_id))
      );
  ELSE
    RAISE EXCEPTION 'Invalid entity_type: %', p_entity_type;
  END IF;

  UPDATE resources SET linked_entities = updated_links WHERE id = p_resource_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Fix 3: reorder_scenes — fix variable shadowing + add ownership check
CREATE OR REPLACE FUNCTION reorder_scenes(
  p_story_id UUID,
  p_new_order UUID[]
)
RETURNS VOID AS $$
DECLARE
  v_index INTEGER := 0;
  v_scene_id UUID;
  v_owner_id UUID;
BEGIN
  -- Verify the calling user owns this story
  SELECT user_id INTO v_owner_id FROM stories WHERE id = p_story_id;
  IF v_owner_id IS NULL OR v_owner_id != auth.uid() THEN
    RAISE EXCEPTION 'Access denied: story not found or not owned by current user';
  END IF;

  FOREACH v_scene_id IN ARRAY p_new_order
  LOOP
    UPDATE scenes
    SET "order" = v_index
    WHERE id = v_scene_id AND scenes.story_id = p_story_id;
    v_index := v_index + 1;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
