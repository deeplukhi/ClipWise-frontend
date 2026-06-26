interface BadgeProps {
  children: string;
  variant?: 'default' | 'accent' | 'outline';
  className?: string;
}

const variantStyles = {
  default: 'bg-canvas-soft-2 text-body',
  accent: 'bg-accent-soft text-accent',
  outline: 'bg-canvas text-ink border border-hairline',
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
