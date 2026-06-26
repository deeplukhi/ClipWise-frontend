import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const baseClass =
  'w-full bg-canvas border border-hairline rounded-sm px-3 py-2 text-sm text-ink placeholder-mute transition-all duration-200 focus:outline-none focus:border-hairline-strong focus:ring-1 focus:ring-hairline-strong/30';

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[12px] font-mono text-body uppercase tracking-wider">{label}</label>}
      <input className={`${baseClass} h-10 ${error ? 'border-error focus:border-error focus:ring-error/30' : ''} ${className}`} {...props} />
      {error && <span className="text-xs text-error">{error}</span>}
    </div>
  );
}
