import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim().replace(/\/$/, "");
  const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();
  
  return createBrowserClient<any>(url, key);
}

// Keep a singleton export so existing `import { supabase } from "@/lib/supabase"` calls
// throughout the app keep working without touching every file.
export const supabase = createClient();
