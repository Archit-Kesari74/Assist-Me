import { type ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
type ButtonSize = 'md' | 'lg' | 'xl';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  full?: boolean;
  type?: 'button' | 'submit';
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-dark active:bg-primary-dark shadow-soft',
  secondary:
    'bg-primary-light text-primary hover:bg-[#d8e6ff] active:bg-[#c9dcff] border-2 border-primary/20',
  success:
    'bg-success text-white hover:brightness-110 active:brightness-95 shadow-soft',
  danger:
    'bg-error text-white hover:brightness-110 active:brightness-95 shadow-soft',
  ghost:
    'bg-transparent text-ink hover:bg-black/5 active:bg-black/10 border-2 border-ink/15',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: 'min-h-[52px] text-base px-5 py-3 rounded-2xl',
  lg: 'min-h-[64px] text-lg px-6 py-4 rounded-2xl',
  xl: 'min-h-[76px] text-xl px-7 py-5 rounded-3xl',
};

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'lg',
  full = false,
  type = 'button',
  disabled = false,
  ariaLabel,
  className = '',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`font-bold transition-all duration-200 select-none ${
        VARIANT_CLASSES[variant]
      } ${SIZE_CLASSES[size]} ${
        full ? 'w-full' : ''
      } disabled:opacity-50 disabled:pointer-events-none ${className}`}
    >
      {children}
    </button>
  );
}

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`bg-white rounded-3xl shadow-soft border border-black/[0.04] ${className}`}
    >
      {children}
    </div>
  );
}

interface TrustBadgeProps {
  children: ReactNode;
}

export function TrustBadge({ children }: TrustBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 text-success bg-successLight px-4 py-2 rounded-full text-sm font-bold">
      {children}
    </div>
  );
}
