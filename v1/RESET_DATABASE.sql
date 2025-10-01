-- =============================================================================
-- PIMP.FUN SUPABASE DATABASE RESET
-- =============================================================================
-- Run this script in your Supabase SQL Editor to completely reset the database
-- WARNING: This will delete ALL player data and start fresh!
-- =============================================================================

-- 1. Delete all player data (this cascades to related tables)
DELETE FROM players;

-- 2. Delete all crew data
DELETE FROM crews;

-- 3. Delete all combat history
DELETE FROM combat_history;

-- 4. Delete all leaderboard entries  
DELETE FROM leaderboards;

-- 5. Delete all messages
DELETE FROM messages;

-- 6. Reset any sequences (if they exist)
-- ALTER SEQUENCE players_id_seq RESTART WITH 1;

-- 7. Verify tables are empty
SELECT 'Players remaining:' as table_name, COUNT(*) as count FROM players
UNION ALL
SELECT 'Crews remaining:' as table_name, COUNT(*) as count FROM crews
UNION ALL
SELECT 'Combat history remaining:' as table_name, COUNT(*) as count FROM combat_history
UNION ALL
SELECT 'Leaderboard entries remaining:' as table_name, COUNT(*) as count FROM leaderboards
UNION ALL
SELECT 'Messages remaining:' as table_name, COUNT(*) as count FROM messages;

-- =============================================================================
-- RESULT: Fresh database ready for new player signups
-- =============================================================================
-- After running this script:
-- ✅ All player accounts deleted
-- ✅ All progress reset  
-- ✅ All leaderboards cleared
-- ✅ Database ready for clean 1000 user rollout
-- =============================================================================

