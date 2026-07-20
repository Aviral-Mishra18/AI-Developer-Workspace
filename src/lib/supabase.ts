import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Keep a singleton export so existing `import { supabase } from "@/lib/supabase"` calls
// throughout the app keep working without touching every file.
export const supabase = createClient();
