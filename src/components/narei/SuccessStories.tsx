import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { successStories } from '@/data/successStories';
import { Quote, Gauge, Pause } from 'lucide-react';

import { useState, useEffect, useRef } from 'react';

type Speed = 'slow' | 'medium' | 'fast';

const speedConfig = {
  slow: 50,
  medium: 30,
  fast: 15
};

export default function SuccessStories() {
  const [isPaused, setIsPaused] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [speed, setSpeed] = useState<Speed>(() => {
    return (sessionStorage.getItem('successStoriesSpeed') as Speed) || 'medium';
  });
  
  const duplicatedStories = [...successStories, ...successStories];
  const totalSections = successStories.length;

  useEffect(() => {
    sessionStorage.setItem('successStoriesSpeed', speed);
  }, [speed]);

  // Track scroll position for progress indicator
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const updateActiveSection = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = 400; // 380px + 20px gap
      const section = Math.round(scrollLeft / cardWidth) % totalSections;
      setActiveSection(section);
    };

    container.addEventListener('scroll', updateActiveSection);
    return () => container.removeEventListener('scroll', updateActiveSection);
  }, [totalSections]);

  const handleSpeedChange = (newSpeed: Speed) => {
    setSpeed(newSpeed);
  };

  const scrollToSection = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const cardWidth = 400;
    container.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth'
    });
  };


  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">Member Success Stories</h2>
          <p className="text-xl text-gray-600">Real results from real members</p>
        </div>

        <div className="flex items-center justify-center gap-1.5 mb-8">
          <Gauge className="h-4 w-4 text-gray-600" />
          <span className="text-xs font-medium text-gray-700 mr-1">Scroll Speed:</span>
          <Button
            size="sm"
            variant={speed === 'slow' ? 'default' : 'outline'}
            onClick={() => handleSpeedChange('slow')}
            className="h-7 px-2.5 text-xs"
          >
            Slow
          </Button>
          <Button
            size="sm"
            variant={speed === 'medium' ? 'default' : 'outline'}
            onClick={() => handleSpeedChange('medium')}
            className="h-7 px-2.5 text-xs"
          >
            Medium
          </Button>
          <Button
            size="sm"
            variant={speed === 'fast' ? 'default' : 'outline'}
            onClick={() => handleSpeedChange('fast')}
            className="h-7 px-2.5 text-xs"
          >
            Fast
          </Button>
        </div>


        <div 
          className="relative max-w-7xl mx-auto"
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
              className={`flex gap-6 ${isPaused ? '' : 'animate-scroll'}`}
              style={{
                width: `${duplicatedStories.length * 400}px`,
                animationDuration: `${speedConfig[speed]}s`
              }}
            >
              {duplicatedStories.map((story, idx) => (
                <Card key={`${story.id}-${idx}`} className="flex-shrink-0 w-[380px] p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={story.image}
                      alt={story.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{story.name}</h3>
                      <p className="text-sm text-gray-600">{story.role}</p>
                      <p className="text-sm text-blue-600">{story.company}</p>
                      <Badge variant="outline" className="mt-1">
                        Member since {story.memberSince}
                      </Badge>
                    </div>
                    <Quote className="h-8 w-8 text-blue-200" />
                  </div>
                  
                  <p className="text-gray-700 mb-4 italic">"{story.story}"</p>
                  
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="font-semibold text-blue-900">🏆 {story.achievement}</p>
                  </div>
                </Card>
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
                    ? 'w-8 h-2 bg-blue-600'
                    : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to story ${index + 1}`}
              />
            ))}
          </div>

        </div>

      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${successStories.length * 400}px);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
          animation-play-state: running;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>


    </section>
  );
}
