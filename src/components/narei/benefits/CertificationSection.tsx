import React from 'react';
import { Award, CheckCircle, TrendingUp, Shield } from 'lucide-react';

const CertificationSection: React.FC = () => {
  const benefits = [
    { icon: Award, text: 'Nationally Recognized Certification' },
    { icon: Shield, text: 'Verified Professional Badge' },
    { icon: TrendingUp, text: 'Enhanced Market Credibility' },
    { icon: CheckCircle, text: 'Continuing Education Credits' }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-900 to-blue-800 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Award className="w-16 h-16 mx-auto mb-4 text-amber-400" />
            <h2 className="text-4xl font-bold mb-4">NAREIS Certification Program</h2>
            <p className="text-xl text-blue-100">
              Elevate your professional standing with industry-recognized credentials
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {benefits.map((benefit) => (
              <div key={benefit.text} className="flex items-start gap-4 bg-white/10 p-6 rounded-lg">
                <benefit.icon className="w-8 h-8 text-amber-400 flex-shrink-0" />
                <span className="text-lg">{benefit.text}</span>
              </div>
            ))}
          </div>

          <div className="bg-white/10 p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">What You'll Learn</h3>
            <ul className="space-y-3 text-blue-100">
              <li>• Advanced investment strategies and market analysis</li>
              <li>• Legal compliance and regulatory frameworks</li>
              <li>• Professional ethics and industry standards</li>
              <li>• Deal structuring and financing techniques</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificationSection;
