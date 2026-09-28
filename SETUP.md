# Supabase & Google OAuth Setup Guide

Complete step-by-step instructions to set up the backend database, Google authentication, Row Level Security (RLS), and admin accounts for **CSE Project Expo 2026**.

---

## 1. Create a Supabase Project

1. Navigate to [https://supabase.com](https://supabase.com) and sign in.
2. Click **New Project**.
3. Fill in:
   - **Name**: `CSE Project Expo 2026`
   - **Database Password**: Set a strong password (save it safely).
   - **Region**: Select a region close to your users (e.g. `ap-south-1` Mumbai).
4. Click **Create new project** and wait ~2 minutes for provisioning.

---

## 2. Execute Database Schema & Seed Data

1. In your Supabase Dashboard, open the **SQL Editor** from the left navigation bar.
2. Click **New Query**.
3. Copy the entire contents of [`supabase/schema.sql`](file:///Users/apple/Downloads/project%20expo/supabase/schema.sql) and paste it into the editor.
4. Click **Run** (or `Ctrl+Enter`).
   - This creates:
     - `profiles`, `teams`, `team_members`, `whatsapp_logs`, `expo_settings`
     - Automatic submission ID generator trigger (`CSEEXPO-2026-XXXX`)
     - Automatic updated_at trigger
     - Automatic profile creation trigger on signup
     - Full Row Level Security (RLS) policies.
5. *(Optional for Testing)*: Open another query, copy [`supabase/seed.sql`](file:///Users/apple/Downloads/project%20expo/supabase/seed.sql), and click **Run** to load 10 sample student teams.

---

## 3. Configure Google OAuth in Google Cloud Console

1. Visit [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project: `CSE Project Expo 2026`.
3. Go to **APIs & Services** → **OAuth consent screen**:
   - Choose **External**.
   - App Name: `CSE Project Expo 2026`
   - User Support Email: your email.
   - Developer Contact Email: your email.
   - Save and continue through Scopes (default `email`, `profile`, `openid`).
4. Go to **Credentials** → **Create Credentials** → **OAuth client ID**:
   - Application type: **Web application**.
   - Name: `Supabase Google Auth`.
   - **Authorized redirect URIs**:
     ```
     https://<your-supabase-project-ref>.supabase.co/auth/v1/callback
     ```
     *(Obtain your Project Ref from your Supabase Project Settings → General)*.
5. Click **Create** and copy the **Client ID** and **Client Secret**.

---

## 4. Enable Google Provider in Supabase

1. In the Supabase Dashboard, navigate to **Authentication** → **Providers**.
2. Click on **Google** to expand it.
3. Toggle **Enable Sign in with Google** to **ON**.
4. Paste the **Client ID** and **Client Secret** obtained from Google Cloud.
5. Click **Save**.

---

## 5. Configure Redirect URLs in Supabase

1. In Supabase Dashboard, go to **Authentication** → **URL Configuration**.
2. Under **Site URL**, set:
   - Development: `http://localhost:3000`
   - Production: `https://your-app-domain.vercel.app`
3. Under **Redirect URLs**, add:
   ```
   http://localhost:3000/api/auth/callback
   http://localhost:3000/**
   https://your-app-domain.vercel.app/api/auth/callback
   https://your-app-domain.vercel.app/**
   ```
4. Click **Save**.

---

## 6. Create Department Admin Account

There are two methods to grant Admin access:

### Method A: Environment Credentials (Quickest & Pre-configured)
In your `.env.local` or Vercel Environment Variables:
```env
ADMIN_EMAIL=admin@college.edu
ADMIN_PASSWORD=expo2026admin
```
Admins can sign in immediately at `/admin/login`.

### Method B: Promote a Google/Supabase User to Admin
1. Have the faculty member sign in once at `/login` with their Gmail account.
2. In Supabase Dashboard, go to **SQL Editor** and run:
   ```sql
   UPDATE public.profiles
   SET role = 'admin'
   WHERE email = 'faculty.name@gmail.com';
   ```
3. The user can now access `/admin` and all admin API endpoints.

---

## 7. Configure Environment Variables

In your project root, create `.env.local` (or copy `.env.example`):

```bash
cp .env.example .env.local
```

Fill in values from Supabase **Project Settings** → **API**:
- `NEXT_PUBLIC_SUPABASE_URL`: Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `anon` `public` key
- `SUPABASE_SERVICE_ROLE_KEY`: `service_role` `secret` key

---

## 8. Run Locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 9. Deploy to Vercel

1. Push your repository to GitHub.
2. In [Vercel](https://vercel.com), click **Add New** → **Project** and import the repository.
3. Add the environment variables from `.env.example` in Vercel settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` (e.g. `https://cse-expo-2026.vercel.app`)
   - `META_WHATSAPP_ACCESS_TOKEN`
   - `META_WHATSAPP_PHONE_NUMBER_ID`
   - `META_WHATSAPP_BUSINESS_ACCOUNT_ID`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
4. Click **Deploy**.
5. Copy your live Vercel URL and add it to **Supabase Redirect URLs** and **Google OAuth Authorized Redirect URIs**.
