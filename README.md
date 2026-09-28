# CSE Project Expo 2026 Management System

> **"Build. Innovate. Solve."**  
> A production-ready, full-stack web platform built for College Computer Science & Engineering departments to manage student Software + Hardware project registrations, reviews, automated WhatsApp notifications, and administrative workflows.

---

## 🌟 Key Features

### For Students
- **Google Authentication**: Frictionless login via official Gmail accounts.
- **Strict 1 Account = 1 Submission**: Guaranteed prevention of duplicate team entries both client-side and at the PostgreSQL database kernel level.
- **Mandatory Software + Hardware Validation**: Clear architectural rules enforcing embedded hardware sensors/boards with software dashboards or models.
- **Dynamic Team Composition**: Minimum 2 to maximum 6 students with real-time duplicate name detection and cohort categorization (1st to 4th year, Sections A to D).
- **Automated WhatsApp Confirmation**: Immediate dispatch of `project_submission_success` template to the team leader upon submission.
- **Human-Friendly Submission ID**: Auto-generated sequence ID (e.g. `CSEEXPO-2026-0042`) with 1-click clipboard copy.

### For Department Administrators & Reviewers
- **Role-Guarded Admin Portal**: Protected routes accessible only to verified faculty accounts (`/admin/*`).
- **Real-Time Telemetry Dashboard**: Live KPI metrics (Total Teams, Submitted, Under Review, Shortlisted, Rejected, Total Students) with theme, year, and section distributions.
- **Interactive Teams Directory**: High-performance table with global search, multi-faceted filtering, and sorting.
- **One-Click Batch Shortlisting**: Checkbox selection with modal preview to shortlist multiple teams and instantly broadcast the WhatsApp `project_shortlisted` template.
- **Complete Team Dossier**: Deep-dive inspection page (`/admin/teams/[id]`) with inline editing and audit logs.
- **Spreadsheet Generation**: Full `.xlsx` Excel exports for all teams, filtered subsets, or selected rows via `xlsx`.
- **WhatsApp Delivery Audit Trail**: Inspection of message provider IDs (`wamid`), failure diagnostics, and 1-click retry triggers.
- **Expo Settings**: Live control over exhibition dates, registration deadlines, and department metadata.

---

## 🏗️ Architecture & Tech Stack

```
                                  [ Browser (Next.js 14 App Router) ]
                                          │                 ▲
                                          ▼                 │
                              [ Next.js Route Handlers / API ]
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
     [ Supabase (PostgreSQL) ]                      [ Meta WhatsApp Cloud API ]
  - Profiles & Roles                              - Template Messages
  - Teams & Unique Constraints                    - Delivery Receipts
  - Team Members (CASCADE)                        - wamid Audit Logs
  - Row Level Security (RLS)
```

| Layer | Technologies |
| :--- | :--- |
| **Framework** | Next.js 14 (App Router, Server Actions, Route Handlers) |
| **Language** | TypeScript (Strict mode enabled) |
| **Styling** | Tailwind CSS, Lucide React, Glassmorphism accents, Custom Dark UI |
| **Database** | Supabase PostgreSQL, `@supabase/ssr`, Row Level Security (RLS) |
| **Authentication** | Supabase Auth with Google OAuth (Students) + Admin credentials guard |
| **Validation** | Zod schemas with Indian phone number normalization (`+91XXXXXXXXXX`) |
| **Messaging** | Meta WhatsApp Business Cloud API (Graph API v21.0) |
| **Excel Engine** | SheetJS (`xlsx`) for server-side `.xlsx` spreadsheet generation |
| **Security** | In-memory token bucket rate limiting, HTTP-only cookies, DB unique indexes |

---

## 📁 Project Structure

```
project-expo/
├── app/
│   ├── page.tsx                     # Landing page with Hero, Themes, How it Works
│   ├── login/page.tsx               # Student Google OAuth sign-in & status check
│   ├── register/page.tsx            # 3-step student project registration form
│   ├── success/page.tsx             # Submission confirmation & Confetti celebration
│   ├── admin/
│   │   ├── layout.tsx               # Admin sidebar, mobile drawer & navigation
│   │   ├── login/page.tsx           # Faculty admin authentication
│   │   ├── page.tsx                 # Dashboard metrics & distribution charts
│   │   ├── teams/
│   │   │   ├── page.tsx             # Interactive teams data table & batch shortlist
│   │   │   └── [id]/page.tsx        # Team dossier & inline editor
│   │   ├── whatsapp-logs/page.tsx   # WhatsApp audit trail & retry interface
│   │   └── settings/page.tsx        # Department & exhibition settings
│   ├── api/
│   │   ├── auth/callback/route.ts   # OAuth redirect handler
│   │   ├── registration/route.ts    # Student submission & WhatsApp trigger
│   │   └── admin/
│   │       ├── login/route.ts       # Admin session handler
│   │       ├── teams/route.ts       # Teams query, update, delete
│   │       ├── teams/[id]/route.ts  # Team dossier endpoint
│   │       ├── shortlist/route.ts   # Batch shortlist & WhatsApp broadcast
│   │       ├── export/route.ts      # Excel workbook generator (.xlsx)
│   │       ├── whatsapp/route.ts    # Delivery logs query
│   │       └── whatsapp/retry/route.ts # Transmission retry
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                          # Button, Input, Select, Textarea, Card, Dialog, Badge, StatusBadge
│   ├── landing/                     # Hero, ThemesGrid, HowItWorks, Guidelines
│   └── layout/                      # Navbar, Footer
├── lib/
│   ├── supabase/                    # Client, Server, and Admin Service-role clients
│   ├── whatsapp/                    # Cloud API client and template payload builders
│   ├── excel/                       # xlsx export workbook generator
│   ├── validation/                  # Zod validation and phone normalizers
│   ├── auth/                        # Server authentication & admin guards
│   ├── rate-limit.ts                # Sliding window rate limiter
│   └── utils.ts                     # Tailwind class merge & date formatters
├── supabase/
│   ├── schema.sql                   # Full PostgreSQL DDL, Triggers, Functions & RLS
│   └── seed.sql                     # 10 realistic sample teams for preview
├── types/index.ts                   # Complete TypeScript data model interfaces
├── .env.example                     # Environment variables template
├── README.md                        # Documentation overview
├── SETUP.md                         # Supabase & Google OAuth step-by-step setup
└── WHATSAPP_SETUP.md                # Meta Cloud API template configuration guide
```

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js `v18.17+` or `v20+` or `v22+`
- npm `v9+` or `v10+`

### 2. Installation
```bash
git clone <your-repo-url>
cd project-expo
npm install
```

### 3. Environment Setup
Copy the example environment configuration:
```bash
cp .env.example .env.local
```
Configure your keys in `.env.local`:
- Follow [SETUP.md](SETUP.md) for Supabase & Google OAuth setup.
- Follow [WHATSAPP_SETUP.md](WHATSAPP_SETUP.md) for Meta WhatsApp Cloud API credentials.

*(Note: The application includes local fallback mock modes so you can test all UI flows, data tables, and batch actions immediately without third-party credentials!)*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Default Admin Credentials (Development)

For quick demonstration and local evaluation:
- **Admin Portal**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Email**: `admin@college.edu`
- **Password**: `expo2026admin`

---

## 🔒 Security & Idempotency Measures

1. **One Gmail = One Submission**:
   - Guaranteed by PostgreSQL unique index `submitted_by UNIQUE` on the `teams` table. Double-clicking or concurrent requests return a clean `409 Conflict`.
2. **Server-Side Secret Isolation**:
   - `SUPABASE_SERVICE_ROLE_KEY` and `META_WHATSAPP_ACCESS_TOKEN` are strictly isolated to the server runtime.
3. **Row Level Security (RLS)**:
   - Students can only view their own registered team.
   - Admins can query and manage all registered teams.
4. **Rate Limiting**:
   - Registration, login, and shortlist endpoints are guarded against automated spam.
5. **Indian Phone Normalization**:
   - Converts standard numbers (e.g. `9876543210`) into international E.164 format (`+919876543210`).
6. **Graceful WhatsApp Decoupling**:
   - If Meta's API experiences downtime, student registration is **never lost**. It records the submission successfully and logs the failure in `whatsapp_logs` for subsequent 1-click retry.

---

## 📊 Excel Export Columns

Generated `.xlsx` files include:
- `Submission ID`, `Team Name`, `Team Leader`, `WhatsApp Number`, `Email`
- `Project Title`, `Theme`, `Problem Description`, `Proposed Solution`, `Technologies Used`, `Hardware Components`, `Expected Outcome`
- `Member 1 Name`, `Member 1 Year`, `Member 1 Section`
- `Member 2 Name`, `Member 2 Year`, `Member 2 Section`
- `Member 3 Name`, `Member 3 Year`, `Member 3 Section`
- `Member 4 Name`, `Member 4 Year`, `Member 4 Section`
- `Member 5 Name`, `Member 5 Year`, `Member 5 Section`
- `Member 6 Name`, `Member 6 Year`, `Member 6 Section`
- `Status`, `Submitted Date`

---

## 🌐 Production Deployment (Vercel)

1. Push code to your GitHub repository.
2. In Vercel, click **Add New Project** and import the repository.
3. Add all environment variables from `.env.example` in Vercel Project Settings.
4. Deploy the project.
5. Update `NEXT_PUBLIC_APP_URL` with your production domain (e.g. `https://cse-project-expo.vercel.app`).
6. Update Google Cloud Console and Supabase URL Configuration with your production redirect URLs:
   - `https://your-domain.vercel.app/api/auth/callback`

---

## 📄 License
Developed for the **Department of Computer Science & Engineering**, Academic Year 2025–2026.
