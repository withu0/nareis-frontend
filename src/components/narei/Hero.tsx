import React, { useEffect, useState } from 'react';
import { ArrowRight, Users, BookOpen, Award } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';
import HeroStatisticsModal from './HeroStatisticsModal';

const Hero: React.FC = () => {
  const [upcomingEventCount, setUpcomingEventCount] = useState<number>(0);
  const [resourceCount, setResourceCount] = useState<number>(0);
  const [activeMemberCount, setActiveMemberCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'members' | 'resources' | 'events' | null>(null);

  const openModal = (type: 'members' | 'resources' | 'events') => {
    setModalType(type);
    setModalOpen(true);
  };





  useEffect(() => {
    const fetchCounts = async () => {
      setIsLoading(true);
      setHasError(false);
      
      try {
        // Fetch upcoming events count (events with date >= today)
        const today = new Date().toISOString().split('T')[0];
        const { count: eventsCount, error: eventsError } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .gte('date', today);
        
        if (eventsError) {
          console.error('Error fetching upcoming event count:', eventsError);
          setHasError(true);
        } else {
          setUpcomingEventCount(eventsCount || 0);
        }

        // Fetch resource count
        const { count: resourcesCount, error: resourcesError } = await supabase
          .from('resources')
          .select('*', { count: 'exact', head: true });
        
        if (resourcesError) {
          console.error('Error fetching resource count:', resourcesError);
          setHasError(true);
        } else {
          setResourceCount(resourcesCount || 0);
        }

        // Fetch active members count (approved members only)
        const { count: membersCount, error: membersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('approval_status', 'approved');
        
        if (membersError) {
          console.error('Error fetching active member count:', membersError);
          setHasError(true);
        } else {
          setActiveMemberCount(membersCount || 0);
        }

      } catch (err) {
        console.error('Error:', err);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounts();
  }, []);



  const handleJoinNow = () => {
    document.getElementById('membership')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleExplore = () => {
    document.getElementById('resources')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <img
          src="https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1760604301909_14246259.webp"
          alt="Hero"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="block text-white">Elevate Together.</span>
            <span className="block text-white">Drive Results.</span>
            <span className="block text-white">Raise Standards.</span>
          </h1>


          <p className="text-xl md:text-2xl mb-4 text-white max-w-3xl mx-auto font-semibold">
            The National Standard and Mastermind for <span className="font-bold italic">EVERY</span> Real Estate Investor and Service Partner
          </p>

          <p className="text-lg mb-8 text-white max-w-3xl mx-auto">
            Where real estate investment professionals gain credibility, strategic connections, and the power to lead—without the elite price tag
          </p>



          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">

            <button
              onClick={handleJoinNow}
              className="bg-red-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              Become a Member
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={handleExplore}
              className="bg-white text-blue-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Explore Resources
            </button>
          </div>




        </div>
      </div>

      <HeroStatisticsModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        type={modalType} 
      />
    </div>

  );
};

export default Hero;
