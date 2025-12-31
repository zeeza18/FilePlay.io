import HeroSection from '../components/sections/HeroSection';
import FeaturesOverviewSection from '../components/sections/FeaturesOverviewSection';
import HowItWorksSection from '../components/sections/HowItWorksSection';
import SupportedFormatsSection from '../components/sections/SupportedFormatsSection';
import UseCasesSection from '../components/sections/UseCasesSection';
import PricingPreviewSection from '../components/sections/PricingPreviewSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import FAQSection from '../components/sections/FAQSection';
import FinalCTASection from '../components/sections/FinalCTASection';

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <FeaturesOverviewSection />
      <HowItWorksSection />
      <SupportedFormatsSection />
      <UseCasesSection />
      <PricingPreviewSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTASection />
    </>
  );
};

export default HomePage;
