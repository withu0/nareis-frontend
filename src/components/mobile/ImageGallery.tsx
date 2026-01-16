import React, { useState } from 'react';
import { usePinchZoom } from '@/hooks/usePinchZoom';
import { useSwipe } from '@/hooks/useSwipe';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageGalleryProps {
  images: string[];
  initialIndex?: number;
  onClose: () => void;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  initialIndex = 0,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const { scale, position, handleTouchStart, handleTouchMove, handleTouchEnd, reset } = usePinchZoom();

  const swipeHandlers = useSwipe({
    onSwipeLeft: () => {
      if (scale === 1 && currentIndex < images.length - 1) {
        setCurrentIndex(prev => prev + 1);
        reset();
      }
    },
    onSwipeRight: () => {
      if (scale === 1 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
        reset();
      }
    },
  });

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button variant="ghost" size="icon" onClick={reset} className="text-white">
          <ZoomOut className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white">
          <X className="h-5 w-5" />
        </Button>
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
        {currentIndex + 1} / {images.length}
      </div>
      <div
        className="w-full h-full flex items-center justify-center overflow-hidden"
        {...swipeHandlers}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain"
          style={{
            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
            transition: scale === 1 ? 'transform 0.3s ease' : 'none',
          }}
        />
      </div>
    </div>
  );
};
