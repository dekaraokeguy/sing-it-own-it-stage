
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://eyuolxpeigtqoqlponqm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5dW9seHBlaWd0cW9xbHBvbnFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0Nzg4MjEsImV4cCI6MjA2MDA1NDgyMX0.3yXYx2_ShqsdlnYJIpqLzmEzZNHjh68TijiEMYNdOKI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
