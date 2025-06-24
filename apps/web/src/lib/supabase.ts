import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions for better TypeScript support
export type Database = {
  // Add your database types here once schema is established
  public: {
    Tables: {
      // Tables will be defined after Medusa migrations
    }
    Views: {
      // Views will be defined if needed
    }
    Functions: {
      // Functions will be defined if needed
    }
    Enums: {
      // Enums will be defined if needed
    }
  }
} 