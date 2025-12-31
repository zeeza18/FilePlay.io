import { Upload, Settings, Download } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import Button from '../ui/Button';
import { motion } from 'framer-motion';

const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      icon: Upload,
      title: 'Upload your file',
      description: 'Drag and drop any file or click to browse. We support all major formats.',
    },
    {
      number: '02',
      icon: Settings,
      title: 'Choose your action',
      description: 'Select what you want to do - view, convert, edit, analyze, or use AI tools.',
    },
    {
      number: '03',
      icon: Download,
      title: 'Get instant results',
      description: 'Download your processed file or continue working with other tools.',
    },
  ];

  return (
    <section className="bg-white">
      <div className="container-custom section-padding">
        <SectionHeader
          badge="Simple Process"
          title="Get started in seconds"
          description="No registration, no downloads, no complexity. Just drag, drop, and done."
        />

        <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative text-center"
              >
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-24 left-1/2 w-full h-0.5 border-t-2 border-dashed border-ui-border z-0" />
                )}

                {/* Step Number */}
                <div className="inline-block bg-background-accent-light text-accent-primary font-black text-2xl px-6 py-2 rounded-full mb-6">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="relative z-10 w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-2xl flex items-center justify-center shadow-lg">
                  <Icon className="w-10 h-10 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-text-secondary leading-relaxed">{step.description}</p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default HowItWorksSection;
