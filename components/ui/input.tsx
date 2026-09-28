import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, label, helperText, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-slate-200">
            {label}
            {props.required && <span className="text-rose-400 ml-1">*</span>}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            'flex h-11 w-full rounded-lg border bg-slate-950/70 px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 transition-colors',
            'border-slate-800 focus-visible:border-indigo-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500',
            'disabled:cursor-not-allowed disabled:opacity-50',
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
Input.displayName = 'Input';
