import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AdCreativeUpload } from './AdCreativeUpload';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface CreateAdFormProps {
  onSubmit: (data: any) => void;
  loading?: boolean;
}

const PLACEMENT_PRICING = {
  sidebar: 100,
  banner: 200,
  featured: 500,
  homepage: 300
};

export function CreateAdForm({ onSubmit, loading }: CreateAdFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ad_type: 'display',
    placement: 'sidebar',
    target_url: '',
    creative_url: '',
    start_date: new Date(),
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  });

  const calculateBudget = () => {
    const days = Math.ceil((formData.end_date.getTime() - formData.start_date.getTime()) / (1000 * 60 * 60 * 24));
    const dailyRate = PLACEMENT_PRICING[formData.placement as keyof typeof PLACEMENT_PRICING];
    return days * dailyRate;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, budget: calculateBudget() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label>Campaign Title *</Label>
        <Input required value={formData.title}
          onChange={e => setFormData({...formData, title: e.target.value})} />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Ad Type</Label>
          <Select value={formData.ad_type} onValueChange={v => setFormData({...formData, ad_type: v})}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="display">Display</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="native">Native</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Placement</Label>
          <Select value={formData.placement} onValueChange={v => setFormData({...formData, placement: v})}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="sidebar">Sidebar - $100/day</SelectItem>
              <SelectItem value="banner">Banner - $200/day</SelectItem>
              <SelectItem value="homepage">Homepage - $300/day</SelectItem>
              <SelectItem value="featured">Featured - $500/day</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <AdCreativeUpload
        currentUrl={formData.creative_url}
        onUpload={url => setFormData({...formData, creative_url: url})}
      />

      <div>
        <Label>Target URL *</Label>
        <Input required type="url" value={formData.target_url}
          onChange={e => setFormData({...formData, target_url: e.target.value})}
          placeholder="https://example.com" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(formData.start_date, 'PPP')}
              </Button>
            </PopoverTrigger>
            <PopoverContent><Calendar mode="single" selected={formData.start_date}
              onSelect={d => d && setFormData({...formData, start_date: d})} /></PopoverContent>
          </Popover>
        </div>

        <div>
          <Label>End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(formData.end_date, 'PPP')}
              </Button>
            </PopoverTrigger>
            <PopoverContent><Calendar mode="single" selected={formData.end_date}
              onSelect={d => d && setFormData({...formData, end_date: d})} /></PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="font-semibold">Total Budget: ${calculateBudget().toLocaleString()}</p>
        <p className="text-sm text-gray-600">
          {Math.ceil((formData.end_date.getTime() - formData.start_date.getTime()) / (1000 * 60 * 60 * 24))} days
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Processing...' : 'Continue to Payment'}
      </Button>
    </form>
  );
}
