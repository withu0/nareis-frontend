import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ReCaptchaProps {
  onVerify: (token: string) => void;
  action?: string;
}

export function ReCaptcha({ onVerify, action = 'submit' }: ReCaptchaProps) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load reCAPTCHA script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=explicit`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const executeRecaptcha = async () => {
    try {
      // In production, use actual reCAPTCHA site key
      // For now, simulate verification
      const token = 'demo_token_' + Math.random().toString(36).substring(7);
      onVerify(token);
    } catch (err) {
      setError('Failed to verify reCAPTCHA. Please try again.');
    }
  };

  useEffect(() => {
    executeRecaptcha();
  }, []);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return null;
}