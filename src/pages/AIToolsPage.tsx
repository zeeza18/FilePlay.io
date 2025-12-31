import { FileText, Users, Languages, Search, Lightbulb, Sparkles } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import WaitlistForm from '../components/ui/WaitlistForm';

const AIToolsPage = () => {
  const features = [
    {
      icon: FileText,
      title: 'Summarize',
      description: 'Condense long documents into concise summaries',
    },
    {
      icon: Users,
      title: 'Humanize',
      description: 'Make AI-generated text sound natural',
    },
    {
      icon: Languages,
      title: 'Translate',
      description: 'Multi-language translation with context',
    },
    {
      icon: Search,
      title: 'Extract',
      description: 'Pull key information from documents',
    },
    {
      icon: Lightbulb,
      title: 'Analyze',
      description: 'Get insights and recommendations',
    },
  ];

  const pricingPreview = [
    { tier: 'Free', operations: '3 per day' },
    { tier: 'Pro', operations: '100 per month' },
    { tier: 'Business', operations: '1000 per month' },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-background-secondary to-white">
        <div className="container-custom py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="warning" size="medium" className="mb-6">
              Coming Soon - Q2 2025
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-text-primary mb-6">
              Supercharge your documents with <span className="gradient-text">AI</span>
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed mb-8">
              Transform your content with cutting-edge AI. Summarize, humanize, translate, and
              extract insights in seconds.
            </p>
          </div>
        </div>
      </div>

      {/* AI Features */}
      <div className="container-custom py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary text-center mb-12">
          AI-Powered Features
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} hover animated delay={index * 0.1}>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-text-secondary">{feature.description}</p>
              </Card>
            );
          })}
        </div>

        {/* AI Demo Illustration */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl shadow-2xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Sparkles className="w-24 h-24 text-purple-500 mx-auto mb-4 animate-pulse" />
                <p className="text-xl font-bold text-purple-900">AI Tools in Action</p>
                <p className="text-purple-700">Powered by cutting-edge AI models</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Teaser */}
        <div className="max-w-3xl mx-auto mb-16">
          <h3 className="text-2xl font-bold text-text-primary text-center mb-8">
            Pricing Preview
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {pricingPreview.map((plan) => (
              <Card key={plan.tier}>
                <h4 className="text-xl font-bold text-text-primary mb-2">{plan.tier}</h4>
                <p className="text-3xl font-black text-accent-primary">{plan.operations}</p>
                <p className="text-sm text-text-secondary mt-1">AI operations</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Waitlist Form */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Get early access
          </h2>
          <p className="text-lg text-text-secondary mb-8">
            Join the waitlist for exclusive early access and special launch pricing
          </p>
          <WaitlistForm />
        </div>

        {/* Alternative CTA */}
        <div className="bg-background-secondary rounded-2xl p-12 text-center">
          <h3 className="text-2xl font-bold text-text-primary mb-4">
            Try our live features
          </h3>
          <p className="text-text-secondary mb-6">
            While you wait, check out our Preview and Convert tools
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/preview" variant="secondary" size="large">
              Try Preview
            </Button>
            <Button href="/convert" variant="secondary" size="large">
              Try Convert
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIToolsPage;
