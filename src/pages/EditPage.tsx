import { FileText, Edit3, Table, Users, CheckCircle } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import WaitlistForm from '../components/ui/WaitlistForm';

const EditPage = () => {
  const features = [
    {
      icon: FileText,
      title: 'Word Editor',
      description: 'Full rich text editing with formatting tools',
    },
    {
      icon: Edit3,
      title: 'PDF Annotation',
      description: 'Add comments, highlights, and signatures',
    },
    {
      icon: Table,
      title: 'Spreadsheet Editor',
      description: 'Edit cells, formulas, and formatting',
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Real-time editing with your team',
    },
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
              Edit files like a pro, right in your browser
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed mb-8">
              Professional editing tools for Word documents, PDFs, and spreadsheets. No software
              installation required.
            </p>
          </div>
        </div>
      </div>

      {/* Features Preview */}
      <div className="container-custom py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary text-center mb-12">
          What's coming
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} hover animated delay={index * 0.1}>
                <div className="w-16 h-16 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-2xl flex items-center justify-center mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-text-secondary">{feature.description}</p>
              </Card>
            );
          })}
        </div>

        {/* Mockup Preview */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="aspect-video bg-gradient-to-br from-ui-border to-background-secondary rounded-2xl shadow-2xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 backdrop-blur-sm bg-white/50 flex items-center justify-center">
              <div className="text-center">
                <Edit3 className="w-24 h-24 text-text-muted mx-auto mb-4" />
                <p className="text-xl font-bold text-text-primary">Editor Interface Preview</p>
                <p className="text-text-secondary">Coming Soon</p>
              </div>
            </div>
          </div>
        </div>

        {/* Waitlist Form */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Be the first to know
          </h2>
          <p className="text-lg text-text-secondary mb-8">
            Join our waitlist and get early access when we launch
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

export default EditPage;
