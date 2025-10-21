-- Migration: Fix turn functions to use wallet_address instead of id
-- The client passes wallet_address (auth user ID) but functions were expecting database id

-- Drop and recreate calculate_accrued_turns to use wallet_address
DROP FUNCTION IF EXISTS calculate_accrued_turns(UUID);

CREATE OR REPLACE FUNCTION calculate_accrued_turns(
    p_wallet_address TEXT
) RETURNS TABLE (
    current_turns INTEGER,
    accrued_turns INTEGER,
    time_since_update INTERVAL,
    seconds_until_next_turn INTEGER
) AS $$
DECLARE
    v_turns INTEGER;
    v_max_turns INTEGER;
    v_last_update TIMESTAMP WITH TIME ZONE;
    v_seconds_elapsed NUMERIC;
    v_complete_intervals INTEGER;
    v_accrued INTEGER;
    v_seconds_into_current_interval NUMERIC;
    v_seconds_until_next INTEGER;
BEGIN
    -- Fetch player turn data using wallet_address
    SELECT turns, max_turns, last_turn_update
    INTO v_turns, v_max_turns, v_last_update
    FROM players
    WHERE wallet_address = p_wallet_address;

    -- If player not found, return nulls
    IF v_turns IS NULL THEN
        RAISE EXCEPTION 'Player not found with wallet_address: %', p_wallet_address;
    END IF;

    -- Calculate time elapsed in seconds
    v_seconds_elapsed := EXTRACT(EPOCH FROM (NOW() - v_last_update));

    -- Calculate complete 10-minute intervals (600 seconds each)
    v_complete_intervals := FLOOR(v_seconds_elapsed / 600);

    -- Each complete interval gives 2 turns
    v_accrued := v_complete_intervals * 2;

    -- Calculate seconds into current interval
    v_seconds_into_current_interval := v_seconds_elapsed - (v_complete_intervals * 600);

    -- Calculate seconds until next turn drop
    v_seconds_until_next := 600 - v_seconds_into_current_interval;

    -- Cap at max_turns
    v_turns := LEAST(v_turns + v_accrued, v_max_turns);

    RETURN QUERY SELECT
        v_turns::INTEGER,
        v_accrued::INTEGER,
        (NOW() - v_last_update)::INTERVAL,
        v_seconds_until_next::INTEGER;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION calculate_accrued_turns IS
'Calculates current turns using discrete accrual: 2 turns every 10 minutes (600 seconds).
Uses wallet_address (auth user ID) to look up player.
Turns accrue in chunks, not continuously. Max 200 turns = 16.67 hours to fill from empty.
Also returns seconds until next 2-turn drop for countdown timer.';

-- Also update the update_player_turns function to use wallet_address
DROP FUNCTION IF EXISTS update_player_turns(UUID, INTEGER, VARCHAR, JSONB);

CREATE OR REPLACE FUNCTION update_player_turns(
    p_wallet_address TEXT,
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
    v_player_id UUID;
BEGIN
    -- Get player database id from wallet_address
    SELECT id INTO v_player_id FROM players WHERE wallet_address = p_wallet_address;

    IF v_player_id IS NULL THEN
        RETURN QUERY SELECT FALSE, 0, 'Player not found';
        RETURN;
    END IF;

    -- Calculate current turns with accrual
    SELECT * INTO v_accrued_result FROM calculate_accrued_turns(p_wallet_address);
    v_current_turns := v_accrued_result.current_turns;

    -- Get max_turns
    SELECT max_turns INTO v_max_turns FROM players WHERE wallet_address = p_wallet_address;

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
    SET turns = v_new_turns,
        last_turn_update = NOW()
    WHERE wallet_address = p_wallet_address;

    -- Log to audit table
    INSERT INTO turn_audit_log (player_id, action, amount, turns_before, turns_after, metadata)
    VALUES (v_player_id, p_action, p_amount, v_current_turns, v_new_turns, p_metadata);

    RETURN QUERY SELECT TRUE, v_new_turns, 'Success';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION update_player_turns IS
'Updates player turn count with server-side validation and audit logging.
Uses wallet_address (auth user ID) to look up player.
Amount can be positive (grant) or negative (spend).';

-- Test the function
SELECT
    'Turn calculation test:' as test,
    current_turns,
    accrued_turns,
    time_since_update,
    seconds_until_next_turn
FROM calculate_accrued_turns('5e595399-11e1-4e2a-9fb6-c1dbff542497');
