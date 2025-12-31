import { Zap } from 'lucide-react';
import Button from '../ui/Button';
import { motion } from 'framer-motion';

const FinalCTASection = () => {
  const trustIndicators = [
    'No credit card required',
    'Free forever',
    '14-day money-back guarantee',
  ];

  const handleGetStarted = () => {
    const target = document.getElementById('convert');
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    } else {
      window.location.href = '/#convert';
    }
  };

  return (
    <section className="bg-gradient-to-r from-accent-primary to-accent-secondary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom section-padding relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-8 backdrop-blur-sm">
            <Zap className="w-12 h-12 text-white" />
          </div>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6">
            Ready to start playing with your files?
          </h2>

          {/* Description */}
          <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed">
            Join thousands of users who've already made the switch to FilePlay. No credit card
            required.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              onClick={handleGetStarted}
              variant="white"
              size="large"
              className="shadow-xl hover:shadow-2xl"
              type="button"
            >
              Get Started Free
            </Button>
            <Button
              href="/pricing"
              variant="ghost"
              size="large"
              className="border-2 border-white text-white hover:bg-white/10"
            >
              View Pricing
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap gap-6 justify-center text-white/90">
            {trustIndicators.map((indicator) => (
              <div key={indicator} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-sm md:text-base">{indicator}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;
