import { createClient } from '@supabase/supabase-js';

// Load these from environment variables or .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Example: real-time subscription for news table
export const subscribeToNews = (callback: (payload: any) => void) => {
  return supabase
    .channel('public:news')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'news' }, payload => {
      callback(payload);
    })
    .subscribe();
};
