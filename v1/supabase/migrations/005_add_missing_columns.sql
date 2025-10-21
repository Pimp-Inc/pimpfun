-- Migration: Add missing columns (district, weapons, vehicles)
-- This fixes the PGRST204 error and adds storage for weapons/vehicles

-- Add district column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'players' AND column_name = 'district') THEN
        ALTER TABLE players ADD COLUMN district TEXT;
        COMMENT ON COLUMN players.district IS 'Current district the player is in';
    END IF;
END $$;

-- Add weapons column if it doesn't exist (store as integer for count)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'players' AND column_name = 'weapons') THEN
        ALTER TABLE players ADD COLUMN weapons INTEGER DEFAULT 0;
        COMMENT ON COLUMN players.weapons IS 'Total weapon count';
    END IF;
END $$;

-- Add vehicles column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'players' AND column_name = 'vehicles') THEN
        ALTER TABLE players ADD COLUMN vehicles INTEGER DEFAULT 0;
        COMMENT ON COLUMN players.vehicles IS 'Total vehicle count';
    END IF;
END $$;

-- Add weapons_data JSONB column for detailed weapon breakdown
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'players' AND column_name = 'weapons_data') THEN
        ALTER TABLE players ADD COLUMN weapons_data JSONB DEFAULT '{}'::jsonb;
        COMMENT ON COLUMN players.weapons_data IS 'Detailed weapon inventory (by type)';
    END IF;
END $$;

-- Add vehicles_data JSONB column for detailed vehicle breakdown
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'players' AND column_name = 'vehicles_data') THEN
        ALTER TABLE players ADD COLUMN vehicles_data JSONB DEFAULT '{}'::jsonb;
        COMMENT ON COLUMN players.vehicles_data IS 'Detailed vehicle inventory (by type)';
    END IF;
END $$;

-- Update existing players to have default values
UPDATE players
SET district = COALESCE(district, 'None'),
    weapons = COALESCE(weapons, 0),
    vehicles = COALESCE(vehicles, 0),
    weapons_data = COALESCE(weapons_data, '{}'::jsonb),
    vehicles_data = COALESCE(vehicles_data, '{}'::jsonb)
WHERE district IS NULL
   OR weapons IS NULL
   OR vehicles IS NULL
   OR weapons_data IS NULL
   OR vehicles_data IS NULL;

-- Verify columns were added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'players'
  AND column_name IN ('district', 'weapons', 'vehicles', 'weapons_data', 'vehicles_data')
ORDER BY column_name;
