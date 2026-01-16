import { Building2, Award, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VisibilitySection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-navy-900 mb-4">Legitimacy & Leader Status</h2>
          <p className="text-xl text-gray-700 mb-12">
            <strong>Verified. Recognized. Respected.</strong><br />
            NAREIS membership signals to the market that you meet national professional standards. Display the NAREIS Member Seal, gain directory visibility, and position yourself as a verified industry leader—not just another investor.
          </p>

          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <Building2 className="w-12 h-12 text-gold-500 mb-4" />
              <h3 className="text-2xl font-bold text-navy-900 mb-3">Membership Directory</h3>
              <p className="text-gray-600 mb-4">
                The NAREIS.org Investor Directory is our trusted, high-traffic listing that promotes leading real estate investors and drives visibility, connections, and credibility.
              </p>
              <Button variant="link" className="text-gold-600 p-0">Learn More →</Button>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <Award className="w-12 h-12 text-gold-500 mb-4" />
              <h3 className="text-2xl font-bold text-navy-900 mb-3">NAREIS.org Member Seal</h3>
              <p className="text-gray-600 mb-4">
                The NAREIS.org Member Seal showcases your commitment to ethical, professional investing and builds trust with partners, lenders, and peers.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <Users className="w-12 h-12 text-gold-500 mb-4" />
              <h3 className="text-2xl font-bold text-navy-900 mb-3">Affiliate Member Directory</h3>
              <p className="text-gray-600 mb-4">
                The NAREIS.org Affiliate Directory connects investors with trusted vendors offering services that support successful real estate investing.
              </p>
              <Button variant="link" className="text-gold-600 p-0">Learn More →</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisibilitySection;
