import { Hash, Clock, TrendingUp, BarChart, Search, Globe, PieChart } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import WaitlistForm from '../components/ui/WaitlistForm';

const AnalysisPage = () => {
  const features = [
    {
      icon: Hash,
      title: 'Word & Character Counts',
      description: 'Detailed text statistics',
    },
    {
      icon: Clock,
      title: 'Reading Time',
      description: 'Estimated reading duration',
    },
    {
      icon: TrendingUp,
      title: 'Readability Scores',
      description: 'Flesch-Kincaid and more',
    },
    {
      icon: BarChart,
      title: 'Data Visualization',
      description: 'Auto-generate charts from spreadsheets',
    },
    {
      icon: Search,
      title: 'Keyword Analysis',
      description: 'SEO metrics and keyword density',
    },
    {
      icon: Globe,
      title: 'Language Detection',
      description: 'Identify document language',
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-background-secondary to-white">
        <div className="container-custom py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="warning" size="medium" className="mb-6">
              Coming Soon - Q3 2025
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-text-primary mb-6">
              Know everything about your files
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed mb-8">
              Comprehensive analytics for documents, spreadsheets, and images. From word counts to
              data visualization.
            </p>
          </div>
        </div>
      </div>

      {/* Analysis Features */}
      <div className="container-custom py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary text-center mb-12">
          Analysis Features
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} hover animated delay={index * 0.1}>
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-text-secondary">{feature.description}</p>
              </Card>
            );
          })}
        </div>

        {/* Demo Dashboard */}
        <div className="max-w-5xl mx-auto mb-16">
          <h3 className="text-2xl font-bold text-text-primary text-center mb-8">
            Preview of what's coming
          </h3>

          <div className="bg-gradient-to-br from-background-secondary to-white rounded-2xl shadow-2xl p-8">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Sample Stats */}
              <Card>
                <div className="text-center">
                  <Hash className="w-12 h-12 text-accent-primary mx-auto mb-2" />
                  <div className="text-4xl font-black text-text-primary">2,547</div>
                  <div className="text-sm text-text-secondary">Words</div>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <Clock className="w-12 h-12 text-accent-secondary mx-auto mb-2" />
                  <div className="text-4xl font-black text-text-primary">12 min</div>
                  <div className="text-sm text-text-secondary">Reading Time</div>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-accent-success mx-auto mb-2" />
                  <div className="text-4xl font-black text-text-primary">78.5</div>
                  <div className="text-sm text-text-secondary">Readability Score</div>
                </div>
              </Card>
            </div>

            {/* Sample Chart Area */}
            <div className="aspect-video bg-white rounded-xl shadow-inner flex items-center justify-center">
              <div className="text-center">
                <PieChart className="w-24 h-24 text-text-muted mx-auto mb-4" />
                <p className="text-xl font-bold text-text-primary">Interactive Charts</p>
                <p className="text-text-secondary">Data visualization preview</p>
              </div>
            </div>
          </div>
        </div>

        {/* Waitlist Form */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Join the early access program
          </h2>
          <p className="text-lg text-text-secondary mb-8">
            Be among the first to experience powerful document analytics
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

export default AnalysisPage;
