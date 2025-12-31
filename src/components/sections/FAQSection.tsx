import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import { motion, AnimatePresence } from 'framer-motion';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const questions = [
    {
      question: 'Is FilePlay really free?',
      answer:
        'Yes! Our free tier includes 5 conversions per day, unlimited preview, and 3 AI operations per day. No credit card required.',
    },
    {
      question: 'Are my files secure?',
      answer:
        'Absolutely. Files are processed locally in your browser when possible. For server processing, files are encrypted in transit and deleted immediately after processing.',
    },
    {
      question: 'What file formats do you support?',
      answer:
        'We support all major formats including PDF, DOCX, XLSX, JPG, PNG, GIF, WEBP, TIFF, CSV, TXT, and more. Check our supported formats section for the complete list.',
    },
    {
      question: 'Do I need to create an account?',
      answer:
        'No account needed for basic features. Create a free account to save your conversion history and access premium features.',
    },
    {
      question: 'Can I use FilePlay for my business?',
      answer:
        'Yes! We offer Business plans with API access, team collaboration, and HIPAA compliance. Contact our sales team for custom solutions.',
    },
    {
      question: "What's the file size limit?",
      answer:
        'Free tier: 10MB per file. Pro: 50MB per file. Business: 100MB per file. Contact us for larger file processing needs.',
    },
  ];

  return (
    <section className="bg-background-secondary">
      <div className="container-custom section-padding">
        <SectionHeader
          badge="FAQ"
          title="Frequently asked questions"
          description="Everything you need to know about FilePlay"
        />

        <div className="max-w-3xl mx-auto space-y-4">
          {questions.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-xl border border-ui-border overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-background-secondary transition-colors"
              >
                <span className="font-semibold text-text-primary pr-4">{item.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-accent-primary flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-text-secondary leading-relaxed">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
