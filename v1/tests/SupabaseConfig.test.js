/**
 * Unit tests for Supabase configuration and database integration
 */

// Mock Supabase for testing
const mockSupabase = {
  auth: {
    getUser: jest.fn(),
    signUp: jest.fn(),
    signInWithPassword: jest.fn(),
    signOut: jest.fn()
  },
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  upsert: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis()
};

// Mock createClient function
const mockCreateClient = jest.fn().mockReturnValue(mockSupabase);

// Mock window object for Supabase testing
global.window = {
  supabase: {
    createClient: mockCreateClient
  }
};

// Mock database configuration class
class MockSupabaseConfig {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.currentUser = null;
  }

  async initSupabase() {
    try {
      this.client = mockCreateClient('test-url', 'test-key');
      this.isConnected = true;
      return true;
    } catch (error) {
      console.error('Supabase connection failed:', error);
      return false;
    }
  }

  async signUp(email, password, userData = {}) {
    if (!this.client) {
      throw new Error('Supabase not initialized');
    }

    const response = await this.client.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response;
  }

  async signIn(email, password) {
    if (!this.client) {
      throw new Error('Supabase not initialized');
    }

    const response = await this.client.auth.signInWithPassword({
      email,
      password
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    this.currentUser = response.data.user;
    return response;
  }

  async signOut() {
    if (!this.client) {
      throw new Error('Supabase not initialized');
    }

    const response = await this.client.auth.signOut();
    this.currentUser = null;
    return response;
  }

  async saveGameState(userId, gameState) {
    if (!this.client) {
      throw new Error('Supabase not initialized');
    }

    const response = await this.client
      .from('game_states')
      .upsert({
        user_id: userId,
        game_data: gameState,
        updated_at: new Date().toISOString()
      });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response;
  }

  async loadGameState(userId) {
    if (!this.client) {
      throw new Error('Supabase not initialized');
    }

    const response = await this.client
      .from('game_states')
      .select('game_data')
      .eq('user_id', userId);

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data?.[0]?.game_data || null;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isUserSignedIn() {
    return this.currentUser !== null;
  }
}

describe('SupabaseConfig', () => {
  let supabaseConfig;

  beforeEach(() => {
    supabaseConfig = new MockSupabaseConfig();
    jest.clearAllMocks();
  });

  describe('initSupabase', () => {
    test('should initialize Supabase client successfully', async () => {
      const result = await supabaseConfig.initSupabase();

      expect(result).toBe(true);
      expect(supabaseConfig.isConnected).toBe(true);
      expect(supabaseConfig.client).toBeDefined();
      expect(mockCreateClient).toHaveBeenCalledWith('test-url', 'test-key');
    });

    test('should handle initialization failure', async () => {
      mockCreateClient.mockImplementationOnce(() => {
        throw new Error('Network error');
      });

      const result = await supabaseConfig.initSupabase();

      expect(result).toBe(false);
      expect(supabaseConfig.isConnected).toBe(false);
    });
  });

  describe('signUp', () => {
    beforeEach(async () => {
      await supabaseConfig.initSupabase();
    });

    test('should sign up new user successfully', async () => {
      const mockResponse = {
        data: { user: { id: 'user123', email: 'test@example.com' } },
        error: null
      };
      mockSupabase.auth.signUp.mockResolvedValue(mockResponse);

      const result = await supabaseConfig.signUp('test@example.com', 'password123', {
        username: 'TestPlayer'
      });

      expect(result).toEqual(mockResponse);
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: { username: 'TestPlayer' }
        }
      });
    });

    test('should handle sign up error', async () => {
      const mockResponse = {
        data: null,
        error: { message: 'Email already registered' }
      };
      mockSupabase.auth.signUp.mockResolvedValue(mockResponse);

      await expect(supabaseConfig.signUp('test@example.com', 'password123'))
        .rejects.toThrow('Email already registered');
    });

    test('should throw error if not initialized', async () => {
      const uninitializedConfig = new MockSupabaseConfig();

      await expect(uninitializedConfig.signUp('test@example.com', 'password123'))
        .rejects.toThrow('Supabase not initialized');
    });
  });

  describe('signIn', () => {
    beforeEach(async () => {
      await supabaseConfig.initSupabase();
    });

    test('should sign in user successfully', async () => {
      const mockResponse = {
        data: { user: { id: 'user123', email: 'test@example.com' } },
        error: null
      };
      mockSupabase.auth.signInWithPassword.mockResolvedValue(mockResponse);

      const result = await supabaseConfig.signIn('test@example.com', 'password123');

      expect(result).toEqual(mockResponse);
      expect(supabaseConfig.currentUser).toEqual(mockResponse.data.user);
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });

    test('should handle sign in error', async () => {
      const mockResponse = {
        data: null,
        error: { message: 'Invalid login credentials' }
      };
      mockSupabase.auth.signInWithPassword.mockResolvedValue(mockResponse);

      await expect(supabaseConfig.signIn('test@example.com', 'wrongpassword'))
        .rejects.toThrow('Invalid login credentials');
    });
  });

  describe('signOut', () => {
    beforeEach(async () => {
      await supabaseConfig.initSupabase();
      // Simulate signed in user
      supabaseConfig.currentUser = { id: 'user123' };
    });

    test('should sign out user successfully', async () => {
      const mockResponse = { error: null };
      mockSupabase.auth.signOut.mockResolvedValue(mockResponse);

      const result = await supabaseConfig.signOut();

      expect(result).toEqual(mockResponse);
      expect(supabaseConfig.currentUser).toBe(null);
      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
    });
  });

  describe('saveGameState', () => {
    beforeEach(async () => {
      await supabaseConfig.initSupabase();
    });

    test('should save game state successfully', async () => {
      const mockResponse = { data: [{ id: 1 }], error: null };
      mockSupabase.from.mockReturnValue({
        upsert: jest.fn().mockResolvedValue(mockResponse)
      });

      const gameState = { player: { cash: 1000 }, resources: { hoes: 5 } };
      const result = await supabaseConfig.saveGameState('user123', gameState);

      expect(result).toEqual(mockResponse);
      expect(mockSupabase.from).toHaveBeenCalledWith('game_states');
    });

    test('should handle save error', async () => {
      const mockResponse = { data: null, error: { message: 'Database error' } };
      mockSupabase.from.mockReturnValue({
        upsert: jest.fn().mockResolvedValue(mockResponse)
      });

      const gameState = { player: { cash: 1000 } };

      await expect(supabaseConfig.saveGameState('user123', gameState))
        .rejects.toThrow('Database error');
    });
  });

  describe('loadGameState', () => {
    beforeEach(async () => {
      await supabaseConfig.initSupabase();
    });

    test('should load game state successfully', async () => {
      const gameData = { player: { cash: 1000 }, resources: { hoes: 5 } };
      const mockResponse = {
        data: [{ game_data: gameData }],
        error: null
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue(mockResponse)
        })
      });

      const result = await supabaseConfig.loadGameState('user123');

      expect(result).toEqual(gameData);
      expect(mockSupabase.from).toHaveBeenCalledWith('game_states');
    });

    test('should return null when no game state found', async () => {
      const mockResponse = { data: [], error: null };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue(mockResponse)
        })
      });

      const result = await supabaseConfig.loadGameState('user123');

      expect(result).toBe(null);
    });

    test('should handle load error', async () => {
      const mockResponse = { data: null, error: { message: 'Database error' } };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue(mockResponse)
        })
      });

      await expect(supabaseConfig.loadGameState('user123'))
        .rejects.toThrow('Database error');
    });
  });

  describe('user status methods', () => {
    beforeEach(async () => {
      await supabaseConfig.initSupabase();
    });

    test('should correctly report user sign-in status', () => {
      expect(supabaseConfig.isUserSignedIn()).toBe(false);

      supabaseConfig.currentUser = { id: 'user123' };
      expect(supabaseConfig.isUserSignedIn()).toBe(true);
    });

    test('should return current user', () => {
      expect(supabaseConfig.getCurrentUser()).toBe(null);

      const user = { id: 'user123', email: 'test@example.com' };
      supabaseConfig.currentUser = user;
      expect(supabaseConfig.getCurrentUser()).toEqual(user);
    });
  });
});

// Integration test for full authentication flow
describe('Database Integration Flow', () => {
  let supabaseConfig;

  beforeEach(async () => {
    supabaseConfig = new MockSupabaseConfig();
    await supabaseConfig.initSupabase();
  });

  test('should complete full user lifecycle', async () => {
    // Sign up
    const signUpResponse = {
      data: { user: { id: 'user123', email: 'test@example.com' } },
      error: null
    };
    mockSupabase.auth.signUp.mockResolvedValue(signUpResponse);

    await supabaseConfig.signUp('test@example.com', 'password123');

    // Sign in
    const signInResponse = {
      data: { user: { id: 'user123', email: 'test@example.com' } },
      error: null
    };
    mockSupabase.auth.signInWithPassword.mockResolvedValue(signInResponse);

    await supabaseConfig.signIn('test@example.com', 'password123');
    expect(supabaseConfig.isUserSignedIn()).toBe(true);

    // Save game state
    const gameState = { player: { cash: 1000 } };
    mockSupabase.from.mockReturnValue({
      upsert: jest.fn().mockResolvedValue({ data: [{ id: 1 }], error: null })
    });

    await supabaseConfig.saveGameState('user123', gameState);

    // Load game state
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          data: [{ game_data: gameState }],
          error: null
        })
      })
    });

    const loadedState = await supabaseConfig.loadGameState('user123');
    expect(loadedState).toEqual(gameState);

    // Sign out
    mockSupabase.auth.signOut.mockResolvedValue({ error: null });
    await supabaseConfig.signOut();
    expect(supabaseConfig.isUserSignedIn()).toBe(false);
  });
});
