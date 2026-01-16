import Navigation from '@/components/narei/Navigation';
import Footer from '@/components/narei/Footer';

import VisionSection from '@/components/narei/about/VisionSection';
import CorePurposeSection from '@/components/narei/about/CorePurposeSection';
import CoreValuesSection from '@/components/narei/about/CoreValuesSection';
import CodeOfEthicsSection from '@/components/narei/about/CodeOfEthicsSection';
import WhyJoinSection from '@/components/narei/about/WhyJoinSection';
import WhyIndustryNeedsSection from '@/components/narei/about/WhyIndustryNeedsSection';
import FoundingMemberSection from '@/components/narei/about/FoundingMemberSection';
import { BackButton } from '@/components/ui/back-button';
import { Building2, Award } from 'lucide-react';


export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <BackButton />


        <div className="flex items-center gap-3 mb-4">
          <Building2 className="w-8 h-8 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900">About NAREIS</h1>
        </div>

        {/* The National Standard tagline */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <p className="text-3xl font-bold text-blue-600 mb-3">
            The National Standard and Mastermind For All

          </p>
          <p className="text-xl text-gray-700">
            Where Professional Credibility Meets Strategic Collaboration
          </p>
        </div>

        {/* Who We Are */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Who We Are</h2>
          <p className="text-gray-800 mb-4">
            The National Association of Real Estate Investors & Service Partners (NAREIS.org) stands as the recognized authority for professional competency, ethical practice, and verified expertise across the investing world. It serves as the credentialing body that sets expectations, validates knowledge, and guides how the industry evolves.

          </p>
          <p className="text-gray-800 mb-4">
            Alongside its work as the national standard-setter, NAREIS.org operates as a year-round mastermind for every investor and service provider, not matter what stage you are in your business, aiming to refine skills, strengthen knowledge, and build meaningful connections. Members learn from one another, share solutions, and accelerate progress through structured collaboration.
          </p>
          <p className="text-gray-800 mb-4">
            NAREIS.org brings wholesalers, flippers, landlords, lenders, contractors, title partners, and innovators into a single ecosystem built to open doors, protect investment liberty, and strengthen neighborhoods through responsible ownership and entrepreneurship. Membership establishes a recognized professional identity that communicates readiness, reliability, and competence in any market.
          </p>
          <p className="text-gray-800 mb-4">
            Inside NAREIS.org, education leads directly to real-world action. Members participate in peer groups, market briefings, and strategic forums that help them advance deals, improve systems, and influence the policies shaping their futures. Whether someone manages projects, finances acquisitions, oversees portfolios, or provides essential services, NAREIS.org places them within a national platform where their insights guide local, state, and federal decision-makers.
          </p>
          <p className="text-gray-800">
            Through this united association, the industry gains both higher standards and a stronger voice—ensuring that real estate investment remains a dependable pathway to growth, stability, and opportunity.
          </p>
        </section>




        {/* Our Mission */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-800 mb-4">
            To unite and empower real estate investors and service partners to build wealth, protect their rights, and strengthen the communities they serve.
          </p>
          <p className="text-gray-800 mb-4">
            We exist so members can turn ambition into achievement — equipping every member with the intelligence, advocacy, and access once reserved for the top tier of the industry.
          </p>
          <p className="text-gray-800">
            At NAREIS.org, education meets execution, and freedom meets protection. We don't just represent investors — we champion them, ensuring every law, regulation, and opportunity moves our members and our industry forward.
          </p>
        </section>



        <VisionSection />
        <WhyIndustryNeedsSection />
        <CorePurposeSection />
        <CoreValuesSection />
        <CodeOfEthicsSection />
        <WhyJoinSection />
        <FoundingMemberSection />


      </div>

      <Footer />
    </div>
  );
}
