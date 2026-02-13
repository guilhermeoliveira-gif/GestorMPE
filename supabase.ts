import { createClient } from '@supabase/supabase-js';

// In a real app, these would be in import.meta.env
const supabaseUrl = process.env.SUPABASE_URL || 'https://xyzcompany.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'public-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);