import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'small' | 'medium' | 'large';
  animated?: boolean;
  delay?: number;
}

const Card = ({
  children,
  className = '',
  hover = false,
  padding = 'medium',
  animated = false,
  delay = 0,
}: CardProps) => {
  const baseStyles =
    'relative overflow-hidden bg-white rounded-xl border border-ui-border transition-all duration-300 will-change-transform';

  const hoverStyles = hover
    ? 'hover:-translate-y-2 hover:shadow-[0_20px_60px_-24px_rgba(79,70,229,0.35)] hover:border-accent-primary/40 cursor-pointer'
    : '';

  const paddingStyles = {
    small: 'p-4',
    medium: 'p-6 md:p-8',
    large: 'p-8 md:p-10 lg:p-12',
  };

  const glowOverlay =
    "before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-accent-primary/5 before:to-accent-secondary/5 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:pointer-events-none";

  const cardClasses = `${baseStyles} ${hoverStyles} ${glowOverlay} ${paddingStyles[padding]} ${className}`;

  if (animated) {
    return (
      <motion.div
        className={cardClasses}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={cardClasses}>{children}</div>;
};

export default Card;
