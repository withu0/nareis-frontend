import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import TourTooltip from './TourTooltip';

interface TourStep {
  id: string;
  title: string;
  description: string;
  targetPath: string;
  targetSelector: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    id: 'dashboard',
    title: 'Welcome to Your Dashboard',
    description: 'This is your central hub. View your membership status, upcoming events, and quick access to all features.',
    targetPath: '/dashboard',
    targetSelector: '[data-tour="dashboard"]',
    position: 'bottom'
  },
  {
    id: 'events',
    title: 'Events Calendar',
    description: 'Discover networking events, conferences, and webinars. Register for events and add them to your calendar.',
    targetPath: '/events',
    targetSelector: '[data-tour="events"]',
    position: 'bottom'
  },
  {
    id: 'directory',
    title: 'Member Directory',
    description: 'Connect with thousands of real estate professionals. Search by location, specialty, or company.',
    targetPath: '/member-directory',
    targetSelector: '[data-tour="directory"]',
    position: 'bottom'
  },
  {
    id: 'resources',
    title: 'Resources Library',
    description: 'Access exclusive guides, templates, market reports, and educational content to grow your business.',
    targetPath: '/resources',
    targetSelector: '[data-tour="resources"]',
    position: 'bottom'
  },
  {
    id: 'forums',
    title: 'Community Forums',
    description: 'Join discussions, ask questions, and share insights with fellow members in our active community.',
    targetPath: '/forums',
    targetSelector: '[data-tour="forums"]',
    position: 'bottom'
  },
  {
    id: 'profile',
    title: 'Your Profile',
    description: 'Keep your profile updated to maximize networking opportunities and showcase your expertise.',
    targetPath: '/profile',
    targetSelector: '[data-tour="profile"]',
    position: 'bottom'
  }
];

interface InteractiveTourProps {
  onComplete?: () => void;
  autoStart?: boolean;
}

export default function InteractiveTour({ onComplete, autoStart = false }: InteractiveTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(autoStart);
  const [tourId, setTourId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (autoStart && user) {
      startTour();
    }
  }, [autoStart, user]);

  const startTour = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('onboarding_tours')
        .insert({
          user_id: user.id,
          tour_type: 'platform_tour',
          total_steps: tourSteps.length,
          current_step: 1
        })
        .select()
        .single();

      if (error) throw error;
      
      setTourId(data.id);
      setIsActive(true);
      setCurrentStep(0);
      navigate(tourSteps[0].targetPath);
    } catch (error) {
      console.error('Error starting tour:', error);
    }
  };

  const updateTourProgress = async (step: number, completed = false, skipped = false) => {
    if (!tourId || !user) return;

    const percentage = Math.round((step / tourSteps.length) * 100);

    try {
      await supabase
        .from('onboarding_tours')
        .update({
          current_step: step,
          completion_percentage: percentage,
          completed,
          skipped,
          completed_at: completed || skipped ? new Date().toISOString() : null,
          last_viewed_at: new Date().toISOString()
        })
        .eq('id', tourId);
    } catch (error) {
      console.error('Error updating tour:', error);
    }
  };

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      navigate(tourSteps[nextStep].targetPath);
      updateTourProgress(nextStep + 1);
    } else {
      completeTour();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      navigate(tourSteps[prevStep].targetPath);
      updateTourProgress(prevStep + 1);
    }
  };

  const handleSkip = () => {
    updateTourProgress(currentStep + 1, false, true);
    setIsActive(false);
    toast({
      title: 'Tour Skipped',
      description: 'You can restart the tour anytime from your profile settings.'
    });
    onComplete?.();
  };

  const completeTour = () => {
    updateTourProgress(tourSteps.length, true, false);
    setIsActive(false);
    toast({
      title: 'Tour Complete!',
      description: 'You\'re all set to explore the platform. Welcome to NAREIS!'
    });
    onComplete?.();
  };

  if (!isActive) return null;

  const step = tourSteps[currentStep];
  const isOnCorrectPage = location.pathname === step.targetPath;

  if (!isOnCorrectPage) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-300" />
      <div className="relative z-50">
        <TourTooltip
          title={step.title}
          description={step.description}
          currentStep={currentStep + 1}
          totalSteps={tourSteps.length}
          onNext={handleNext}
          onPrev={handlePrev}
          onSkip={handleSkip}
          position={step.position}
          showPrev={currentStep > 0}
        />
      </div>
    </>
  );
}
