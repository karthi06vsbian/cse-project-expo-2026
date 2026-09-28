import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function verifyAdminSession(): Promise<boolean> {
  // Check direct admin session cookie
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get('expo_admin_session');
  if (adminCookie?.value === 'authenticated_admin') {
    return true;
  }

  // Check Supabase session
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    const adminSupabase = createAdminClient();
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    return profile?.role === 'admin';
  } catch (err) {
    return false;
  }
}
