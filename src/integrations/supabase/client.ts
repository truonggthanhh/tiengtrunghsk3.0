import { createClient } from '@supabase/supabase-js';

// Normally, these values should come from environment variables.
// We are hardcoding them here as a temporary fix for the setup issue.
const supabaseUrl = "https://piwdypvvskuwbyvgyktn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpd2R5cHZ2c2t1d2J5dmd5a3RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NjczMjIsImV4cCI6MjA2NzA0MzMyMn0.uspMCRgaRq1HVtUXMQuW6RuLuXDqaMq-76gTpYJ5iRQ";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key are required but were not found.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);