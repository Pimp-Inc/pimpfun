-- Create only the turn management functions (skip table alterations)
-- Run this if the functions are missing

-- Drop existing functions if they exist (to allow re-creation)
DROP FUNCTION IF EXISTS calculate_accrued_turns(UUID);
DROP FUNCTION IF EXISTS update_player_turns(UUID, INTEGER, VARCHAR, JSONB);

-- Function to calculate accrued turns (server-side only)
CREATE OR REPLACE FUNCTION calculate_accrued_turns(
    p_player_id UUID
) RETURNS TABLE (
    current_turns INTEGER,
    accrued_turns INTEGER,
    time_since_update INTERVAL
) AS $$
DECLARE
    v_turns INTEGER;
    v_max_turns INTEGER;
    v_regen_rate DECIMAL(5,3);
    v_last_update TIMESTAMP WITH TIME ZONE;
    v_seconds_elapsed NUMERIC;
    v_accrued INTEGER;
BEGIN
    -- Fetch player turn data
    SELECT turns, max_turns, turn_regen_rate, last_turn_update
    INTO v_turns, v_max_turns, v_regen_rate, v_last_update
    FROM players
    WHERE id = p_player_id;

    -- Handle case where player not found
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Player not found: %', p_player_id;
    END IF;

    -- Calculate time elapsed in seconds
    v_seconds_elapsed := EXTRACT(EPOCH FROM (NOW() - v_last_update));

    -- Calculate accrued turns (regen_rate is per minute)
    -- Convert seconds to minutes, multiply by rate
    v_accrued := FLOOR((v_seconds_elapsed / 60) * v_regen_rate);

    -- Cap at max_turns
    v_turns := LEAST(v_turns + v_accrued, v_max_turns);

    RETURN QUERY SELECT v_turns, v_accrued, (NOW() - v_last_update);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update turns with audit logging
CREATE OR REPLACE FUNCTION update_player_turns(
    p_player_id UUID,
    p_amount INTEGER,
    p_action VARCHAR(50),
    p_metadata JSONB DEFAULT NULL
) RETURNS TABLE (
    success BOOLEAN,
    new_turn_count INTEGER,
    message TEXT
) AS $$
DECLARE
    v_current_turns INTEGER;
    v_max_turns INTEGER;
    v_new_turns INTEGER;
    v_accrued_result RECORD;
BEGIN
    -- Calculate current turns with accrual
    SELECT * INTO v_accrued_result FROM calculate_accrued_turns(p_player_id);
    v_current_turns := v_accrued_result.current_turns;

    -- Get max_turns
    SELECT max_turns INTO v_max_turns FROM players WHERE id = p_player_id;

    -- Calculate new turn count
    v_new_turns := v_current_turns + p_amount;

    -- Validate: cannot go negative
    IF v_new_turns < 0 THEN
        RETURN QUERY SELECT FALSE, v_current_turns, 'Insufficient turns';
        RETURN;
    END IF;

    -- Cap at max_turns
    v_new_turns := LEAST(v_new_turns, v_max_turns);

    -- Update player turns
    UPDATE players
    SET
        turns = v_new_turns,
        last_turn_update = NOW()
    WHERE id = p_player_id;

    -- Log to audit table (only if table exists)
    BEGIN
        INSERT INTO turn_audit_log (player_id, action, amount, turns_before, turns_after, metadata)
        VALUES (p_player_id, p_action, p_amount, v_current_turns, v_new_turns, p_metadata);
    EXCEPTION
        WHEN undefined_table THEN
            -- Ignore if audit table doesn't exist yet
            NULL;
    END;

    RETURN QUERY SELECT TRUE, v_new_turns, 'Success'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION calculate_accrued_turns(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION update_player_turns(UUID, INTEGER, VARCHAR, JSONB) TO anon, authenticated;

-- Verify functions were created
SELECT
    'Functions created successfully' as status,
    routine_name
FROM information_schema.routines
WHERE routine_name IN ('calculate_accrued_turns', 'update_player_turns')
AND routine_schema = 'public';
