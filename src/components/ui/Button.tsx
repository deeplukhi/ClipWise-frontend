import type { ButtonHTMLAttributes, ReactElement } from 'react';
import { Spinner } from '@/components/ui/Spinner';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactElement;
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-primary text-on-primary hover:opacity-90 active:scale-[0.98] border border-transparent',
  secondary:
    'bg-canvas text-ink border border-hairline hover:bg-canvas-soft-2 active:bg-hairline',
  ghost:
    'bg-transparent text-body hover:text-ink hover:bg-canvas-soft-2 border border-transparent',
  danger:
    'bg-error/10 text-error border border-error/20 hover:bg-error/20 active:bg-error/30',
};

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 h-8 text-sm rounded-sm font-medium',
  md: 'px-4 h-10 text-sm rounded-full font-medium',
  lg: 'px-6 h-12 text-base rounded-full font-medium',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  icon,
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-hairline-strong disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Spinner />
      ) : icon ? (
        <span className="size-4">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
