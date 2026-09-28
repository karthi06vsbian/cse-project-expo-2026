import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check against configured ADMIN credentials or Supabase Auth
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@college.edu';
    const adminPassword = process.env.ADMIN_PASSWORD || 'expo2026admin';

    // 1. Direct secure admin credential verification
    if (
      email.toLowerCase() === adminEmail.toLowerCase() &&
      password === adminPassword
    ) {
      const cookieStore = await cookies();
      cookieStore.set('expo_admin_session', 'authenticated_admin', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });

      return NextResponse.json({ success: true, email: adminEmail });
    }

    // 2. Supabase Auth fallback
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: 'Invalid admin credentials.' },
        { status: 401 }
      );
    }

    // Check if user has admin role in profiles
    const adminSupabase = createAdminClient();
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized: This account does not possess department admin privileges.' },
        { status: 403 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set('expo_admin_session', 'authenticated_admin', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return NextResponse.json({ success: true, email: authData.user.email });
  } catch (err: any) {
    console.error('[Admin Login Error]', err);
    return NextResponse.json(
      { error: err?.message || 'Authentication error' },
      { status: 500 }
    );
  }
}

// DELETE: Admin logout
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('expo_admin_session');
  return NextResponse.json({ success: true });
}
