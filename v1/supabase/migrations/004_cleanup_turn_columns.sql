-- Cleanup: Remove duplicate turn columns and migrate data

-- Step 1: Migrate data from old columns to new columns (if old columns have data)
UPDATE players
SET
    turns = COALESCE(turns, turns_when_last_checked, 150),
    turn_regen_rate = COALESCE(turn_regen_rate, regen_rate, 0.2)
WHERE turns IS NULL OR turn_regen_rate IS NULL;

-- Step 2: Drop the old turn columns (they're replaced by the new system)
ALTER TABLE players DROP COLUMN IF EXISTS turns_when_last_checked;
ALTER TABLE players DROP COLUMN IF EXISTS regen_rate;
ALTER TABLE players DROP COLUMN IF EXISTS last_action_time;

-- Step 3: Verify cleanup
SELECT
    'Turn columns after cleanup' as status,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name = 'players'
AND column_name LIKE '%turn%'
ORDER BY column_name;
