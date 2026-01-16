import { FileText, MapPin, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdvocacyBenefitsSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-navy-900 mb-4">Public Policy & Advocacy</h2>
              <p className="text-xl text-gray-700">
                <strong>Moving Real Estate Forward</strong><br />
                Together NAREIS.org is the leading voice for real estate investors at the federal level. As the only association in the field with a Political Action Committee (PAC), we have direct access to lawmakers and advocate for policies that directly impact investors.
              </p>
            </div>
            <div>
              <img 
                src="https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1760607810400_77bf403d.webp" 
                alt="Capitol advocacy"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg">
              <FileText className="w-12 h-12 text-gold-500 mb-4" />
              <h3 className="text-2xl font-bold text-navy-900 mb-3">Public Policy Statement</h3>
              <p className="text-gray-600 mb-4">
                NAREIS.org's policy advocacy is grounded in our mission. Our Policy Statement outlines positions on key issues affecting real estate investors.
              </p>
              <Button variant="link" className="text-gold-600 p-0">Learn More →</Button>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <MapPin className="w-12 h-12 text-gold-500 mb-4" />
              <h3 className="text-2xl font-bold text-navy-900 mb-3">State Advocacy Toolkit</h3>
              <p className="text-gray-600 mb-4">
                The State Advocacy Toolkit guides members in effectively advocating for real estate investors at state and local levels.
              </p>
              <Button variant="link" className="text-gold-600 p-0">Learn More →</Button>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <DollarSign className="w-12 h-12 text-gold-500 mb-4" />
              <h3 className="text-2xl font-bold text-navy-900 mb-3">Political Action Committee</h3>
              <p className="text-gray-600 mb-4">
                The NAREIS.org PAC advances our advocacy by supporting members of Congress who prioritize real estate investment policies.
              </p>
              <Button variant="link" className="text-gold-600 p-0">Learn More →</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvocacyBenefitsSection;
