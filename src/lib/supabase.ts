import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isUrlValid = (url: string | undefined): url is string => {
    if (!url) return false;
    return url.startsWith('http://') || url.startsWith('https://');
};

if (typeof window !== 'undefined') {
    if (!supabaseUrl) console.warn('Supabase: NEXT_PUBLIC_SUPABASE_URL is missing');
    if (!supabaseAnonKey) console.warn('Supabase: NEXT_PUBLIC_SUPABASE_ANON_KEY is missing');
}

export const supabase = (isUrlValid(supabaseUrl) && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
