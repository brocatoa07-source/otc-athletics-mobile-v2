-- Mark messages as read for the currently authenticated user.
-- Uses SECURITY DEFINER so callers bypass RLS on the messages table.
-- Derives user from auth.uid() so the caller cannot spoof a different user.
-- Only appends the user id to read_by when not already present.

CREATE OR REPLACE FUNCTION mark_messages_read(
  p_message_ids uuid[]
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
BEGIN
  UPDATE messages
  SET read_by = array_append(read_by, v_user_id)
  WHERE id = ANY(p_message_ids)
    AND NOT (v_user_id = ANY(read_by));
END;
$$;
