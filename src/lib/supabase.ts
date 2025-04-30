import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate URL format
if (!supabaseUrl || !supabaseUrl.startsWith('https://')) {
  throw new Error(
    'Invalid or missing VITE_SUPABASE_URL. Please ensure it starts with https:// and points to your Supabase project URL.'
  );
}

if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);