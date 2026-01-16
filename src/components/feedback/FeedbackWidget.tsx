import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    // Submit feedback to backend
    console.log('Feedback:', feedback);
    setSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
      setSubmitted(false);
      setFeedback('');
    }, 2000);
  };

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 rounded-full h-14 w-14 shadow-lg z-50"
          aria-label="Open feedback form"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
      
      {isOpen && (
        <Card className="fixed bottom-4 right-4 w-80 shadow-xl z-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Send Feedback</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <p className="text-green-600">Thank you for your feedback!</p>
            ) : (
              <>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us what you think..."
                  className="mb-3"
                  rows={4}
                />
                <Button onClick={handleSubmit} className="w-full">
                  Submit
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}