import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = process.env.PUBLIC_SUPABASE_URL || 'https://bxepwdbfhjdyoifnjyke.supabase.co'
const supabaseAnonKey  = process.env.PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4ZXB3ZGJmaGpkeW9pZm5qeWtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkwNjE1NDAsImV4cCI6MjA0NDYzNzU0MH0.4cG8Ohq_FeJ_M7fT8ZxCbMzXZq9v0vBmIjcVZ81dbB4'


console.log(supabaseUrl);

export const supabase =  createClient( supabaseUrl, supabaseAnonKey );