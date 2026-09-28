import React from 'react';
import { TeamStatus } from '@/types';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: TeamStatus;
  className?: string;
  showIcon?: boolean;
}

export function StatusBadge({ status, className, showIcon = true }: StatusBadgeProps) {
  const configs: Record<
    TeamStatus,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    submitted: {
      label: 'Submitted',
      bg: 'bg-slate-500/15',
      text: 'text-slate-300',
      border: 'border-slate-500/30',
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    under_review: {
      label: 'Under Review',
      bg: 'bg-amber-500/15',
      text: 'text-amber-300',
      border: 'border-amber-500/30',
      icon: <AlertCircle className="w-3.5 h-3.5" />,
    },
    shortlisted: {
      label: 'Shortlisted',
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-300',
      border: 'border-emerald-500/30',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    rejected: {
      label: 'Rejected',
      bg: 'bg-rose-500/15',
      text: 'text-rose-300',
      border: 'border-rose-500/30',
      icon: <XCircle className="w-3.5 h-3.5" />,
    },
  };

  const config = configs[status] || configs.submitted;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border tracking-wide uppercase',
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      {showIcon && config.icon}
      {config.label}
    </span>
  );
}
