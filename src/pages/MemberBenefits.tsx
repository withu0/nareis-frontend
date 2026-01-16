import Navigation from '@/components/narei/Navigation';
import Footer from '@/components/narei/Footer';
import BenefitHero from '@/components/narei/benefits/BenefitHero';
import CertificationSection from '@/components/narei/benefits/CertificationSection';
import VisibilitySection from '@/components/narei/benefits/VisibilitySection';
import TrainingSection from '@/components/narei/benefits/TrainingSection';
import BestPracticesSection from '@/components/narei/benefits/BestPracticesSection';
import AdvocacyBenefitsSection from '@/components/narei/benefits/AdvocacyBenefitsSection';
import ResourcesBenefitsSection from '@/components/narei/benefits/ResourcesBenefitsSection';
import FinalCTA from '@/components/narei/benefits/FinalCTA';
import { BackButton } from '@/components/ui/back-button';


const MemberBenefits = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="container mx-auto px-4 pt-24">
        <BackButton />
      </div>

      <BenefitHero />
      <CertificationSection />
      <VisibilitySection />
      <TrainingSection />
      <BestPracticesSection />
      <AdvocacyBenefitsSection />
      <ResourcesBenefitsSection />
      <FinalCTA />

      <Footer />
    </div>
  );
};

export default MemberBenefits;
