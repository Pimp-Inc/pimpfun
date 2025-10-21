-- Migration: Add Server-Authoritative Turn System
-- This adds turn tracking columns, constraints, and audit logging to enforce server-side turn integrity

-- Step 1: Add turn-related columns to players table
ALTER TABLE players
ADD COLUMN IF NOT EXISTS turns INTEGER DEFAULT 150 CHECK (turns >= 0),
ADD COLUMN IF NOT EXISTS max_turns INTEGER DEFAULT 200 CHECK (max_turns > 0),
ADD COLUMN IF NOT EXISTS turn_regen_rate DECIMAL(5,3) DEFAULT 0.2 CHECK (turn_regen_rate > 0),
ADD COLUMN IF NOT EXISTS last_turn_update TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Step 2: Add constraint to ensure turns never exceed max_turns
ALTER TABLE players
ADD CONSTRAINT turns_not_exceed_max CHECK (turns <= max_turns);

-- Step 3: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_players_last_turn_update ON players(last_turn_update);
CREATE INDEX IF NOT EXISTS idx_players_turns ON players(turns);

-- Step 4: Create turn audit log table for tracking all turn changes
CREATE TABLE IF NOT EXISTS turn_audit_log (
    id BIGSERIAL PRIMARY KEY,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    amount INTEGER NOT NULL,
    turns_before INTEGER NOT NULL,
    turns_after INTEGER NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB,

    -- Indexes for querying
    CONSTRAINT valid_turn_change CHECK (turns_after >= 0)
);

CREATE INDEX IF NOT EXISTS idx_turn_audit_player_id ON turn_audit_log(player_id);
CREATE INDEX IF NOT EXISTS idx_turn_audit_timestamp ON turn_audit_log(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_turn_audit_action ON turn_audit_log(action);

-- Step 5: Migrate existing players (set initial values for existing rows)
UPDATE players
SET
    turns = 150,
    max_turns = 200,
    turn_regen_rate = 0.2,
    last_turn_update = NOW()
WHERE turns IS NULL OR last_turn_update IS NULL;

-- Step 6: Create function to calculate accrued turns (server-side only)
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

-- Step 7: Create function to update turns with audit logging
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

    -- Log to audit table
    INSERT INTO turn_audit_log (player_id, action, amount, turns_before, turns_after, metadata)
    VALUES (p_player_id, p_action, p_amount, v_current_turns, v_new_turns, p_metadata);

    RETURN QUERY SELECT TRUE, v_new_turns, 'Success';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 8: Create RLS (Row Level Security) policies for turn_audit_log
ALTER TABLE turn_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players can view their own turn audit logs"
ON turn_audit_log FOR SELECT
USING (auth.uid() = player_id);

-- Admins can view all audit logs (you'll need to adjust this based on your admin setup)
-- CREATE POLICY "Admins can view all turn audit logs"
-- ON turn_audit_log FOR SELECT
-- USING (auth.jwt() ->> 'role' = 'admin');

-- Step 9: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT ON turn_audit_log TO anon, authenticated;
GRANT EXECUTE ON FUNCTION calculate_accrued_turns(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION update_player_turns(UUID, INTEGER, VARCHAR, JSONB) TO anon, authenticated;

-- Step 10: Comment documentation
COMMENT ON COLUMN players.turns IS 'Current turn count (server-authoritative)';
COMMENT ON COLUMN players.max_turns IS 'Maximum turns this player can have';
COMMENT ON COLUMN players.turn_regen_rate IS 'Turns regenerated per minute';
COMMENT ON COLUMN players.last_turn_update IS 'Last time turns were updated (for calculating accrual)';
COMMENT ON TABLE turn_audit_log IS 'Audit log for all turn changes - tracks every turn spend and accrual';
COMMENT ON FUNCTION calculate_accrued_turns IS 'Calculates current turns including accrual since last update';
COMMENT ON FUNCTION update_player_turns IS 'Updates player turns with validation and audit logging';
