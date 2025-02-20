import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL; // Thay bằng URL của bạn
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY; // Thay bằng API Key của bạn

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
