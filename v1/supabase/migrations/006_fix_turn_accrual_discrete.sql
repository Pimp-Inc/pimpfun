-- Migration: Fix Turn Accrual to Discrete 2-Turn Chunks Every 10 Minutes
-- Current: 0.2 turns/min (continuous)
-- Correct: 2 turns every 10 minutes (discrete chunks)

-- Update the calculate_accrued_turns function to use discrete 10-minute intervals
CREATE OR REPLACE FUNCTION calculate_accrued_turns(
    p_player_id UUID
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
    -- Fetch player turn data
    SELECT turns, max_turns, last_turn_update
    INTO v_turns, v_max_turns, v_last_update
    FROM players
    WHERE id = p_player_id;

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

-- Update turn_regen_rate to reflect the new system (not used in calculation anymore, but good for display)
-- This is effectively 2 turns / 10 minutes = 0.2 turns/minute but we calculate discretely
UPDATE players
SET turn_regen_rate = 0.2;

-- Add comment explaining the discrete system
COMMENT ON FUNCTION calculate_accrued_turns IS
'Calculates current turns using discrete accrual: 2 turns every 10 minutes (600 seconds).
Turns accrue in chunks, not continuously. Max 200 turns = 16.67 hours to fill from empty.
Also returns seconds until next 2-turn drop for countdown timer.';

-- Verify the function works
SELECT
    'Turn calculation test for player (if exists):' as test,
    current_turns,
    accrued_turns,
    time_since_update,
    seconds_until_next_turn,
    CONCAT(FLOOR(seconds_until_next_turn / 60), 'm ', MOD(seconds_until_next_turn, 60), 's') as countdown
FROM calculate_accrued_turns(
    (SELECT id FROM players LIMIT 1)
);
