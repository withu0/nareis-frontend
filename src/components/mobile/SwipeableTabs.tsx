import React, { useState } from 'react';
import { useSwipe } from '@/hooks/useSwipe';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface SwipeableTabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

export const SwipeableTabs: React.FC<SwipeableTabsProps> = ({ tabs, defaultTab }) => {
  const [activeIndex, setActiveIndex] = useState(
    defaultTab ? tabs.findIndex(t => t.id === defaultTab) : 0
  );

  const swipeHandlers = useSwipe({
    onSwipeLeft: () => setActiveIndex(prev => Math.min(prev + 1, tabs.length - 1)),
    onSwipeRight: () => setActiveIndex(prev => Math.max(prev - 1, 0)),
    minSwipeDistance: 50,
  });

  return (
    <div className="w-full">
      <div className="flex border-b overflow-x-auto">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => setActiveIndex(index)}
            className={`px-4 py-3 font-medium whitespace-nowrap transition-colors ${
              activeIndex === index
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div {...swipeHandlers} className="mt-4 touch-pan-y">
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {tabs.map(tab => (
              <div key={tab.id} className="w-full flex-shrink-0">
                {tab.content}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-2 mt-4">
        {tabs.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full transition-all ${
              activeIndex === index ? 'w-6 bg-blue-600' : 'w-1.5 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
