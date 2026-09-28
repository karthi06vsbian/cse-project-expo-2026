import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { Profile, Team } from '@/types';

export interface AuthContext {
  user: {
    id: string;
    email: string;
    user_metadata?: Record<string, any>;
  } | null;
  profile: Profile | null;
  isAdmin: boolean;
}

export async function getAuthContext(): Promise<AuthContext> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user || !user.email) {
      return { user: null, profile: null, isAdmin: false };
    }

    // Query profile from database
    const adminSupabase = createAdminClient();
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    const isAdmin =
      profile?.role === 'admin' ||
      (process.env.ADMIN_EMAIL && user.email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase());

    return {
      user: {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata,
      },
      profile: profile as Profile | null,
      isAdmin: Boolean(isAdmin),
    };
  } catch (err) {
    console.error('[Auth Error]', err);
    return { user: null, profile: null, isAdmin: false };
  }
}

export async function getUserSubmission(userId: string): Promise<Team | null> {
  try {
    const adminSupabase = createAdminClient();
    const { data, error } = await adminSupabase
      .from('teams')
      .select('*, team_members(*)')
      .eq('submitted_by', userId)
      .maybeSingle();

    if (error) {
      console.error('[Fetch Submission Error]', error);
      return null;
    }
    return data as Team | null;
  } catch (err) {
    console.error('[Fetch Submission Exception]', err);
    return null;
  }
}
