import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('⚠️ Warning: SUPABASE_URL and SUPABASE_ANON_KEY must be set in environment variables');
}

let supabaseClient: SupabaseClient | null = null;

/**
 * Get Supabase client instance (singleton)
 */
export function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Supabase is not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.');
    }

    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: false,
      },
    });
  }

  return supabaseClient;
}

/**
 * Create a new Supabase client with custom options
 */
export function createSupabaseClient(options?: any): SupabaseClient {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase is not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.');
  }

  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, options);
}

/**
 * Database types - customize based on your schema
 */
export interface Database {
  public: {
    Tables: {
      user_data: {
        Row: {
          id: string;
          user_id: string;
          data: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          data: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          data?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type { SupabaseClient };
