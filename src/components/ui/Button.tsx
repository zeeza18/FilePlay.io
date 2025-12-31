import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'white';
  size?: 'small' | 'medium' | 'large';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  href?: string;
  external?: boolean;
}

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  icon: Icon,
  iconPosition = 'right',
  href,
  external = false,
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyles =
    'relative overflow-hidden inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-accent-primary/40 focus-visible:outline-none';

  const shineEffect =
    "before:content-[''] before:absolute before:inset-y-[-40%] before:left-[-30%] before:w-1/2 before:bg-white/30 before:blur before:skew-x-12 before:translate-x-[-120%] hover:before:translate-x-[180%] before:transition-transform before:duration-500";

  const variants = {
    primary:
      'bg-accent-primary text-white hover:bg-accent-primary-hover shadow-[0_10px_30px_-12px_rgba(79,70,229,0.8)] hover:shadow-[0_18px_45px_-12px_rgba(79,70,229,0.75)] active:translate-y-[1px]',
    secondary:
      'bg-transparent text-accent-primary border-2 border-accent-primary hover:bg-accent-primary hover:text-white shadow-[0_10px_30px_-18px_rgba(79,70,229,0.5)] active:translate-y-[1px]',
    ghost: 'bg-transparent text-text-primary hover:bg-background-secondary active:translate-y-[1px]',
    white:
      'bg-white text-accent-primary border-2 border-white hover:bg-transparent hover:text-white shadow-[0_10px_30px_-18px_rgba(79,70,229,0.35)] active:translate-y-[1px]',
  };

  const sizes = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  };

  const buttonClasses = `${baseStyles} ${shineEffect} ${variants[variant]} ${sizes[size]} ${className}`;

  const content = (
    <>
      {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
    </>
  );

  if (href) {
    if (external) {
      return (
        <a href={href} className={buttonClasses} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      );
    }
    return (
      <Link to={href} className={buttonClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button className={buttonClasses} {...props}>
      {content}
    </button>
  );
};

export default Button;
