import { Star } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import Card from '../ui/Card';

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote:
        'FilePlay has completely replaced 5 different tools I was using. The interface is clean, fast, and just works.',
      author: 'Sarah Johnson',
      role: 'Freelance Designer',
      avatar: 'SJ',
      rating: 5,
    },
    {
      quote:
        'As a medical professional, the OCR for TIFF files is a game-changer. Processing lab reports is now 10x faster.',
      author: 'Dr. Michael Chen',
      role: 'Medical Lab Director',
      avatar: 'MC',
      rating: 5,
    },
    {
      quote:
        'The free tier is incredibly generous. I upgraded to Pro just to support the team - best $10/month I spend.',
      author: 'Emily Rodriguez',
      role: 'Content Creator',
      avatar: 'ER',
      rating: 5,
    },
  ];

  return (
    <section className="bg-white">
      <div className="container-custom section-padding">
        <SectionHeader
          badge="Testimonials"
          title="Loved by thousands of users"
          description="See what people are saying about FilePlay"
        />

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={testimonial.author} hover animated delay={index * 0.1}>
              {/* Rating Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-text-primary mb-6 leading-relaxed italic">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-full flex items-center justify-center text-white font-bold">
                  {testimonial.avatar}
                </div>

                {/* Info */}
                <div>
                  <div className="font-bold text-text-primary">{testimonial.author}</div>
                  <div className="text-sm text-text-secondary">{testimonial.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
