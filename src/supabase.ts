import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const getSupabaseClientIfExists = (): SupabaseClient | undefined => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    return;
  }

  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
};

export const getSupabaseClient = (): SupabaseClient => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase credentials');
  }

  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
};
