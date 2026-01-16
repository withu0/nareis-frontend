import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';

interface TourTooltipProps {
  title: string;
  description: string;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  position?: 'top' | 'bottom' | 'left' | 'right';
  showPrev?: boolean;
}

export default function TourTooltip({
  title,
  description,
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onSkip,
  position = 'bottom',
  showPrev = true
}: TourTooltipProps) {
  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2'
  };

  const progress = Math.round((currentStep / totalSteps) * 100);

  return (
    <Card className={`absolute ${positionClasses[position]} z-50 w-80 p-4 shadow-xl animate-in fade-in slide-in-from-top-2 duration-300`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{title}</h3>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onSkip}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex gap-2">
        {showPrev && currentStep > 1 && (
          <Button variant="outline" size="sm" onClick={onPrev} className="flex-1">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
        )}
        <Button onClick={onNext} size="sm" className="flex-1">
          {currentStep === totalSteps ? 'Finish' : 'Next'}
          {currentStep < totalSteps && <ArrowRight className="h-4 w-4 ml-1" />}
        </Button>
      </div>
    </Card>
  );
}
