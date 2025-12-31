import type { ReactNode } from 'react';
interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'info' | 'secondary';
  size?: 'small' | 'medium';
  className?: string;
}

const Badge = ({ children, variant = 'primary', size = 'medium', className = '' }: BadgeProps) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full';

  const variants = {
    primary: 'bg-background-accent-light text-accent-primary',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    info: 'bg-blue-100 text-blue-700',
    secondary: 'bg-background-secondary text-text-secondary',
  };

  const sizes = {
    small: 'px-3 py-1 text-xs',
    medium: 'px-4 py-2 text-sm',
  };

  const badgeClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return <span className={badgeClasses}>{children}</span>;
};

export default Badge;
