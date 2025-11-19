import { createClient } from "@supabase/supabase-js";
const URL = "https://fldimeowlmxdhxhsbelc.supabase.co";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsZGltZW93bG14ZGh4aHNiZWxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MTI1NDcsImV4cCI6MjA3OTA4ODU0N30.RULMJsPFQBqM1l1mpf_a8u0J_Xt8VGkpw9EuGyvldxw";
const supabase = createClient(URL, API_KEY)
export default supabase;