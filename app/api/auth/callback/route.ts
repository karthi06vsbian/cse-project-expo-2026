import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/register';

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      const adminSupabase = createAdminClient();

      // Check if user is an admin
      const { data: profile } = await adminSupabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profile?.role === 'admin') {
        return NextResponse.redirect(`${origin}/admin`);
      }

      // Check if student already submitted a project
      const { data: existingTeam } = await adminSupabase
        .from('teams')
        .select('id, submission_id')
        .eq('submitted_by', data.user.id)
        .maybeSingle();

      if (existingTeam) {
        return NextResponse.redirect(`${origin}/success?existing=true`);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return user to login with error if OAuth failed
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
