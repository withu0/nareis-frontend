import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface ProfileStepProps {
  data: any;
  onChange: (field: string, value: string) => void;
}

export default function ProfileStep({ data, onChange }: ProfileStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="company">Company Name *</Label>
        <Input
          id="company"
          value={data.company || ''}
          onChange={(e) => onChange('company', e.target.value)}
          placeholder="Your company or organization"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={data.phone || ''}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="(555) 123-4567"
          />
        </div>
        <div>
          <Label htmlFor="website">Company Website</Label>
          <Input
            id="website"
            type="url"
            value={data.website || ''}
            onChange={(e) => onChange('website', e.target.value)}
            placeholder="https://example.com"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="role">Your Role *</Label>
        <Select value={data.role || ''} onValueChange={(val) => onChange('role', val)}>
          <SelectTrigger>
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="investor">Investor</SelectItem>
            <SelectItem value="developer">Developer</SelectItem>
            <SelectItem value="broker">Broker/Agent</SelectItem>
            <SelectItem value="property-manager">Property Manager</SelectItem>
            <SelectItem value="consultant">Consultant</SelectItem>
            <SelectItem value="attorney">Attorney</SelectItem>
            <SelectItem value="lender">Lender</SelectItem>
            <SelectItem value="contractor">Contractor</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="companySize">Company Size</Label>
        <Select value={data.companySize || ''} onValueChange={(val) => onChange('companySize', val)}>
          <SelectTrigger>
            <SelectValue placeholder="Select company size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Just me</SelectItem>
            <SelectItem value="2-10">2-10 employees</SelectItem>
            <SelectItem value="11-50">11-50 employees</SelectItem>
            <SelectItem value="51-200">51-200 employees</SelectItem>
            <SelectItem value="201+">201+ employees</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="experience">Years of Experience *</Label>
        <Select value={data.experience || ''} onValueChange={(val) => onChange('experience', val)}>
          <SelectTrigger>
            <SelectValue placeholder="Select experience level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0-2">0-2 years</SelectItem>
            <SelectItem value="3-5">3-5 years</SelectItem>
            <SelectItem value="6-10">6-10 years</SelectItem>
            <SelectItem value="11-20">11-20 years</SelectItem>
            <SelectItem value="20+">20+ years</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="bio">Brief Bio</Label>
        <Textarea
          id="bio"
          value={data.bio || ''}
          onChange={(e) => onChange('bio', e.target.value)}
          placeholder="Tell us about yourself and your real estate interests..."
          rows={3}
        />
      </div>
    </div>
  );
}

