import { Check } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { MouseEvent } from 'react';

const PricingPreviewSection = () => {
  const scrollToConvert = (e?: MouseEvent) => {
    if (e) e.preventDefault();
    const target = document.getElementById('convert');
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    } else {
      window.location.href = '/#convert';
    }
  };

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for occasional use',
      features: [
        '5 conversions per day',
        'All preview features',
        '3 AI operations per day',
        'Basic analysis tools',
        'Community support',
      ],
      cta: { text: 'Get Started', style: 'secondary' as const, link: '/#convert' },
      popular: false,
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: 'per month',
      description: 'For power users and professionals',
      features: [
        'Unlimited conversions',
        '100 AI operations per month',
        'Advanced analysis tools',
        'Batch processing',
        'No ads',
        'Priority support',
        '5GB cloud storage',
      ],
      cta: { text: 'Start Free Trial', style: 'primary' as const, link: '/pricing' },
      popular: true,
      badge: 'Most Popular',
    },
    {
      name: 'Business',
      price: '$49',
      period: 'per month',
      description: 'For teams and organizations',
      features: [
        'Everything in Pro',
        '1000 AI operations per month',
        'API access',
        'Team collaboration',
        'White-label option',
        'HIPAA compliance',
        'Dedicated support',
        'Custom integrations',
      ],
      cta: { text: 'Contact Sales', style: 'secondary' as const, link: '/contact' },
      popular: false,
    },
  ];

  return (
    <section className="bg-background-secondary">
      <div className="container-custom section-padding">
        <SectionHeader
          badge="Pricing"
          title="Choose the plan that's right for you"
          description="Start free, upgrade when you need more. No credit card required."
        />

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {plans.map((plan, index) => (
            <Card
              key={plan.name}
              hover
              animated
              delay={index * 0.1}
              className="relative overflow-visible"
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge variant="primary" className="shadow-md">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-2xl font-bold text-text-primary mb-2">{plan.name}</h3>

              {/* Price */}
              <div className="mb-4">
                <span className="text-5xl font-black text-text-primary">{plan.price}</span>
                <span className="text-text-secondary ml-2">{plan.period}</span>
              </div>

              {/* Description */}
              <p className="text-text-secondary mb-6">{plan.description}</p>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-accent-success flex-shrink-0 mt-0.5" />
                    <span className="text-text-secondary text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                href={plan.name === 'Free' ? undefined : plan.cta.link}
                onClick={plan.name === 'Free' ? scrollToConvert : undefined}
                variant={plan.cta.style}
                size="medium"
                className="w-full"
                type={plan.name === 'Free' ? 'button' : undefined}
              >
                {plan.cta.text}
              </Button>
            </Card>
          ))}
        </div>

        <p className="text-center text-text-secondary">
          All plans include 14-day money-back guarantee
        </p>
      </div>
    </section>
  );
};

export default PricingPreviewSection;
