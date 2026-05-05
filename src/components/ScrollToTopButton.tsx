import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SCROLL_THRESHOLD = 380;

/**
 * Floating control to scroll the window back to the top. Use inside member dashboard and admin shells.
 */
export function ScrollToTopButton({ className }: { className?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SCROLL_THRESHOLD);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon"
      className={cn(
        'fixed bottom-6 right-6 z-[100] h-11 w-11 rounded-full shadow-lg border border-border/60',
        'bg-white/95 backdrop-blur-sm hover:bg-white text-foreground',
        'dark:bg-gray-900/95 dark:hover:bg-gray-900',
        className
      )}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      title="Back to top"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
}
