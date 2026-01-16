import React from 'react';
import { BackButton } from '@/components/ui/back-button';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LegislativeUpdates } from '@/components/advocacy/LegislativeUpdates';
import { ContactRepresentatives } from '@/components/advocacy/ContactRepresentatives';
import { AdvocacyMaterials } from '@/components/advocacy/AdvocacyMaterials';
import { CampaignTracker } from '@/components/advocacy/CampaignTracker';
import { TestimonialForm } from '@/components/advocacy/TestimonialForm';
import { GrassrootsInitiatives } from '@/components/advocacy/GrassrootsInitiatives';

const Advocacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761063062774_a4df091e.webp" 
            alt="Advocacy" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Advocacy Tools</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Empower your voice. Access legislative updates, contact representatives, download materials, 
            track campaigns, and participate in grassroots initiatives to protect real estate investor rights.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <BackButton />
        <Tabs defaultValue="updates" className="space-y-8">

          <TabsList className="grid w-full grid-cols-6 lg:w-auto">
            <TabsTrigger value="updates">Updates</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="testimonial">Testimonial</TabsTrigger>
            <TabsTrigger value="grassroots">Grassroots</TabsTrigger>
          </TabsList>

          <TabsContent value="updates"><LegislativeUpdates /></TabsContent>
          <TabsContent value="contact"><ContactRepresentatives /></TabsContent>
          <TabsContent value="materials"><AdvocacyMaterials /></TabsContent>
          <TabsContent value="campaigns"><CampaignTracker /></TabsContent>
          <TabsContent value="testimonial"><TestimonialForm /></TabsContent>
          <TabsContent value="grassroots"><GrassrootsInitiatives /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Advocacy;
