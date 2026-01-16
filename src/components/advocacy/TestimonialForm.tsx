import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export const TestimonialForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    issue: '',
    story: '',
    impact: '',
    consent: false
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ 
      title: 'Testimonial Submitted!', 
      description: 'Thank you for sharing your story. Our advocacy team will review it shortly.' 
    });
    setFormData({ name: '', location: '', issue: '', story: '', impact: '', consent: false });
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Share Your Story</h2>
      <Card className="p-8">
        <p className="text-gray-600 mb-6">
          Your personal experiences help legislators understand the real-world impact of policies. 
          Share your story to strengthen our advocacy efforts.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="location">Location (City, State) *</Label>
              <Input id="location" value={formData.location} onChange={(e) => handleChange('location', e.target.value)} required />
            </div>
          </div>

          <div>
            <Label htmlFor="issue">Related Issue/Legislation *</Label>
            <Input id="issue" value={formData.issue} onChange={(e) => handleChange('issue', e.target.value)} placeholder="e.g., H.R. 2847, Property Tax Reform" required />
          </div>

          <div>
            <Label htmlFor="story">Your Story *</Label>
            <Textarea id="story" value={formData.story} onChange={(e) => handleChange('story', e.target.value)} rows={6} placeholder="Describe your experience and how this issue affects you..." required />
          </div>

          <div>
            <Label htmlFor="impact">Impact on Your Business *</Label>
            <Textarea id="impact" value={formData.impact} onChange={(e) => handleChange('impact', e.target.value)} rows={4} placeholder="How has this policy affected your real estate investments?" required />
          </div>

          <div className="flex items-start gap-3">
            <input type="checkbox" id="consent" checked={formData.consent} onChange={(e) => handleChange('consent', e.target.checked)} required className="mt-1" />
            <Label htmlFor="consent" className="text-sm">
              I consent to NAREI using my testimonial for advocacy purposes, including sharing with legislators and in public campaigns.
            </Label>
          </div>

          <Button type="submit" size="lg" className="w-full">Submit Testimonial</Button>
        </form>
      </Card>
    </div>
  );
};
