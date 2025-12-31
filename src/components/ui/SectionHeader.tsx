import type { ReactNode } from 'react';
import Badge from './Badge';
import { motion } from 'framer-motion';

interface SectionHeaderProps {
  badge?: string;
  title: string | ReactNode;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

const SectionHeader = ({
  badge,
  title,
  description,
  align = 'center',
  className = '',
}: SectionHeaderProps) => {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left';
  const maxWidth = align === 'center' ? 'max-w-3xl' : 'max-w-4xl';

  return (
    <motion.div
      className={`${alignClass} ${maxWidth} mb-12 md:mb-16 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {badge && (
        <div className={`mb-4 ${align === 'center' ? 'flex justify-center' : ''}`}>
          <Badge variant="primary">{badge}</Badge>
        </div>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-text-primary mb-4">
        {title}
      </h2>
      <motion.div
        className={`${align === 'center' ? 'mx-auto' : ''} h-[3px] w-20 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full mb-4`}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      />
      {description && (
        <p className="text-lg md:text-xl text-text-secondary leading-relaxed">{description}</p>
      )}
    </motion.div>
  );
};

export default SectionHeader;
