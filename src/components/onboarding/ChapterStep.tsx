import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';

interface ChapterStepProps {
  data: any;
  onChange: (field: string, value: string) => void;
}

const states = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

export default function ChapterStep({ data, onChange }: ChapterStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <MapPin className="w-12 h-12 mx-auto text-blue-600 mb-3" />
        <h3 className="text-xl font-semibold">Find Your Local Chapter</h3>
        <p className="text-gray-600 mt-2">Connect with real estate investors in your area</p>
      </div>
      <div>
        <Label htmlFor="state">Primary State</Label>
        <Select value={data.state || ''} onValueChange={(val) => onChange('state', val)}>
          <SelectTrigger>
            <SelectValue placeholder="Select your state" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {states.map((state) => (
              <SelectItem key={state} value={state}>{state}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="city">City</Label>
        <input
          type="text"
          id="city"
          value={data.city || ''}
          onChange={(e) => onChange('city', e.target.value)}
          placeholder="Enter your city"
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>Why join a local chapter?</strong> Network with investors, attend local events, 
          share market insights, and build partnerships in your area.
        </p>
      </div>
    </div>
  );
}
