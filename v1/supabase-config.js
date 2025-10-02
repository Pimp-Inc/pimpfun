// Supabase Configuration for Pimp.Fun
// This handles all database connections and real-time features

// Supabase connection
const SUPABASE_URL = 'https://wfkivkplsjyobzaqiias.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indma2l2a3Bsc2p5b2J6YXFpaWFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNDY0NDAsImV4cCI6MjA3MzgyMjQ0MH0.5dc0wf9P-sYz8yV887NqeSRlGEcovnxfAPf0dnJOqwo';

// Initialize Supabase client
let supabase = null;

// Initialize connection
async function initSupabase() {
    try {
        // Load Supabase from CDN if not already loaded
        if (typeof window.supabase === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
            document.head.appendChild(script);
            
            await new Promise((resolve, reject) => {
                script.onload = () => {
                    // Wait a bit more for the library to be fully available
                    setTimeout(() => {
                        if (window.supabase) {
                            resolve();
                        } else {
                            reject(new Error('Supabase library failed to load'));
                        }
                    }, 100);
                };
                script.onerror = reject;
            });
        }
        
        // Create the Supabase client
        const { createClient } = window.supabase;
        supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        window.supabaseClient = supabase; // Make the client globally available
        console.log('✅ Supabase connected');
        
        // Test auth
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            console.log('✅ User already signed in:', user.email);
        }
        
        return true;
    } catch (error) {
        console.error('❌ Supabase connection failed:', error);
        return false;
    }
}

// Database Schema Functions
const SupabaseAPI = {
    // Player Management
    async createPlayer(playerData) {
        try {
            console.log('🔄 Creating player with data:', playerData);
            
            const { data, error } = await supabase
                .from('players')
                .insert([{
                    wallet_address: playerData.walletAddress || 'demo_' + Date.now(),
                    username: playerData.username,
                    bio: playerData.bio || '',
                    level: playerData.level || 1,
                    exp: playerData.exp || 0,
                    cash: playerData.cash || 10000,
                    respect: playerData.respect || 0,
                    heat: playerData.heat || 0,
                    territory: playerData.territory || 'Times Square Center'
                    // Removed created_at and last_active - they have DEFAULT values
                }])
                .select();
            
            if (error) {
                console.error('❌ Database error:', error);
                throw error;
            }
            
            console.log('✅ Player created:', data[0]);
            return data[0];
        } catch (error) {
            console.error('❌ Error creating player:', error);
            console.error('❌ Error details:', error.message);
            return null;
        }
    },

    async updatePlayer(playerId, updates) {
        try {
            console.log('🌐 SupabaseAPI.updatePlayer called:', playerId, updates);
            
            const { data, error } = await supabase
                .from('players')
                .update({
                    ...updates,
                    last_active: new Date().toISOString()
                })
                .eq('wallet_address', playerId) // Use wallet_address to match current user ID
                .select();
            
            if (error) {
                console.error('❌ Supabase update error:', error);
                return { success: false, error: error.message };
            }
            
            console.log('✅ Supabase update successful:', data);
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('❌ SupabaseAPI.updatePlayer error:', error);
            return { success: false, error: error.message };
        }
    },

    async getPlayer(playerId) {
        try {
            const { data, error } = await supabase
                .from('players')
                .select(`
                    *,
                    crew:crews(name, tag, description, level, territory)
                `)
                .eq('id', playerId)
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error getting player:', error);
            return null;
        }
    },

    async searchPlayers(searchTerm = '', limit = 20) {
        try {
            const { data, error } = await supabase
                .from('players')
                .select(`
                    id, username, level, respect, territory, last_active,
                    crew:crews(name, tag)
                `)
                .ilike('username', `%${searchTerm}%`)
                .order('respect', { ascending: false })
                .limit(limit);
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error searching players:', error);
            return [];
        }
    },

    // Crew Management
    async createCrew(crewData) {
        try {
            const { data, error } = await supabase
                .from('crews')
                .insert([{
                    name: crewData.name,
                    tag: crewData.tag,
                    description: crewData.description,
                    founder_id: crewData.founderId,
                    territory: crewData.territory,
                    created_at: new Date().toISOString()
                }])
                .select();
            
            if (error) throw error;
            
            // Add founder as crew leader
            await this.addCrewMember(data[0].id, crewData.founderId, 'leader');
            
            return data[0];
        } catch (error) {
            console.error('Error creating crew:', error);
            return null;
        }
    },

    async getCrews(limit = 20) {
        try {
            const { data, error } = await supabase
                .from('crews')
                .select(`
                    *,
                    member_count:crew_members(count),
                    leader:crew_members!inner(
                        player:players(username)
                    )
                `)
                .eq('crew_members.role', 'leader')
                .order('level', { ascending: false })
                .limit(limit);
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error getting crews:', error);
            return [];
        }
    },

    async addCrewMember(crewId, playerId, role = 'member') {
        try {
            const { data, error } = await supabase
                .from('crew_members')
                .insert([{
                    crew_id: crewId,
                    player_id: playerId,
                    role: role,
                    joined_at: new Date().toISOString()
                }]);
            
            if (error) throw error;
            
            // Update player's crew_id
            await this.updatePlayer(playerId, { crew_id: crewId });
            
            return true;
        } catch (error) {
            console.error('Error adding crew member:', error);
            return false;
        }
    },

    // Messaging System
    async sendMessage(fromPlayerId, toPlayerId, message) {
        try {
            const { data, error } = await supabase
                .from('messages')
                .insert([{
                    from_player_id: fromPlayerId,
                    to_player_id: toPlayerId,
                    message: message,
                    sent_at: new Date().toISOString()
                }]);
            
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error sending message:', error);
            return false;
        }
    },

    async getMessages(playerId, limit = 50) {
        try {
            const { data, error } = await supabase
                .from('messages')
                .select(`
                    *,
                    from_player:players!from_player_id(username),
                    to_player:players!to_player_id(username)
                `)
                .or(`from_player_id.eq.${playerId},to_player_id.eq.${playerId}`)
                .order('sent_at', { ascending: false })
                .limit(limit);
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error getting messages:', error);
            return [];
        }
    },

    // Real-time subscriptions
    subscribeToPlayerUpdates(playerId, callback) {
        return supabase
            .channel('player-updates')
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'players',
                filter: `id=eq.${playerId}`
            }, callback)
            .subscribe();
    },

    subscribeToCrewUpdates(crewId, callback) {
        return supabase
            .channel('crew-updates')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'crew_members',
                filter: `crew_id=eq.${crewId}`
            }, callback)
            .subscribe();
    },

    subscribeToMessages(playerId, callback) {
        return supabase
            .channel('messages')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `to_player_id=eq.${playerId}`
            }, callback)
            .subscribe();
    }
};

// Export for use in main game
window.SupabaseAPI = SupabaseAPI;
window.initSupabase = initSupabase; 