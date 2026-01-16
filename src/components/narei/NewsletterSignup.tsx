import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would integrate with your email service
    toast({
      title: "Successfully subscribed!",
      description: "You'll receive our newsletter updates.",
    });
    
    setEmail('');
    setFirstName('');
    setLastName('');
  };

  return (
    <section className="py-16 bg-blue-900 text-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <Mail className="w-16 h-16 mx-auto mb-4 text-amber-500" />
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl text-blue-100">
            Subscribe to our newsletter for the latest industry news, event reminders, and member updates
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <Input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="bg-white text-gray-900"
            />
            <Input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="bg-white text-gray-900"
            />
          </div>
          <div className="flex gap-4">
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-white text-gray-900"
            />
            <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white">
              Subscribe
            </Button>
          </div>
          <p className="text-sm text-blue-200 mt-4 text-center">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSignup;
