import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, disabled, children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none';

    const variants = {
      primary:
        'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 border border-indigo-500/30',
      secondary:
        'bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700 shadow-sm',
      outline:
        'border border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800/80 hover:text-white',
      danger:
        'bg-rose-600 text-white hover:bg-rose-500 shadow-lg shadow-rose-600/25 border border-rose-500/30',
      ghost:
        'bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white',
      success:
        'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/25 border border-emerald-500/30',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs gap-1.5',
      md: 'h-10 px-4 text-sm gap-2',
      lg: 'h-12 px-6 text-base gap-2.5 font-semibold',
      icon: 'h-9 w-9 p-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
