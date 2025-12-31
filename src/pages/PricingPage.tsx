import { useState } from 'react';
import { MouseEvent } from 'react';
import { Check, X } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import FAQSection from '../components/sections/FAQSection';

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

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
      price: { monthly: '$0', yearly: '$0' },
      description: 'Perfect for occasional use',
      features: [
        { text: '5 conversions per day', included: true },
        { text: 'All preview features', included: true },
        { text: '3 AI operations per day', included: true },
        { text: 'Basic analysis tools', included: true },
        { text: 'Community support', included: true },
        { text: 'File size limit: 10MB', included: true },
        { text: 'No ads', included: false },
        { text: 'Batch processing', included: false },
        { text: 'Priority support', included: false },
      ],
      cta: { text: 'Get Started', style: 'secondary' as const, link: '/#convert' },
      popular: false,
    },
    {
      name: 'Pro',
      price: { monthly: '$9.99', yearly: '$95.90' },
      description: 'For power users and professionals',
      features: [
        { text: 'Unlimited conversions', included: true },
        { text: '100 AI operations per month', included: true },
        { text: 'Advanced analysis tools', included: true },
        { text: 'Batch processing', included: true },
        { text: 'No ads', included: true },
        { text: 'Priority support', included: true },
        { text: '5GB cloud storage', included: true },
        { text: 'File size limit: 50MB', included: true },
        { text: 'Download history', included: true },
      ],
      cta: { text: 'Start 14-Day Free Trial', style: 'primary' as const, link: '/signup' },
      popular: true,
      badge: 'Most Popular',
    },
    {
      name: 'Business',
      price: { monthly: '$49', yearly: '$470' },
      description: 'For teams and organizations',
      features: [
        { text: 'Everything in Pro', included: true },
        { text: '1000 AI operations per month', included: true },
        { text: 'API access', included: true },
        { text: 'Team collaboration (up to 10 users)', included: true },
        { text: 'White-label option', included: true },
        { text: 'HIPAA compliance', included: true },
        { text: 'Dedicated support', included: true },
        { text: 'Custom integrations', included: true },
        { text: 'File size limit: 100MB', included: true },
        { text: 'Custom SLA', included: true },
      ],
      cta: { text: 'Contact Sales', style: 'secondary' as const, link: '/contact' },
      popular: false,
    },
  ];

  return (
    <div className="bg-white">
      <div className="container-custom section-padding">
        {/* Page Header */}
        <SectionHeader
          title="Choose the plan that's right for you"
          description="Start free, upgrade anytime. No credit card required for free tier."
        />

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span
            className={`font-medium ${
              billingCycle === 'monthly' ? 'text-text-primary' : 'text-text-secondary'
            }`}
          >
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className={`relative w-16 h-8 rounded-full transition-colors ${
              billingCycle === 'yearly' ? 'bg-accent-primary' : 'bg-ui-border'
            }`}
          >
            <div
              className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                billingCycle === 'yearly' ? 'transform translate-x-9' : 'translate-x-1'
              }`}
            />
          </button>
          <span
            className={`font-medium ${
              billingCycle === 'yearly' ? 'text-text-primary' : 'text-text-secondary'
            }`}
          >
            Yearly
          </span>
          {billingCycle === 'yearly' && (
            <Badge variant="success" size="small">
              Save 20%
            </Badge>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card
              key={plan.name}
              hover
              animated
              delay={index * 0.1}
              className={`relative overflow-visible ${plan.popular ? 'ring-2 ring-accent-primary' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge variant="primary" className="shadow-md">{plan.badge}</Badge>
                </div>
              )}

              <h3 className="text-2xl font-bold text-text-primary mb-2">{plan.name}</h3>

              <div className="mb-4">
                <span className="text-5xl font-black text-text-primary">
                  {plan.price[billingCycle]}
                </span>
                {plan.name !== 'Free' && (
                  <span className="text-text-secondary ml-2">
                    {billingCycle === 'monthly' ? '/month' : '/year'}
                  </span>
                )}
              </div>

              <p className="text-text-secondary mb-6">{plan.description}</p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-accent-success flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-text-muted flex-shrink-0 mt-0.5" />
                    )}
                    <span
                      className={`text-sm ${
                        feature.included ? 'text-text-primary' : 'text-text-muted'
                      }`}
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                href={plan.name === 'Free' ? undefined : plan.cta.link}
                onClick={plan.name === 'Free' ? scrollToConvert : undefined}
                variant={plan.cta.style}
                size="large"
                className="w-full"
                type={plan.name === 'Free' ? 'button' : undefined}
              >
                {plan.cta.text}
              </Button>
            </Card>
          ))}
        </div>

        {/* Money-back Guarantee */}
        <div className="text-center mb-16">
          <p className="text-text-secondary">
            All paid plans include a 14-day money-back guarantee
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section */}
      <div className="bg-background-secondary">
        <div className="container-custom section-padding text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-text-secondary mb-8">
            Join thousands of users who've already made the switch
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={scrollToConvert} variant="primary" size="large" type="button">
              Start Free
            </Button>
            <Button href="/contact" variant="secondary" size="large">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
