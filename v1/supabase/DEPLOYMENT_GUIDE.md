# Server-Authoritative Turn System Deployment Guide

This guide walks you through deploying the server-side turn management system to Supabase.

## Prerequisites

- [x] Supabase project created
- [x] Supabase CLI installed (optional, for Edge Functions)
- [x] Database admin access
- [x] Backup of current database

## Step 1: Run Database Migration

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the file: `supabase/migrations/001_add_turn_system.sql`
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click **Run** (or press Ctrl+Enter)
7. Verify no errors in the output

### Option B: Using Supabase CLI

```bash
# From the v1/ directory
supabase db push

# Or apply the migration manually
supabase db execute -f supabase/migrations/001_add_turn_system.sql
```

### What This Does:
- ✅ Adds `turns`, `max_turns`, `turn_regen_rate`, `last_turn_update` columns to `players` table
- ✅ Creates `turn_audit_log` table for tracking all turn changes
- ✅ Adds database constraints (turns >= 0, turns <= max_turns)
- ✅ Creates PostgreSQL functions for server-side turn calculations
- ✅ Migrates existing players (sets initial values)
- ✅ Creates indexes for performance
- ✅ Sets up Row Level Security (RLS) policies

## Step 2: Verify Migration Success

Run this query in the SQL Editor to verify everything was created:

```sql
-- Check if columns were added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'players'
AND column_name IN ('turns', 'max_turns', 'turn_regen_rate', 'last_turn_update');

-- Check if turn_audit_log table was created
SELECT * FROM turn_audit_log LIMIT 1;

-- Check if functions were created
SELECT routine_name
FROM information_schema.routines
WHERE routine_name IN ('calculate_accrued_turns', 'update_player_turns');

-- Check if existing players were migrated
SELECT id, username, turns, max_turns, turn_regen_rate, last_turn_update
FROM players
LIMIT 5;
```

Expected output:
- 4 columns showing in the first query
- No error when selecting from `turn_audit_log`
- 2 functions showing in the third query
- All players should have `turns = 150`, `max_turns = 200`, `turn_regen_rate = 0.2`

## Step 3: Deploy Edge Function (Optional - Advanced)

**Note**: The Edge Function in `supabase/functions/turn-management/` is optional. The database functions in the migration already provide server-side turn management. The Edge Function is only needed if you want a REST API endpoint.

### If You Want the Edge Function:

```bash
# Install Supabase CLI if not installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy the function
supabase functions deploy turn-management

# Set environment variables (if needed)
supabase secrets set SUPABASE_URL=your-url
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-key
```

**Without Edge Function**: The turn system will still work perfectly using the database functions through the Supabase client (already implemented in `supabase-config.js`).

## Step 4: Test the Turn System

### Test in SQL Editor:

```sql
-- Test getting turns for a player (replace with your player ID)
SELECT * FROM calculate_accrued_turns('YOUR_PLAYER_UUID');

-- Test spending turns
SELECT * FROM update_player_turns(
    'YOUR_PLAYER_UUID',
    -30,
    'test_spend',
    '{"action": "scout", "district": "Times Square"}'::jsonb
);

-- Check audit log
SELECT * FROM turn_audit_log WHERE player_id = 'YOUR_PLAYER_UUID' ORDER BY timestamp DESC LIMIT 10;
```

### Test in Browser Console:

Once you've deployed and loaded the updated `supabase-config.js`:

```javascript
// Get current turns
const turnsResult = await SupabaseAPI.getTurns('YOUR_PLAYER_ID');
console.log('Current turns:', turnsResult);

// Spend turns
const spendResult = await SupabaseAPI.spendTurns('YOUR_PLAYER_ID', 30, 'scout', {
    district: 'Times Square',
    action: 'scout'
});
console.log('After spending:', spendResult);

// Grant bonus turns
const grantResult = await SupabaseAPI.grantTurns('YOUR_PLAYER_ID', 10, 'vote_bonus');
console.log('After bonus:', grantResult);

// View audit logs
const auditResult = await SupabaseAPI.getTurnAuditLogs('YOUR_PLAYER_ID');
console.log('Audit logs:', auditResult);
```

## Step 5: Update Client Code (Next Phase)

After verifying the database migration works, you'll need to:

1. Update `index.html` to use the new `SupabaseAPI.getTurns()` and `SupabaseAPI.spendTurns()` functions
2. Remove client-side turn calculations
3. Add turn sync system
4. Update all turn-spending actions

See the main implementation guide in TODO.md for details.

## Troubleshooting

### Error: "function calculate_accrued_turns does not exist"
- The migration didn't run successfully
- Re-run the migration SQL
- Check for errors in the SQL output

### Error: "column 'turns' does not exist"
- The ALTER TABLE statements didn't execute
- Run the migration again
- Check if your database user has ALTER TABLE permissions

### Error: "permission denied for table turn_audit_log"
- RLS policies might be too restrictive
- Check the GRANT statements ran successfully
- Verify you're using the correct authentication

### Turns not accruing correctly
- Check `last_turn_update` is being set correctly
- Verify `turn_regen_rate` is 0.2 (2 turns per 10 minutes)
- Check server time vs client time sync

## Rollback (If Needed)

If something goes wrong, you can rollback the migration:

```sql
-- Drop the functions
DROP FUNCTION IF EXISTS calculate_accrued_turns(UUID);
DROP FUNCTION IF EXISTS update_player_turns(UUID, INTEGER, VARCHAR, JSONB);

-- Drop the audit log table
DROP TABLE IF EXISTS turn_audit_log;

-- Remove the columns (WARNING: This deletes turn data!)
ALTER TABLE players
DROP COLUMN IF EXISTS turns,
DROP COLUMN IF EXISTS max_turns,
DROP COLUMN IF EXISTS turn_regen_rate,
DROP COLUMN IF EXISTS last_turn_update;
```

## Next Steps

After successful deployment:

1. ✅ Test the turn system in SQL Editor
2. ✅ Test via browser console
3. ✅ Update client-side code to use server API
4. ✅ Add turn sync system (60s auto-sync)
5. ✅ Monitor audit logs for anomalies

## Support

If you encounter issues:

1. Check Supabase logs in the dashboard
2. Enable debug logging: `console.log` in supabase-config.js
3. Review audit logs for suspicious activity
4. Check database constraints aren't blocking valid operations

---

**Security Note**: This system is designed to be server-authoritative. Never allow client-side turn modifications. All turn operations MUST go through the Supabase API functions.
