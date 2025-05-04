import { config } from 'dotenv-encrypted';

// Initialize encrypted environment variables
config();

export const getConfig = () => ({
  supabaseUrl: process.env.VITE_SUPABASE_URL,
  supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY,
});

export default getConfig;