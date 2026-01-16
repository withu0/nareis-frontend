import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface InterestsStepProps {
  data: any;
  onChange: (field: string, value: any) => void;
}

const propertyTypes = [
  'Residential', 'Commercial', 'Industrial', 'Retail', 'Multifamily', 
  'Office', 'Land Development', 'Mixed-Use', 'Hospitality', 'Healthcare'
];

const strategies = [
  'Buy and Hold', 'Fix and Flip', 'Wholesaling', 'BRRRR', 
  'Syndication', 'REITs', 'Crowdfunding', 'Development', 'Property Management'
];

export default function InterestsStep({ data, onChange }: InterestsStepProps) {
  const toggleProperty = (type: string) => {
    const current = data.propertyTypes || [];
    const updated = current.includes(type)
      ? current.filter((t: string) => t !== type)
      : [...current, type];
    onChange('propertyTypes', updated);
  };

  const toggleStrategy = (strategy: string) => {
    const current = data.strategies || [];
    const updated = current.includes(strategy)
      ? current.filter((s: string) => s !== strategy)
      : [...current, strategy];
    onChange('strategies', updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold mb-3 block">Property Types of Interest</Label>
        <div className="grid grid-cols-2 gap-3">
          {propertyTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={type}
                checked={(data.propertyTypes || []).includes(type)}
                onCheckedChange={() => toggleProperty(type)}
              />
              <label htmlFor={type} className="text-sm cursor-pointer">{type}</label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Label className="text-base font-semibold mb-3 block">Investment Strategies</Label>
        <div className="grid grid-cols-2 gap-3">
          {strategies.map((strategy) => (
            <div key={strategy} className="flex items-center space-x-2">
              <Checkbox
                id={strategy}
                checked={(data.strategies || []).includes(strategy)}
                onCheckedChange={() => toggleStrategy(strategy)}
              />
              <label htmlFor={strategy} className="text-sm cursor-pointer">{strategy}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
