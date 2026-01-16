import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface Partner {
  name: string;
  description: string;
  benefit: string;
  logo: string;
}

const IndustryPartners: React.FC = () => {
  const partners: Partner[] = [
    {
      name: 'Home Depot Pro',
      description: 'Professional contractor supplies and tools',
      benefit: '10% discount on purchases',
      logo: '🏠'
    },
    {
      name: 'RentPerfect',
      description: 'Tenant screening and property management',
      benefit: 'Discounted screening services',
      logo: '✓'
    },
    {
      name: 'MSI Insurance',
      description: 'Property and liability insurance',
      benefit: 'Preferred member rates',
      logo: '🛡️'
    },
    {
      name: 'CamaPlan',
      description: 'Self-directed IRA services',
      benefit: 'Reduced setup fees',
      logo: '💼'
    },
    {
      name: 'REIAsure',
      description: 'Specialized real estate investor insurance',
      benefit: 'Member-exclusive coverage',
      logo: '🏢'
    },
    {
      name: 'LegalZoom',
      description: 'Legal services for real estate',
      benefit: '15% off legal documents',
      logo: '⚖️'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Industry Partners</h2>
          <p className="text-xl text-gray-600">Exclusive benefits and discounts for NAREIS.org members</p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {partners.map((partner, idx) => (
            <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">{partner.logo}</div>
              <h3 className="text-xl font-bold mb-2">{partner.name}</h3>
              <p className="text-gray-600 mb-2">{partner.description}</p>
              <p className="text-blue-900 font-semibold mb-4">{partner.benefit}</p>
              <Button variant="outline" className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                Learn More
              </Button>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-blue-900 hover:bg-blue-800">
            View All Partner Benefits
          </Button>
        </div>
      </div>
    </section>
  );
};

export default IndustryPartners;
