import { GraduationCap, Heart, Briefcase, CheckCircle } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import { motion } from 'framer-motion';

const UseCasesSection = () => {
  const useCases = [
    {
      imagePosition: 'left',
      title: 'For Students & Educators',
      description:
        'Convert lecture notes, preview assignments, analyze documents - all the tools you need for academic success in one place.',
      benefits: [
        'Quick PDF to Word conversion for editing',
        'Preview documents before submitting',
        'Word count and readability analysis',
        'Free for educational use',
      ],
      icon: GraduationCap,
    },
    {
      imagePosition: 'right',
      title: 'For Medical & Insurance Professionals',
      description:
        'Specialized tools for handling medical records, lab reports, and insurance documents with OCR and HIPAA-compliant processing.',
      benefits: [
        'OCR for scanned TIFF documents',
        'Batch processing for multiple files',
        'Privacy-focused processing',
        'Export to various formats',
      ],
      icon: Heart,
    },
    {
      imagePosition: 'left',
      title: 'For Small Businesses',
      description:
        'Streamline document workflows, convert invoices, edit contracts, and analyze business documents - all without expensive software.',
      benefits: [
        'No software licensing costs',
        'Team collaboration features',
        'Batch processing for efficiency',
        'API access for automation',
      ],
      icon: Briefcase,
    },
  ];

  return (
    <section className="bg-white">
      <div className="container-custom section-padding">
        <SectionHeader
          badge="Use Cases"
          title="Built for everyone who works with files"
        />

        <div className="space-y-20">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            const isLeft = useCase.imagePosition === 'left';

            return (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  !isLeft ? 'lg:grid-flow-dense' : ''
                }`}
              >
                {/* Image/Icon Side */}
                <div className={`${!isLeft ? 'lg:col-start-2' : ''}`}>
                  <div className="bg-gradient-to-br from-accent-primary to-accent-secondary rounded-3xl p-12 flex items-center justify-center aspect-square max-w-md mx-auto shadow-2xl">
                    <Icon className="w-48 h-48 text-white" strokeWidth={1.5} />
                  </div>
                </div>

                {/* Content Side */}
                <div className={`${!isLeft ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <h3 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                    {useCase.title}
                  </h3>
                  <p className="text-lg text-text-secondary mb-6 leading-relaxed">
                    {useCase.description}
                  </p>

                  <ul className="space-y-4">
                    {useCase.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-accent-success flex-shrink-0 mt-1" />
                        <span className="text-text-primary">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
