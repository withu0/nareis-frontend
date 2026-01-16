import React, { useState } from 'react';
import { useSwipe } from '@/hooks/useSwipe';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SwipeableModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const SwipeableModal: React.FC<SwipeableModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  const [translateY, setTranslateY] = useState(0);

  const swipeHandlers = useSwipe({
    onSwipeDown: onClose,
    minSwipeDistance: 100,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-hidden shadow-xl transform transition-transform"
        style={{ transform: `translateY(${translateY}px)` }}
        {...swipeHandlers}
      >
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
          {children}
        </div>
      </div>
    </div>
  );
};
