-- ==============================================================================
-- CSE PROJECT EXPO 2026 — SUPABASE POSTGRESQL SCHEMA
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for role lookup & email queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 3. Teams Table
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id TEXT UNIQUE NOT NULL,
    team_name TEXT NOT NULL,
    team_leader_name TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    email TEXT NOT NULL,
    project_title TEXT NOT NULL,
    theme TEXT NOT NULL,
    problem_description TEXT NOT NULL,
    solution_description TEXT NOT NULL,
    technologies_used TEXT NOT NULL,
    hardware_components TEXT NOT NULL,
    expected_outcome TEXT,
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'shortlisted', 'rejected')),
    submitted_by UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for lightning fast searching and filtering
CREATE INDEX IF NOT EXISTS idx_teams_status ON public.teams(status);
CREATE INDEX IF NOT EXISTS idx_teams_theme ON public.teams(theme);
CREATE INDEX IF NOT EXISTS idx_teams_submission_id ON public.teams(submission_id);
CREATE INDEX IF NOT EXISTS idx_teams_submitted_by ON public.teams(submitted_by);
CREATE INDEX IF NOT EXISTS idx_teams_submitted_at ON public.teams(submitted_at DESC);

-- 4. Team Members Table (2 to 6 members per team)
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    year TEXT NOT NULL CHECK (year IN ('1st Year', '2nd Year', '3rd Year', '4th Year')),
    section TEXT NOT NULL CHECK (section IN ('A', 'B', 'C', 'D')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_year ON public.team_members(year);
CREATE INDEX IF NOT EXISTS idx_team_members_section ON public.team_members(section);

-- 5. WhatsApp Delivery Audit Logs Table
CREATE TABLE IF NOT EXISTS public.whatsapp_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    phone_number TEXT NOT NULL,
    message_type TEXT NOT NULL CHECK (message_type IN ('submission_confirmation', 'shortlisted', 'rejected')),
    message_status TEXT NOT NULL CHECK (message_status IN ('sent', 'failed')),
    provider_message_id TEXT,
    error_message TEXT,
    sent_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_logs_team_id ON public.whatsapp_logs(team_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_logs_sent_at ON public.whatsapp_logs(sent_at DESC);

-- 6. Expo Configuration Settings Table
CREATE TABLE IF NOT EXISTS public.expo_settings (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    expo_name TEXT NOT NULL DEFAULT 'CSE Project Expo 2026',
    college_name TEXT NOT NULL DEFAULT 'College of Engineering & Technology',
    department_name TEXT NOT NULL DEFAULT 'Department of Computer Science & Engineering',
    registration_deadline TIMESTAMPTZ NOT NULL DEFAULT '2026-03-31 23:59:59+05:30',
    expo_date DATE NOT NULL DEFAULT '2026-04-15',
    registration_open BOOLEAN NOT NULL DEFAULT true,
    allowed_themes TEXT[] NOT NULL DEFAULT ARRAY[
        'Agriculture', 'Healthcare', 'Education', 'Environment', 
        'Smart Campus', 'FinTech', 'Artificial Intelligence', 
        'Machine Learning', 'IoT', 'Cyber Security', 'Smart City', 
        'Social Impact', 'Other'
    ],
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Insert Default Settings row if not exists
INSERT INTO public.expo_settings (id, expo_name, college_name, department_name)
VALUES (1, 'CSE Project Expo 2026', 'College of Engineering & Technology', 'Department of Computer Science & Engineering')
ON CONFLICT (id) DO NOTHING;

-- 7. Submission ID Generator Sequence & Helper Function
CREATE SEQUENCE IF NOT EXISTS submission_seq START 1;

CREATE OR REPLACE FUNCTION generate_submission_id()
RETURNS TRIGGER AS $$
DECLARE
    seq_val INT;
BEGIN
    IF NEW.submission_id IS NULL OR NEW.submission_id = '' THEN
        seq_val := nextval('submission_seq');
        NEW.submission_id := 'CSEEXPO-2026-' || LPAD(seq_val::TEXT, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_generate_submission_id ON public.teams;
CREATE TRIGGER trigger_generate_submission_id
BEFORE INSERT ON public.teams
FOR EACH ROW
EXECUTE FUNCTION generate_submission_id();

-- 8. Updated At Timestamp Trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_teams_updated_at ON public.teams;
CREATE TRIGGER trigger_teams_updated_at
BEFORE UPDATE ON public.teams
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 9. Automatic Profile Creation on User Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
        'student'
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        full_name = EXCLUDED.full_name,
        avatar_url = EXCLUDED.avatar_url;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expo_settings ENABLE ROW LEVEL SECURITY;

-- Helper security definer function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles"
ON public.profiles FOR ALL
USING (public.is_admin());

-- Teams Policies
CREATE POLICY "Public read on teams disabled for privacy"
ON public.teams FOR SELECT
USING (auth.uid() = submitted_by OR public.is_admin());

CREATE POLICY "Authenticated students can insert their single team"
ON public.teams FOR INSERT
WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Admins can update any team"
ON public.teams FOR UPDATE
USING (public.is_admin());

CREATE POLICY "Admins can delete teams"
ON public.teams FOR DELETE
USING (public.is_admin());

-- Team Members Policies
CREATE POLICY "Students can view members of their own team"
ON public.team_members FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.teams
        WHERE teams.id = team_members.team_id
        AND (teams.submitted_by = auth.uid() OR public.is_admin())
    )
);

CREATE POLICY "Students can insert members for their own team"
ON public.team_members FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.teams
        WHERE teams.id = team_members.team_id
        AND teams.submitted_by = auth.uid()
    ) OR public.is_admin()
);

CREATE POLICY "Admins can manage all team members"
ON public.team_members FOR ALL
USING (public.is_admin());

-- WhatsApp Logs Policies (Admins only)
CREATE POLICY "Admins can view and insert WhatsApp logs"
ON public.whatsapp_logs FOR ALL
USING (public.is_admin());

-- Expo Settings Policies
CREATE POLICY "Anyone can view expo settings"
ON public.expo_settings FOR SELECT
USING (true);

CREATE POLICY "Admins can update expo settings"
ON public.expo_settings FOR UPDATE
USING (public.is_admin());
