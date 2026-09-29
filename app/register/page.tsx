'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/firebase/client';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  EXPO_THEMES,
  COLLEGE_YEARS,
  COLLEGE_SECTIONS,
  CollegeYear,
  CollegeSection,
  getSectionsForYear,
} from '@/types';
import {
  Users,
  Cpu,
  Layers,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

interface MemberFormState {
  name: string;
  year: CollegeYear;
  section: CollegeSection;
}

export default function RegisterPage() {
  const router = useRouter();

  // Auth & loading states
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Wizard Step: 1 = Team & Project, 2 = Team Members, 3 = Review & Submit
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Team & Project Data
  const [teamName, setTeamName] = useState('');
  const [teamLeaderName, setTeamLeaderName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [theme, setTheme] = useState<string>(EXPO_THEMES[0]);
  const [projectTitle, setProjectTitle] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [solutionDescription, setSolutionDescription] = useState('');
  const [technologiesUsed, setTechnologiesUsed] = useState('');
  const [hardwareComponents, setHardwareComponents] = useState('');
  const [expectedOutcome, setExpectedOutcome] = useState('');

  // Step 2: Members (2 to 6)
  const [members, setMembers] = useState<MemberFormState[]>([
    { name: '', year: '3rd Year', section: 'A' },
    { name: '', year: '3rd Year', section: 'A' },
  ]);

  // Step 3: Terms Confirmation
  const [confirmedSoftwareHardware, setConfirmedSoftwareHardware] = useState(false);

  // Validation errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // If not logged in, redirect to login
        router.replace('/login');
        return;
      }

      setCurrentUser(user);
      setEmail(user.email || '');
      const autoName = user.displayName || user.email?.split('@')[0] || '';
      setTeamLeaderName(autoName);

      // Pre-fill member 1 with leader name
      setMembers((prev) => [
        { name: autoName, year: '3rd Year', section: 'A' },
        prev[1] || { name: '', year: '3rd Year', section: 'B' },
      ]);

      // Check if user already submitted a project
      try {
        const res = await fetch(`/api/registration?email=${encodeURIComponent(user.email || '')}&userId=${encodeURIComponent(user.uid)}`);
        const data = await res.json();
        if (data?.team) {
          router.replace(`/success?submission_id=${encodeURIComponent(data.team.submission_id)}&team_name=${encodeURIComponent(data.team.team_name)}&project_title=${encodeURIComponent(data.team.project_title)}&existing=true`);
          return;
        }
      } catch (err) {
        console.error('Error checking registration status:', err);
      } finally {
        setIsAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Sync teamLeaderName to Member 1
  const handleLeaderNameChange = (val: string) => {
    setTeamLeaderName(val);
    setMembers((prev) => {
      const updated = [...prev];
      if (updated[0]) {
        updated[0] = { ...updated[0], name: val };
      }
      return updated;
    });
  };

  // Add Member (up to 6)
  const handleAddMember = () => {
    if (members.length >= 6) return;
    setMembers((prev) => [
      ...prev,
      { name: '', year: '3rd Year', section: 'A' },
    ]);
  };

  // Remove Member (minimum 2)
  const handleRemoveMember = (index: number) => {
    if (members.length <= 2) {
      alert('A minimum of 2 members is required.');
      return;
    }
    setMembers((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleMemberChange = (
    index: number,
    field: keyof MemberFormState,
    value: string
  ) => {
    setMembers((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      // If switching year away from 1st Year and section was E, F, or G, reset to Section A
      if (field === 'year' && value !== '1st Year' && (copy[index].section === 'E' || copy[index].section === 'F' || copy[index].section === 'G')) {
        copy[index].section = 'A';
      }
      return copy;
    });
  };

  // Step 1 Validation
  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    if (!teamName.trim() || teamName.trim().length < 3) {
      errors.teamName = 'Team name must be at least 3 characters.';
    }
    if (!teamLeaderName.trim() || teamLeaderName.trim().length < 2) {
      errors.teamLeaderName = 'Leader name must be at least 2 characters.';
    }
    const cleanPhone = whatsappNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      errors.whatsappNumber = 'Please provide a valid 10-digit Indian WhatsApp number.';
    }
    if (!projectTitle.trim() || projectTitle.trim().length < 5) {
      errors.projectTitle = 'Project title must be at least 5 characters.';
    }
    if (!problemDescription.trim() || problemDescription.trim().length < 30) {
      errors.problemDescription = 'Please provide a detailed problem description (min 30 characters).';
    }
    if (!solutionDescription.trim() || solutionDescription.trim().length < 30) {
      errors.solutionDescription = 'Please describe your proposed solution (min 30 characters).';
    }
    if (!technologiesUsed.trim()) {
      errors.technologiesUsed = 'Specify software technologies used (e.g. Next.js, Python, OpenCV).';
    }
    if (!hardwareComponents.trim()) {
      errors.hardwareComponents = 'Hardware components are required (e.g. ESP32, Sensors, Raspberry Pi).';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    const errors: Record<string, string> = {};
    if (members.length < 2) {
      errors.members = 'A minimum of 2 members is required.';
    }
    if (members.length > 6) {
      errors.members = 'A maximum of 6 members is allowed.';
    }

    // Check individual member names
    members.forEach((m, idx) => {
      if (!m.name.trim() || m.name.trim().length < 2) {
        errors[`member_${idx}`] = `Member ${idx + 1} name is required.`;
      }
    });

    // Check duplicates
    const names = members.map((m) => m.name.trim().toLowerCase()).filter(Boolean);
    const hasDuplicates = names.some((n, i) => names.indexOf(n) !== i);
    if (hasDuplicates) {
      errors.members = 'Duplicate member names detected. Each member must have a distinct name.';
    }

    // Check same academic year (inter-year not permitted)
    const memberYears = Array.from(new Set(members.map((m) => m.year).filter(Boolean)));
    if (memberYears.length > 1) {
      errors.members = 'Inter-year collaboration is not permitted. All team members must belong to the same academic year (Inter-section is allowed).';
    }

    // Check valid section per year (E, F, and G only for 1st Year)
    members.forEach((m, idx) => {
      if (m.year !== '1st Year' && (m.section === 'E' || m.section === 'F' || m.section === 'G')) {
        errors[`member_${idx}`] = `Sections E, F, and G are only available for 1st Year. Please select Section A, B, C, or D for ${m.year}.`;
      }
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        setCurrentStep(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrevStep = () => {
    setFieldErrors({});
    if (currentStep === 2) setCurrentStep(1);
    if (currentStep === 3) setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Final Submission
  const handleSubmit = async () => {
    if (!confirmedSoftwareHardware) {
      setSubmitError('You must confirm that your project includes both Software and Hardware components.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const payload = {
      teamName,
      teamLeaderName,
      whatsappNumber,
      email: currentUser?.email || email,
      userId: currentUser?.uid || `user_${Date.now()}`,
      theme,
      projectTitle,
      problemDescription,
      solutionDescription,
      technologiesUsed,
      hardwareComponents,
      expectedOutcome,
      members,
    };

    try {
      const response = await fetch('/api/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let result: any;
      try {
        result = await response.json();
      } catch (parseErr) {
        setSubmitError(`Server error (${response.status}): Could not complete registration. Please try again.`);
        setIsSubmitting(false);
        return;
      }

      if (!response.ok) {
        if (response.status === 409 && result?.submissionId) {
          router.replace(`/success?submission_id=${encodeURIComponent(result.submissionId)}&team_name=${encodeURIComponent(result.teamName || '')}&project_title=${encodeURIComponent(result.projectTitle || '')}&existing=true`);
          return;
        }
        setSubmitError(result?.error || 'Failed to submit registration.');
        setIsSubmitting(false);
        return;
      }

      // Success redirect with submission ID
      router.replace(
        `/success?submission_id=${encodeURIComponent(result.submissionId)}&team_name=${encodeURIComponent(
          result.teamName
        )}&project_title=${encodeURIComponent(result.projectTitle)}&wa=${result.whatsappDelivered ? '1' : '0'}`
      );
    } catch (err: any) {
      setSubmitError(err?.message || 'A network error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-400">Verifying authenticated session...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          CSE Project Expo 2026 Registration
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Register Your Project Team
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-xl mx-auto">
          Complete the 3-step registration. Ensure your project integrates both Software and Hardware subsystems.
        </p>

        {/* Progress Tracker */}
        <div className="mt-8 flex items-center justify-center gap-2 sm:gap-4 max-w-md mx-auto">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${
              currentStep === 1
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : currentStep > 1
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-900 text-slate-500'
            }`}
          >
            <span>1. Team & Project</span>
          </div>

          <div className="w-4 h-0.5 bg-slate-800" />

          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${
              currentStep === 2
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : currentStep > 2
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-900 text-slate-500'
            }`}
          >
            <span>2. Members (2–6)</span>
          </div>

          <div className="w-4 h-0.5 bg-slate-800" />

          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${
              currentStep === 3
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-500'
            }`}
          >
            <span>3. Review</span>
          </div>
        </div>
      </div>

      {submitError && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-rose-300">Registration Error</h4>
            <p className="text-xs text-rose-300/90 mt-0.5">{submitError}</p>
          </div>
        </div>
      )}

      {/* STEP 1: TEAM & PROJECT DETAILS */}
      {currentStep === 1 && (
        <Card className="border-white/10 bg-slate-900/80">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Step 1: Team & Project Specifications</CardTitle>
                <CardDescription>
                  Enter your team identity, problem theme, and hardware/software technical architecture.
                </CardDescription>
              </div>
              <Badge variant="cyan" size="sm">
                Software + Hardware
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-2">
            {/* Team Basics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Team Name"
                placeholder="e.g. AgriSense IoT"
                required
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                error={fieldErrors.teamName}
              />

              <Input
                label="Team Leader Full Name"
                placeholder="e.g. Aarav Sharma"
                required
                value={teamLeaderName}
                onChange={(e) => handleLeaderNameChange(e.target.value)}
                error={fieldErrors.teamLeaderName}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Team Leader WhatsApp Number"
                placeholder="e.g. 9876543210"
                helperText="Will receive automated status confirmations (normalized to +91)"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                error={fieldErrors.whatsappNumber}
              />

              <Input
                label="Google Account Email"
                value={email}
                disabled
                helperText="Locked to authenticated Gmail account"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Problem Theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                required
                options={EXPO_THEMES.map((t) => ({ value: t, label: t }))}
              />

              <Input
                label="Project Title"
                placeholder="e.g. Precision Soil Health & Automated Irrigation System"
                required
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                error={fieldErrors.projectTitle}
              />
            </div>

            {/* Problem & Solution */}
            <Textarea
              label="Problem Statement / Description"
              placeholder="Explain the real-world issue, inefficiency, or pain point your project addresses (minimum 30 characters)..."
              required
              rows={3}
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              error={fieldErrors.problemDescription}
            />

            <Textarea
              label="Proposed Solution Architecture"
              placeholder="Describe your engineered solution, working mechanism, and architecture (minimum 30 characters)..."
              required
              rows={3}
              value={solutionDescription}
              onChange={(e) => setSolutionDescription(e.target.value)}
              error={fieldErrors.solutionDescription}
            />

            {/* Software & Hardware Specs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Textarea
                label="Software Technologies Used"
                placeholder="e.g. Next.js, Python Flask, TensorFlow Lite, PostgreSQL, MQTT"
                required
                rows={3}
                value={technologiesUsed}
                onChange={(e) => setTechnologiesUsed(e.target.value)}
                error={fieldErrors.technologiesUsed}
              />

              <Textarea
                label="Hardware Components & Sensors"
                placeholder="e.g. ESP32 DevKit, Capacitive Soil Probe, Solenoid Relays, LoRa Module"
                required
                rows={3}
                value={hardwareComponents}
                onChange={(e) => setHardwareComponents(e.target.value)}
                error={fieldErrors.hardwareComponents}
              />
            </div>

            <Input
              label="Expected Outcome & Societal Impact (Optional)"
              placeholder="e.g. 35% water savings and early detection of nutrient deficiency"
              value={expectedOutcome}
              onChange={(e) => setExpectedOutcome(e.target.value)}
            />

            <div className="flex justify-end pt-4 border-t border-white/[0.08]">
              <Button onClick={handleNextStep} className="gap-2 px-6">
                Next: Add Team Members
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 2: TEAM MEMBERS */}
      {currentStep === 2 && (
        <Card className="border-white/10 bg-slate-900/80">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Step 2: Team Members</CardTitle>
                <CardDescription>
                  Specify all participating students. Minimum 2 and maximum 6 members (Leader is Member 1). All members must belong to the same academic year (inter-section allowed, inter-year not allowed).
                </CardDescription>
              </div>
              <Badge variant="purple" size="sm">
                {members.length} / 6 Members
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-2">
            {fieldErrors.members && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                {fieldErrors.members}
              </div>
            )}

            <div className="space-y-4">
              {members.map((member, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                      Member {index + 1} {index === 0 && '(Team Leader)'}
                    </span>
                    {index > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(index)}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                        title="Remove Member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-1">
                      <Input
                        label="Full Name"
                        placeholder="Student name"
                        value={member.name}
                        onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                        error={fieldErrors[`member_${index}`]}
                        disabled={index === 0} // Syncs from leader name
                      />
                    </div>

                    <div>
                      <Select
                        label="Year of Study"
                        value={member.year}
                        onChange={(e) =>
                          handleMemberChange(index, 'year', e.target.value as CollegeYear)
                        }
                        options={COLLEGE_YEARS.map((y) => ({ value: y, label: y }))}
                      />
                    </div>

                    <div>
                      <Select
                        label="Section"
                        value={member.section}
                        onChange={(e) =>
                          handleMemberChange(index, 'section', e.target.value as CollegeSection)
                        }
                        options={getSectionsForYear(member.year).map((s) => ({
                          value: s,
                          label: `Section ${s}`,
                        }))}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {members.length < 6 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleAddMember}
                className="w-full border-dashed border-slate-700 hover:border-indigo-500 py-3 text-slate-300"
              >
                <Plus className="w-4 h-4 mr-2 text-indigo-400" />
                Add Member ({members.length + 1} of 6)
              </Button>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
              <Button variant="ghost" onClick={handlePrevStep} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button onClick={handleNextStep} className="gap-2 px-6">
                Next: Review & Submit
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 3: REVIEW & SUBMIT */}
      {currentStep === 3 && (
        <Card className="border-white/10 bg-slate-900/80">
          <CardHeader>
            <CardTitle>Step 3: Review & Final Submission</CardTitle>
            <CardDescription>
              Please review all entered details carefully before final registration.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-2">
            {/* Team Info Dossier */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Project & Team Summary
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-slate-400">Team Name</span>
                  <p className="font-semibold text-white">{teamName}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">Theme</span>
                  <p className="font-semibold text-indigo-300">{theme}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">Team Leader</span>
                  <p className="font-semibold text-white">{teamLeaderName}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">WhatsApp Contact</span>
                  <p className="font-semibold text-white">{whatsappNumber}</p>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-xs text-slate-400">Project Title</span>
                  <p className="font-semibold text-white text-base">{projectTitle}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold">Software Stack:</span>{' '}
                  <span className="text-slate-200">{technologiesUsed}</span>
                </div>
                <div>
                  <span className="text-cyan-400 font-semibold">Hardware Components:</span>{' '}
                  <span className="text-slate-200">{hardwareComponents}</span>
                </div>
              </div>
            </div>

            {/* Team Members List */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Team Members ({members.length})
                </h3>
              </div>

              <div className="divide-y divide-slate-800">
                {members.map((m, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-white">
                      {idx + 1}. {m.name} {idx === 0 && <span className="text-xs text-indigo-400">(Leader)</span>}
                    </span>
                    <span className="text-xs text-slate-400">
                      {m.year} • Sec {m.section}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mandatory Compliance Checkbox */}
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmedSoftwareHardware}
                  onChange={(e) => setConfirmedSoftwareHardware(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-950"
                />
                <span className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  I hereby certify that this project strictly incorporates both <strong>Software and Hardware</strong> components. A working physical prototype will be presented during the expo jury review.
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
              <Button variant="ghost" onClick={handlePrevStep} disabled={isSubmitting} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Members
              </Button>
              <Button
                onClick={handleSubmit}
                isLoading={isSubmitting}
                disabled={!confirmedSoftwareHardware}
                className="gap-2 px-8 text-base shadow-xl shadow-indigo-600/30"
              >
                <CheckCircle2 className="w-4 h-4" />
                Submit Project
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
