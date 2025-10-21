-- Diagnostic Query: Check Turn System Setup
-- Run this to verify everything is configured correctly

-- 1. Check if turn columns exist on players table
SELECT
    'Turn Columns Check' as test_name,
    COUNT(*) as columns_found,
    CASE
        WHEN COUNT(*) = 4 THEN '✅ PASS'
        ELSE '❌ FAIL - Missing columns'
    END as status
FROM information_schema.columns
WHERE table_name = 'players'
AND column_name IN ('turns', 'max_turns', 'turn_regen_rate', 'last_turn_update');

-- 2. Check if functions exist
SELECT
    'Database Functions Check' as test_name,
    COUNT(*) as functions_found,
    CASE
        WHEN COUNT(*) = 2 THEN '✅ PASS'
        ELSE '❌ FAIL - Missing functions'
    END as status
FROM information_schema.routines
WHERE routine_name IN ('calculate_accrued_turns', 'update_player_turns')
AND routine_schema = 'public';

-- 3. Check if audit log table exists
SELECT
    'Audit Log Table Check' as test_name,
    CASE
        WHEN COUNT(*) > 0 THEN '✅ PASS'
        ELSE '❌ FAIL - Table missing'
    END as status
FROM information_schema.tables
WHERE table_name = 'turn_audit_log';

-- 4. Check your actual player data
SELECT
    id as player_uuid,
    wallet_address,
    username,
    turns,
    max_turns,
    turn_regen_rate,
    last_turn_update
FROM players
WHERE wallet_address = auth.uid()::text  -- Your auth ID
LIMIT 1;

-- 5. Test the calculate_accrued_turns function with your player
-- Replace with your player UUID from the query above
-- SELECT * FROM calculate_accrued_turns('YOUR_PLAYER_UUID_HERE');

-- 6. Check if RLS policies exist
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename IN ('players', 'turn_audit_log')
ORDER BY tablename, policyname;
