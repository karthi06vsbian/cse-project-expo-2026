import React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, helperText, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-slate-200">
            {label}
            {props.required && <span className="text-rose-400 ml-1">*</span>}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          className={cn(
            'flex min-h-[96px] w-full rounded-lg border bg-slate-950/70 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 transition-colors',
            'border-slate-800 focus-visible:border-indigo-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500',
            'disabled:cursor-not-allowed disabled:opacity-50 resize-y',
            error && 'border-rose-500 focus-visible:border-rose-500 focus-visible:ring-rose-500',
            className
          )}
          {...props}
        />
        {helperText && !error && (
          <p className="text-xs text-slate-400">{helperText}</p>
        )}
        {error && <p className="text-xs font-medium text-rose-400">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
