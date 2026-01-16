import React from 'react';
import { Shield, TrendingUp, Users, Scale } from 'lucide-react';

const WhyIndustryNeedsSection: React.FC = () => {
  const reasons = [
    {
      icon: Shield,
      title: 'Legitimacy & Credibility',
      description: 'Investors need a recognized standard that separates professionals from amateurs in an industry often misunderstood by the public and policymakers.'
    },
    {
      icon: Scale,
      title: 'Unified Advocacy Voice',
      description: 'Without a national association, investors face fragmented representation. NAREIS ensures our industry speaks with one powerful, coordinated voice.'
    },
    {
      icon: TrendingUp,
      title: 'Professional Development',
      description: 'The industry lacks standardized education and certification. NAREIS provides the framework for continuous growth and recognized expertise.'
    },
    {
      icon: Users,
      title: 'Strategic Collaboration',
      description: 'Isolated investors miss opportunities. NAREIS creates the mastermind environment where deals happen and relationships multiply results.'
    }
  ];

  return (
    <section className="mb-12 bg-blue-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Why the Industry Needs NAREIS.org</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {reasons.map((reason) => (
          <div key={reason.title} className="bg-white p-6 rounded-lg shadow-sm">
            <reason.icon className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">{reason.title}</h3>
            <p className="text-gray-700">{reason.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyIndustryNeedsSection;
