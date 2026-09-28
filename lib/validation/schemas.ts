import { z } from 'zod';
import { EXPO_THEMES, COLLEGE_YEARS, COLLEGE_SECTIONS } from '@/types';

// Helper to normalize Indian phone number to E.164 (+91XXXXXXXXXX)
export function normalizeWhatsAppNumber(phone: string): string {
  // Strip all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  if (digits.length === 10) {
    return `+91${digits}`;
  } else if (digits.length === 12 && digits.startsWith('91')) {
    return `+${digits}`;
  } else if (phone.startsWith('+91') && digits.length === 12) {
    return phone;
  }
  return `+${digits}`;
}

// Regex for valid 10-digit Indian phone (with or without +91 / 91 prefix)
const indianPhoneRegex = /^(?:\+91|91)?[6-9]\d{9}$/;

export const memberSchema = z.object({
  name: z.string().trim().min(2, 'Member name must be at least 2 characters'),
  year: z.enum(COLLEGE_YEARS as unknown as [string, ...string[]], {
    errorMap: () => ({ message: 'Please select a valid year (1st, 2nd, 3rd, or 4th Year)' }),
  }),
  section: z.enum(COLLEGE_SECTIONS as unknown as [string, ...string[]], {
    errorMap: () => ({ message: 'Please select a valid section (A, B, C, or D)' }),
  }),
});

export const registrationSchema = z
  .object({
    teamName: z
      .string()
      .trim()
      .min(3, 'Team name must be at least 3 characters')
      .max(50, 'Team name cannot exceed 50 characters'),
    teamLeaderName: z
      .string()
      .trim()
      .min(2, 'Team leader name must be at least 2 characters')
      .max(60, 'Team leader name cannot exceed 60 characters'),
    whatsappNumber: z
      .string()
      .trim()
      .regex(indianPhoneRegex, 'Please enter a valid 10-digit Indian WhatsApp number (starts with 6-9)'),
    email: z
      .string()
      .trim()
      .email('Please enter a valid email address'),
    theme: z.enum(EXPO_THEMES as unknown as [string, ...string[]], {
      errorMap: () => ({ message: 'Please select an expo theme' }),
    }),
    projectTitle: z
      .string()
      .trim()
      .min(5, 'Project title must be at least 5 characters')
      .max(120, 'Project title cannot exceed 120 characters'),
    problemDescription: z
      .string()
      .trim()
      .min(30, 'Problem description must be at least 30 characters explaining the challenge'),
    solutionDescription: z
      .string()
      .trim()
      .min(30, 'Proposed solution must be at least 30 characters explaining your approach'),
    technologiesUsed: z
      .string()
      .trim()
      .min(3, 'Please list the software technologies used (e.g. Next.js, Python, TensorFlow)'),
    hardwareComponents: z
      .string()
      .trim()
      .min(3, 'Please specify the hardware components used (e.g. ESP32, Arduino, Raspberry Pi, Sensors)'),
    expectedOutcome: z
      .string()
      .trim()
      .optional()
      .or(z.literal('')),
    members: z
      .array(memberSchema)
      .min(2, 'At least 2 members are required (including team leader)')
      .max(6, 'Maximum 6 members allowed per team'),
  })
  .superRefine((data, ctx) => {
    // Check for duplicate member names (case-insensitive)
    const names = data.members.map((m) => m.name.trim().toLowerCase());
    const duplicates = names.filter((item, index) => names.indexOf(item) !== index);
    if (duplicates.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['members'],
        message: 'Member names must be distinct. Duplicate names are not allowed.',
      });
    }

    // Ensure all members belong to the same academic year (inter-year not allowed)
    const years = new Set(data.members.map((m) => m.year));
    if (years.size > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['members'],
        message: 'Inter-year collaboration is not permitted. All team members must be from the same academic year.',
      });
    }
  });

export type RegistrationSchemaInput = z.infer<typeof registrationSchema>;
