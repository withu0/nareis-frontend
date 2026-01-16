import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';

interface MembershipTierStepProps {
  data: any;
  onChange: (field: string, value: string) => void;
}

const tiers = [
  {
    id: 'foundation',
    name: 'Foundation Member',
    price: '$495/year',
    features: ['Establish credibility', 'Access national network', 'Appear in directory', 'Join virtual masterminds']
  },
  {
    id: 'growth',
    name: 'Growth Member',
    price: '$995/year',
    features: ['Everything in Foundation Member', 'Enhanced directory profile', 'Participation in advocacy', 'Voting rights', 'Working group eligibility']
  },

  {
    id: 'stakeholder',
    name: 'Service Partner Member',
    price: '$1,495/year',
    features: ['Official NAREIS.ORG Service Partner Badge', 'National directory listing', 'Access to investor mastermind sessions', 'Inclusion in advocacy updates', 'Permission to use NAREIS.ORG brand', 'Participation in networking events']

  },
  {
    id: 'professional',
    name: 'Professional Member',
    price: '$1,995/year',
    features: ['Everything in Growth Member', 'Leadership opportunities', 'Multi-user access (3 users)', 'Advanced mastermind sessions', 'Speaking opportunities']
  },
  {
    id: 'enterprise',
    name: 'Enterprise Member',
    price: '$3,995/year',
    features: ['Everything in Professional Member', 'Team access (5 users)', 'Featured listing', 'Sponsorships', 'Advocacy representation', 'Enterprise mastermind access']
  },
  {
    id: 'founding',
    name: 'Founding Lifetime Member',
    price: '$5,995/one-time',
    features: ['Everything in Enterprise Member', 'Lifetime access to all benefits', 'Founding Class recognition', 'Permanent priority listing', 'Founders Mastermind inclusion', 'Seat on the start-up board']
  }
]



export default function MembershipTierStep({ data, onChange }: MembershipTierStepProps) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold">Choose Your Membership Tier</h3>
        <p className="text-gray-600 mt-2">Select the plan that best fits your needs</p>
      </div>
      <div className="grid gap-4">
        {tiers.map((tier) => (
          <Card
            key={tier.id}
            className={`p-4 cursor-pointer transition-all ${
              data.membershipTier === tier.id
                ? 'border-blue-600 border-2 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => onChange('membershipTier', tier.id)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-lg">{tier.name}</h4>
                  {tier.popular && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">Popular</span>
                  )}
                </div>
                <p className="text-2xl font-bold text-blue-600 mt-1">{tier.price}</p>
                <ul className="mt-3 space-y-2">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700">
                      <Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              {data.membershipTier === tier.id && (
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
