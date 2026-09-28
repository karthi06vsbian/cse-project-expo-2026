export type UserRole = 'student' | 'admin';

export type TeamStatus = 'submitted' | 'under_review' | 'shortlisted' | 'rejected';

export type CollegeYear = '1st Year' | '2nd Year' | '3rd Year' | '4th Year';

export type CollegeSection = 'A' | 'B' | 'C' | 'D';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}

export interface TeamMember {
  id?: string;
  team_id?: string;
  name: string;
  year: CollegeYear;
  section: CollegeSection;
  created_at?: string;
}

export interface Team {
  id: string;
  submission_id: string;
  team_name: string;
  team_leader_name: string;
  whatsapp_number: string;
  email: string;
  project_title: string;
  theme: string;
  problem_description: string;
  solution_description: string;
  technologies_used: string;
  hardware_components: string;
  expected_outcome?: string | null;
  status: TeamStatus;
  submitted_by: string;
  submitted_at: string;
  updated_at: string;
  team_members?: TeamMember[];
}

export interface WhatsAppLog {
  id: string;
  team_id: string | null;
  phone_number: string;
  message_type: 'submission_confirmation' | 'shortlisted' | 'rejected' | 'custom_admin_broadcast';
  message_status: 'sent' | 'failed';
  provider_message_id?: string | null;
  error_message?: string | null;
  sent_at: string;
  teams?: {
    team_name: string;
    submission_id: string;
  };
}

export interface ExpoSettings {
  id: number;
  expo_name: string;
  college_name: string;
  department_name: string;
  registration_deadline: string;
  expo_date: string;
  registration_open: boolean;
  allowed_themes: string[];
  updated_at: string;
}

export interface RegistrationFormData {
  // Step 1: Team & Project
  teamName: string;
  teamLeaderName: string;
  whatsappNumber: string;
  email: string;
  theme: string;
  projectTitle: string;
  problemDescription: string;
  solutionDescription: string;
  technologiesUsed: string;
  hardwareComponents: string;
  expectedOutcome?: string;
  // Step 2: Team Members (2 to 6)
  members: {
    name: string;
    year: CollegeYear;
    section: CollegeSection;
  }[];
}

export const EXPO_THEMES = [
  'Agriculture',
  'Healthcare',
  'Education',
  'Environment',
  'Smart Campus',
  'FinTech',
  'Artificial Intelligence',
  'Machine Learning',
  'IoT',
  'Cyber Security',
  'Smart City',
  'Social Impact',
  'Other',
] as const;

export const COLLEGE_YEARS: CollegeYear[] = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
];

export const COLLEGE_SECTIONS: CollegeSection[] = ['A', 'B', 'C', 'D'];
