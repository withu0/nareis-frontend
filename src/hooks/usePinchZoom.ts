import { useState, useRef } from 'react';

export const usePinchZoom = (minZoom = 1, maxZoom = 4) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const lastDistance = useRef(0);
  const lastCenter = useRef({ x: 0, y: 0 });

  const getDistance = (touches: React.TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getCenter = (touches: React.TouchList) => ({
    x: (touches[0].clientX + touches[1].clientX) / 2,
    y: (touches[0].clientY + touches[1].clientY) / 2,
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      lastDistance.current = getDistance(e.touches);
      lastCenter.current = getCenter(e.touches);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const distance = getDistance(e.touches);
      const center = getCenter(e.touches);
      
      if (lastDistance.current > 0) {
        const newScale = Math.min(maxZoom, Math.max(minZoom, scale * (distance / lastDistance.current)));
        setScale(newScale);
        
        setPosition({
          x: position.x + (center.x - lastCenter.current.x),
          y: position.y + (center.y - lastCenter.current.y),
        });
      }
      
      lastDistance.current = distance;
      lastCenter.current = center;
    }
  };

  const handleTouchEnd = () => {
    lastDistance.current = 0;
  };

  const reset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return {
    scale,
    position,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    reset,
  };
};
