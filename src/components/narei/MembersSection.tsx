import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Gauge, Pause } from 'lucide-react';

import MemberCard from './MemberCard';
import { members } from '@/data/nareiMembers';

const MembersSection: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isPaused, setIsPaused] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [speed, setSpeed] = useState<'slow' | 'medium' | 'fast'>(() => {
    return (sessionStorage.getItem('membersScrollSpeed') as 'slow' | 'medium' | 'fast') || 'medium';
  });

  const speedConfig = {
    slow: '50s',
    medium: '30s',
    fast: '15s'
  };

  const duplicatedMembers = [...members, ...members];
  const totalSections = members.length;

  useEffect(() => {
    sessionStorage.setItem('membersScrollSpeed', speed);
  }, [speed]);

  // Track scroll position for progress indicator
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const updateActiveSection = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = 300; // 288px (w-72) + 24px gap
      const section = Math.round(scrollLeft / cardWidth) % totalSections;
      setActiveSection(section);
    };

    container.addEventListener('scroll', updateActiveSection);
    return () => container.removeEventListener('scroll', updateActiveSection);
  }, [totalSections]);

  const handleViewDirectory = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/member-directory');
  };

  const scrollToSection = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const cardWidth = 300;
    container.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth'
    });
  };


  return (
    <section id="members" className="py-20 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Members</h2>
          <p className="text-xl text-gray-600">Connect with successful investors across the nation</p>
        </div>

        <div className="flex items-center justify-center gap-1.5 mb-8">
          <Gauge className="w-4 h-4 text-gray-600" />
          <span className="text-xs font-medium text-gray-700 mr-1">Scroll Speed:</span>
          <button
            onClick={() => setSpeed('slow')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              speed === 'slow' ? 'bg-blue-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Slow
          </button>
          <button
            onClick={() => setSpeed('medium')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              speed === 'medium' ? 'bg-blue-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Medium
          </button>
          <button
            onClick={() => setSpeed('fast')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              speed === 'fast' ? 'bg-blue-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Fast
          </button>
        </div>


        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Pause Indicator Overlay */}
          {isPaused && (
            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-6 shadow-2xl border-4 border-blue-500 animate-pulse-slow">
                <Pause className="h-12 w-12 text-blue-600" />
              </div>
            </div>
          )}
          
          <div 
            ref={scrollContainerRef}
            className={`overflow-x-auto overflow-y-hidden scrollbar-hide transition-opacity duration-300 ${isPaused ? 'opacity-70' : 'opacity-100'}`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div 
              className={`flex gap-6 ${isPaused ? '' : 'animate-scroll-members'}`}
              style={{
                width: 'max-content',
                animationDuration: speedConfig[speed]
              }}
            >
              {duplicatedMembers.map((member, idx) => (
                <div key={idx} className="flex-shrink-0 w-72">
                  <MemberCard {...member} />
                </div>
              ))}
            </div>
          </div>

          {/* Progress Indicator Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalSections }).map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToSection(index)}
                className={`transition-all duration-300 rounded-full ${
                  activeSection === index
                    ? 'w-8 h-2 bg-blue-900'
                    : 'w-2 h-2 bg-gray-400 hover:bg-gray-500'
                }`}
                aria-label={`Go to member ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <button
            onClick={handleViewDirectory}
            className="bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
          >
            View Full Directory
          </button>
        </div>

      </div>

      <style>{`
        @keyframes scroll-members {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll-members {
          animation: scroll-members 30s linear infinite;
          animation-play-state: running;
        }
        
        .animate-scroll-members:hover {
          animation-play-state: paused;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>


    </section>
  );
};

export default MembersSection;
