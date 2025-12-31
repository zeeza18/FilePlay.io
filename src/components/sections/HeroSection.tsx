import { ArrowRight, Play, Shield, Lock, Zap } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const HeroSection = () => {
  const trustBadges = [
    { icon: Shield, text: '100% Secure' },
    { icon: Lock, text: 'Privacy First' },
    { icon: Zap, text: 'Lightning Fast' },
  ];

  const stats = [
    { number: '50K+', label: 'Files Processed' },
    { number: '10K+', label: 'Happy Users' },
    { number: '99.9%', label: 'Uptime' },
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
    <section className="bg-white">
      <div className="container-custom py-16 md:py-24 lg:py-32">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="mb-6 flex justify-center">
            <Badge variant="primary" size="medium">
              🎉 Now live: Preview & Convert modules
            </Badge>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Play with your <span className="gradient-text">files</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-text-secondary leading-relaxed mb-8 max-w-3xl mx-auto">
            All-in-one file management platform. View, convert, edit, analyze, and use AI
            tools on your documents - all in your browser. No downloads, no limits, no hassle.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Button onClick={handleGetStarted} variant="primary" size="large" icon={ArrowRight} type="button">
              Get Started Free
            </Button>
            <Button href="#demo" variant="secondary" size="large" icon={Play}>
              Watch Demo
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {trustBadges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div key={badge.text} className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-accent-primary" />
                  <span className="text-sm font-medium text-text-secondary">{badge.text}</span>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black text-accent-primary">{stat.number}</div>
                <div className="text-sm text-text-secondary">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
