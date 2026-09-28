import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
  helperText?: string;
  options?: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, label, helperText, id, options, children, ...props }, ref) => {
    const selectId = id || props.name;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-slate-200">
            {label}
            {props.required && <span className="text-rose-400 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'flex h-11 w-full appearance-none rounded-lg border bg-slate-950/70 px-3.5 py-2 pr-10 text-sm text-slate-100 transition-colors',
              'border-slate-800 focus-visible:border-indigo-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500',
              'disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer',
              error && 'border-rose-500 focus-visible:border-rose-500 focus-visible:ring-rose-500',
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-100">
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
        {helperText && !error && (
          <p className="text-xs text-slate-400">{helperText}</p>
        )}
        {error && <p className="text-xs font-medium text-rose-400">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';
