import { Shield, BookOpen, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BestPracticesSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <img 
                src="https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1760607809669_4ce301d5.webp" 
                alt="Investment analysis"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-navy-900 mb-4">Best Practices</h2>
              <p className="text-xl text-gray-700">
                <strong>Elevating Ethics & Excellence</strong><br />
                NAREIS.org equips investors with resources to strengthen operations, investment strategies, and professional standards. Members gain access to our Code of Ethics, Investment Guidelines, and strategies that enhance ethical practices and improve portfolio performance.
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <Shield className="w-12 h-12 text-gold-500 mb-4" />
              <h3 className="text-2xl font-bold text-navy-900 mb-3">Ethics</h3>
              <p className="text-gray-600 mb-4">
                The NAREIS.org Code of Ethics guides member conduct in investments, property management, tenant relations, and business practices. All members must follow it.
              </p>
              <Button variant="link" className="text-gold-600 p-0">Learn More →</Button>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <BookOpen className="w-12 h-12 text-gold-500 mb-4" />
              <h3 className="text-2xl font-bold text-navy-900 mb-3">Investment Guidelines</h3>
              <p className="text-gray-600 mb-4">
                The NAREIS.org Investment Guidebook promotes best practices to improve deal analysis, risk management, and portfolio diversification strategies.
              </p>
              <Button variant="link" className="text-gold-600 p-0">Learn More →</Button>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <Briefcase className="w-12 h-12 text-gold-500 mb-4" />
              <h3 className="text-2xl font-bold text-navy-900 mb-3">Property Management</h3>
              <p className="text-gray-600 mb-4">
                Our property management resources focus on tenant retention, maintenance best practices, and maximizing property value and cash flow.
              </p>
              <Button variant="link" className="text-gold-600 p-0">Learn More →</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestPracticesSection;
