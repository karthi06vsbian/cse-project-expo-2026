import { createClient } from '@supabase/supabase-js';

// Server-side only admin client with service role key
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseServiceRoleKey) {
    console.warn(
      '[Supabase Admin] SUPABASE_SERVICE_ROLE_KEY is not defined. Admin operations may be restricted.'
    );
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey || 'placeholder-service-key', {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
