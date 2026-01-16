import React from 'react';
import Navigation from './narei/Navigation';
import Hero from './narei/Hero';
import ResourcesSection from './narei/ResourcesSection';
import EventsSection from './narei/EventsSection';
import EducationSection from './narei/EducationSection';
import MembersSection from './narei/MembersSection';
import AdvocacySection from './narei/AdvocacySection';
import NewsSection from './narei/NewsSection';
import MembershipSection from './narei/MembershipSection';
import Footer from './narei/Footer';
import SuccessStories from './narei/SuccessStories';
import FeaturedMembers from './narei/FeaturedMembers';
import EnhancedAIChatbot from './chatbot/EnhancedAIChatbot';
import { useAuth } from '@/contexts/AuthContext';

const AppLayout: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <FeaturedMembers />
      <div id="resources">
        {user && <ResourcesSection />}
      </div>
      <SuccessStories />
      {user && <EventsSection />}
      {user && <EducationSection />}
      <MembersSection />
      {user && <AdvocacySection />}
      <NewsSection />
      <MembershipSection />
      <Footer />
      <EnhancedAIChatbot />
    </div>
  );
};

export default AppLayout;
