// Supabase Edge Function: Turn Management
// Server-authoritative turn system - NEVER TRUST THE CLIENT
// Handles all turn operations: get, spend, grant, reset

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TurnRequest {
  action: 'get' | 'spend' | 'grant' | 'reset' | 'audit'
  playerId?: string
  amount?: number
  reason?: string
  metadata?: Record<string, any>
}

interface TurnResponse {
  success: boolean
  turns?: number
  message?: string
  error?: string
  accrued?: number
  timeSinceUpdate?: string
  auditLogs?: any[]
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client with service role key for admin operations
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Parse request
    const requestData: TurnRequest = await req.json()
    const { action, playerId, amount, reason, metadata } = requestData

    console.log(`🎯 Turn Management Request: ${action}`, { playerId, amount, reason })

    // Validate required fields
    if (!playerId && action !== 'audit') {
      return new Response(
        JSON.stringify({ success: false, error: 'playerId is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    let response: TurnResponse

    switch (action) {
      case 'get':
        response = await getTurns(supabaseClient, playerId!)
        break

      case 'spend':
        if (!amount || amount <= 0) {
          return new Response(
            JSON.stringify({ success: false, error: 'Invalid spend amount' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }
        response = await spendTurns(supabaseClient, playerId!, amount, reason || 'turn_spend', metadata)
        break

      case 'grant':
        if (!amount || amount <= 0) {
          return new Response(
            JSON.stringify({ success: false, error: 'Invalid grant amount' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }
        response = await grantTurns(supabaseClient, playerId!, amount, reason || 'turn_grant', metadata)
        break

      case 'reset':
        response = await resetTurns(supabaseClient, playerId!)
        break

      case 'audit':
        response = await getAuditLogs(supabaseClient, playerId)
        break

      default:
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid action' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('❌ Turn Management Error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

// Get current turns (with accrual calculation)
async function getTurns(supabase: any, playerId: string): Promise<TurnResponse> {
  try {
    // Use the database function to calculate accrued turns
    const { data, error } = await supabase.rpc('calculate_accrued_turns', {
      p_player_id: playerId
    })

    if (error) throw error

    if (!data || data.length === 0) {
      return { success: false, error: 'Player not found' }
    }

    const result = data[0]

    // Update the player's turn count in the database
    await supabase
      .from('players')
      .update({
        turns: result.current_turns,
        last_turn_update: new Date().toISOString()
      })
      .eq('id', playerId)

    return {
      success: true,
      turns: result.current_turns,
      accrued: result.accrued_turns,
      timeSinceUpdate: result.time_since_update,
      message: 'Turns retrieved successfully'
    }
  } catch (error) {
    console.error('Error getting turns:', error)
    return { success: false, error: error.message }
  }
}

// Spend turns (with validation)
async function spendTurns(
  supabase: any,
  playerId: string,
  amount: number,
  reason: string,
  metadata?: Record<string, any>
): Promise<TurnResponse> {
  try {
    // Use the database function to update turns with validation
    const { data, error } = await supabase.rpc('update_player_turns', {
      p_player_id: playerId,
      p_amount: -amount, // Negative for spending
      p_action: reason,
      p_metadata: metadata ? JSON.stringify(metadata) : null
    })

    if (error) throw error

    const result = data[0]

    if (!result.success) {
      return {
        success: false,
        error: result.message,
        turns: result.new_turn_count
      }
    }

    console.log(`✅ Spent ${amount} turns for ${playerId}. New count: ${result.new_turn_count}`)

    return {
      success: true,
      turns: result.new_turn_count,
      message: result.message
    }
  } catch (error) {
    console.error('Error spending turns:', error)
    return { success: false, error: error.message }
  }
}

// Grant turns (admin function, bonus, etc.)
async function grantTurns(
  supabase: any,
  playerId: string,
  amount: number,
  reason: string,
  metadata?: Record<string, any>
): Promise<TurnResponse> {
  try {
    // Use the database function to update turns
    const { data, error } = await supabase.rpc('update_player_turns', {
      p_player_id: playerId,
      p_amount: amount, // Positive for granting
      p_action: reason,
      p_metadata: metadata ? JSON.stringify(metadata) : null
    })

    if (error) throw error

    const result = data[0]

    console.log(`✅ Granted ${amount} turns to ${playerId}. New count: ${result.new_turn_count}`)

    return {
      success: true,
      turns: result.new_turn_count,
      message: result.message
    }
  } catch (error) {
    console.error('Error granting turns:', error)
    return { success: false, error: error.message }
  }
}

// Reset turns to starting amount (admin/recovery function)
async function resetTurns(supabase: any, playerId: string): Promise<TurnResponse> {
  try {
    const startingTurns = 150

    // Update player turns directly
    const { error: updateError } = await supabase
      .from('players')
      .update({
        turns: startingTurns,
        last_turn_update: new Date().toISOString()
      })
      .eq('id', playerId)

    if (updateError) throw updateError

    // Log the reset
    await supabase
      .from('turn_audit_log')
      .insert({
        player_id: playerId,
        action: 'reset',
        amount: 0,
        turns_before: 0,
        turns_after: startingTurns,
        metadata: { reason: 'Admin reset' }
      })

    console.log(`✅ Reset turns for ${playerId} to ${startingTurns}`)

    return {
      success: true,
      turns: startingTurns,
      message: 'Turns reset to starting amount'
    }
  } catch (error) {
    console.error('Error resetting turns:', error)
    return { success: false, error: error.message }
  }
}

// Get audit logs for a player
async function getAuditLogs(supabase: any, playerId?: string): Promise<TurnResponse> {
  try {
    let query = supabase
      .from('turn_audit_log')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100)

    if (playerId) {
      query = query.eq('player_id', playerId)
    }

    const { data, error } = await query

    if (error) throw error

    return {
      success: true,
      auditLogs: data,
      message: `Retrieved ${data.length} audit logs`
    }
  } catch (error) {
    console.error('Error getting audit logs:', error)
    return { success: false, error: error.message }
  }
}
