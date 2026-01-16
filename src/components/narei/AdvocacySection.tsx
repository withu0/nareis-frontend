import React from 'react';
import { Scale, TrendingUp, Shield, AlertCircle } from 'lucide-react';

const AdvocacySection: React.FC = () => {
  const initiatives = [
    { icon: Scale, title: 'Property Rights Protection', description: 'Defending investor rights at federal and state levels' },
    { icon: TrendingUp, title: 'Tax Policy Reform', description: 'Advocating for favorable capital gains and 1031 exchange rules' },
    { icon: Shield, title: 'Regulatory Compliance', description: 'Simplifying zoning and permitting processes' },
    { icon: AlertCircle, title: 'Housing Policy', description: 'Promoting balanced rental housing regulations' }
  ];

  const handleTakeAction = () => {
    alert('Opening advocacy toolkit');
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Advocacy & Policy</h2>
          <p className="text-xl text-gray-600">Your voice in legislative and regulatory matters</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {initiatives.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow-md text-center">
              <item.icon className="w-12 h-12 mx-auto mb-4 text-blue-900" />
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-blue-900 text-white rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Make Your Voice Heard</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Join our advocacy efforts to protect and advance real estate investment opportunities
          </p>
          <button
            onClick={handleTakeAction}
            className="bg-amber-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors"
          >
            Take Action Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default AdvocacySection;
