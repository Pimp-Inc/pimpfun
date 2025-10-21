-- Check if turn columns exist, and add them if missing
-- This is a safe "idempotent" migration that won't break if run multiple times

DO $$
BEGIN
    -- Check and add 'turns' column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'players' AND column_name = 'turns'
    ) THEN
        ALTER TABLE players ADD COLUMN turns INTEGER DEFAULT 150;
        RAISE NOTICE 'Added turns column';
    ELSE
        RAISE NOTICE 'turns column already exists';
    END IF;

    -- Check and add 'max_turns' column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'players' AND column_name = 'max_turns'
    ) THEN
        ALTER TABLE players ADD COLUMN max_turns INTEGER DEFAULT 200;
        RAISE NOTICE 'Added max_turns column';
    ELSE
        RAISE NOTICE 'max_turns column already exists';
    END IF;

    -- Check and add 'turn_regen_rate' column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'players' AND column_name = 'turn_regen_rate'
    ) THEN
        ALTER TABLE players ADD COLUMN turn_regen_rate DECIMAL(5,3) DEFAULT 0.2;
        RAISE NOTICE 'Added turn_regen_rate column';
    ELSE
        RAISE NOTICE 'turn_regen_rate column already exists';
    END IF;

    -- Check and add 'last_turn_update' column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'players' AND column_name = 'last_turn_update'
    ) THEN
        ALTER TABLE players ADD COLUMN last_turn_update TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Added last_turn_update column';
    ELSE
        RAISE NOTICE 'last_turn_update column already exists';
    END IF;
END $$;

-- Update existing players with default values if they have NULL
UPDATE players
SET
    turns = COALESCE(turns, 150),
    max_turns = COALESCE(max_turns, 200),
    turn_regen_rate = COALESCE(turn_regen_rate, 0.2),
    last_turn_update = COALESCE(last_turn_update, NOW())
WHERE turns IS NULL
   OR max_turns IS NULL
   OR turn_regen_rate IS NULL
   OR last_turn_update IS NULL;

-- Verify the columns exist
SELECT
    'Verification: Turn columns' as status,
    COUNT(*) as columns_found
FROM information_schema.columns
WHERE table_name = 'players'
AND column_name IN ('turns', 'max_turns', 'turn_regen_rate', 'last_turn_update');
