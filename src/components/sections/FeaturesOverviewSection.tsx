import { Eye, RefreshCw, Edit3, Sparkles, BarChart3, CheckCircle } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const FeaturesOverviewSection = () => {
  const features = [
    {
      id: 'preview',
      icon: Eye,
      iconBackground: '#EEF2FF',
      iconColor: '#4F46E5',
      title: 'Preview',
      description:
        'View any file instantly in your browser. PDFs, images, Word documents, Excel spreadsheets - all supported with zero downloads.',
      features: [
        'Support for 10+ file formats',
        'Zoom and navigation controls',
        'Multi-page document support',
        'Fast loading, even for large files',
      ],
      status: 'Live',
      statusColor: '#10B981',
      cta: { text: 'Try Preview', link: '/preview' },
    },
    {
      id: 'convert',
      icon: RefreshCw,
      iconBackground: '#DBEAFE',
      iconColor: '#3B82F6',
      title: 'Convert',
      description:
        'Transform files between formats effortlessly. Images, PDFs, documents - we handle conversions with precision and speed.',
      features: [
        '50+ conversion combinations',
        'Batch processing support',
        'Quality settings control',
        'OCR for scanned documents',
      ],
      status: 'Live',
      statusColor: '#10B981',
      cta: { text: 'Let’s Start', link: '/#convert' },
    },
    {
      id: 'edit',
      icon: Edit3,
      iconBackground: '#FEF3C7',
      iconColor: '#F59E0B',
      title: 'Edit',
      description:
        'Modify documents online without software. Professional editing tools right in your browser - no installation needed.',
      features: [
        'Rich text editing for Word docs',
        'PDF form filling and annotation',
        'Spreadsheet cell editing',
        'Real-time collaboration (coming)',
      ],
      status: 'Coming Soon',
      statusColor: '#F59E0B',
      launchDate: 'Q2 2025',
      cta: { text: 'Join Waitlist', link: '/edit' },
    },
    {
      id: 'ai_tools',
      icon: Sparkles,
      iconBackground: '#FCE7F3',
      iconColor: '#EC4899',
      title: 'AI Tools',
      description:
        'Harness AI to transform your documents. Summarize, humanize text, translate, and extract insights with cutting-edge AI.',
      features: [
        'Smart document summarization',
        'AI text humanization',
        'Multi-language translation',
        'Content extraction and analysis',
      ],
      status: 'Coming Soon',
      statusColor: '#F59E0B',
      launchDate: 'Q2 2025',
      cta: { text: 'Join Waitlist', link: '/ai-tools' },
    },
    {
      id: 'analysis',
      icon: BarChart3,
      iconBackground: '#D1FAE5',
      iconColor: '#10B981',
      title: 'Analysis',
      description:
        'Deep insights on your files. Word counts, readability scores, data visualization, and comprehensive document analytics.',
      features: [
        'Word, character, token counts',
        'Readability and SEO metrics',
        'Auto-generated charts from data',
        'Export analytics reports',
      ],
      status: 'Coming Soon',
      statusColor: '#F59E0B',
      launchDate: 'Q3 2025',
      cta: { text: 'Join Waitlist', link: '/analysis' },
    },
  ];

  return (
    <section className="bg-background-secondary">
      <div className="container-custom section-padding">
        <SectionHeader
          badge="Features"
          title="Everything you need, all in one place"
          description="Five powerful modules designed to make working with files effortless and fun."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const cardContent = (
              <Card key={feature.id} hover animated delay={index * 0.1}>
                {/* Icon */}
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: feature.iconBackground }}
                >
                  <Icon className="w-8 h-8" style={{ color: feature.iconColor }} />
                </div>

                {/* Title and Status */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-text-primary">{feature.title}</h3>
                  <Badge
                    variant={feature.status === 'Live' ? 'success' : 'warning'}
                    size="small"
                  >
                    {feature.status}
                  </Badge>
                </div>

                {/* Description */}
                <p className="text-text-secondary mb-6 leading-relaxed">{feature.description}</p>

                {/* Features List */}
                <ul className="space-y-3 mb-6">
                  {feature.features.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                      <CheckCircle className="w-5 h-5 text-accent-success flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Launch Date */}
                {feature.launchDate && (
                  <p className="text-sm text-text-muted mb-4">
                    Expected launch: {feature.launchDate}
                  </p>
                )}

                {/* CTA */}
                <Button
                  href={feature.cta.link}
                  variant={feature.status === 'Live' ? 'primary' : 'secondary'}
                  size="medium"
                  className="w-full"
                >
                  {feature.cta.text}
                </Button>
              </Card>
            );

            return (
              feature.id === 'convert' ? (
                <div key={feature.id} id="convert">
                  {cardContent}
                </div>
              ) : (
                cardContent
              )
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesOverviewSection;
