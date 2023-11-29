import { createClient } from "@supabase/supabase-js";
import { Database } from "./types";

const supabaseUrl = "https://ufykdascyufhwemtsaoq.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmeWtkYXNjeXVmaHdlbXRzYW9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE3OTcxMTAsImV4cCI6MjAwNzM3MzExMH0.Nbd7wvlzcfcG91qj4Pv9EAPCCMQgZ17QqD9kLjQHHrs";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmeWtkYXNjeXVmaHdlbXRzYW9xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MTc5NzExMCwiZXhwIjoyMDA3MzczMTEwfQ.LLq9Je691rgwPkyUl-A4GlkhVrN0JxSuiZvHyqaTYq8";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey);
