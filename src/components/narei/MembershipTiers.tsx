import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';


const tiers = [
  {
    name: 'Foundation Member',
    id: 'foundation',
    price: '$495',
    amount: 495,
    period: '/year',
    badge: 'EARLY-STAGE',
    description: 'For anyone with 5 or less deals monthly',
    idealFor: 'Early-stage investors, small landlords, or emerging contractors',
    features: ['Establish credibility', 'Access national network', 'Appear in directory', 'Join virtual masterminds'],
    popular: false
  },
  {
    name: 'Growth Member',
    id: 'growth',
    price: '$995',
    amount: 995,
    period: '/year',
    badge: 'GROWING',
    description: 'For anyone with 6-10 deals annually',
    idealFor: 'Active investors and small firms building consistent deal flow',
    features: ['Everything in Foundation Member', 'Enhanced directory profile', 'Participation in advocacy', 'Voting rights', 'Working group eligibility'],
    popular: false
  },

  {
    name: 'Professional Member',
    id: 'professional',
    price: '$1,995',
    amount: 1995,
    period: '/year',
    badge: 'ESTABLISHED',
    description: 'For anyone with 11-20 deals monthly',
    idealFor: 'Established investors or mid-sized operators',
    features: ['Everything in Growth Member', 'Leadership opportunities', 'Multi-user access (3 users)', 'Advanced mastermind sessions', 'Speaking opportunities'],
    popular: false
  },
  {
    name: 'Enterprise Member',
    id: 'enterprise',
    price: '$3,995',
    amount: 3995,
    period: '/year',
    badge: 'ENTERPRISE',
    description: 'For anyone with 20+ deals monthly',
    idealFor: 'High-volume firms, funds, or multi-state organizations',
    features: ['Everything in Professional Member', 'Team access (5 users)', 'Featured listing', 'Sponsorships', 'Advocacy representation', 'Enterprise mastermind access'],
    popular: false
  },
  {
    name: 'Founding Lifetime Member',
    id: 'founding',
    price: '$5,995',
    amount: 5995,
    period: '/one-time',
    badge: 'FOUNDING CLASS',
    description: 'For industry pioneers who will have a seat at the table',
    idealFor: 'Leaders who actively shape the NAREIS.ORG national standard',
    features: ['Everything in Enterprise Member', 'Lifetime access to all benefits', 'Founding Class recognition', 'Permanent priority listing', 'Founders Mastermind inclusion', 'Seat on the start-up board'],
    popular: false
  },
  {
    name: 'Service Partner Member',
    id: 'stakeholder',
    price: '$1,495',
    amount: 1495,
    period: '/year',
    badge: 'PARTNER',
    description: 'For service providers and partners in the real estate investment ecosystem',
    idealFor: 'Lead gen companies, data providers, coaches, title/escrow, lenders, contractors, marketing partners',
    features: ['Official NAREIS.ORG Service Partner Badge', 'National directory listing', 'Access to investor mastermind sessions', 'Inclusion in advocacy updates', 'Permission to use NAREIS.ORG brand', 'Participation in networking and collaboration events'],

    popular: false
  }
]









const MembershipTiers: React.FC = () => {
  const navigate = useNavigate();
  
  const handleJoin = (tierId: string, tierName: string, amount: number, period: string) => {
    navigate('/signup', { state: { tierId, tierName, amount, period } });
  };


  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">



      {tiers.map((tier) => (
        <div
          key={tier.name}
          className={`bg-white rounded-lg shadow-lg p-8 ${tier.popular ? 'ring-4 ring-red-600 transform scale-105' : ''}`}
        >
          <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">{tier.badge}</span>

          <h3 className="text-2xl font-bold text-gray-900 mt-4">{tier.name}</h3>
          
          {'description' in tier && (
            <p className="text-sm text-gray-600 mt-2">{tier.description}</p>
          )}
          
          {'idealFor' in tier && (
            <p className="text-xs text-blue-700 font-medium mt-1">Ideal for: {tier.idealFor}</p>
          )}
          
          <div className="mt-4 mb-6">
            <span className="text-4xl font-bold text-blue-900">{tier.price}</span>
            <span className="text-gray-600">{tier.period}</span>
          </div>
          <ul className="space-y-3 mb-8">
            {tier.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => handleJoin(tier.id, tier.name, tier.amount, tier.period)}

            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
              tier.popular
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-blue-900 text-white hover:bg-blue-800'
            }`}
          >
            Join Now
          </button>
        </div>
      ))}
    </div>
  );
};

export default MembershipTiers;
