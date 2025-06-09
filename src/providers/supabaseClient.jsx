import { createClient } from '@supabase/supabase-js';

// get supabase auth details/keys from your .env file
var projectSupabaseURL = import.meta.env.VITE_SUPABASE_URL;
var projectSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// initiliaze supabase client for use in the app
export const supabaseClient = createClient( projectSupabaseURL, projectSupabaseAnonKey );