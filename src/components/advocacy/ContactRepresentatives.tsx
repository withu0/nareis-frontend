import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ContactRepresentatives: React.FC = () => {
  const [zipCode, setZipCode] = useState('');
  const [showReps, setShowReps] = useState(false);
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const representatives = [
    { name: 'Sen. John Smith', party: 'R', role: 'Senator', phone: '(202) 224-3121', email: 'senator.smith@senate.gov' },
    { name: 'Sen. Jane Doe', party: 'D', role: 'Senator', phone: '(202) 224-3122', email: 'senator.doe@senate.gov' },
    { name: 'Rep. Mike Johnson', party: 'R', role: 'Representative', phone: '(202) 225-3131', email: 'rep.johnson@house.gov' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipCode.length === 5) {
      setShowReps(true);
      toast({ title: 'Representatives Found', description: `Found 3 representatives for ${zipCode}` });
    }
  };

  const handleSendMessage = (rep: string) => {
    toast({ title: 'Message Sent', description: `Your message was sent to ${rep}` });
    setMessage('');
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Contact Your Representatives</h2>
      <Card className="p-6 mb-6">
        <form onSubmit={handleSearch} className="flex gap-3">
          <Input placeholder="Enter ZIP Code" value={zipCode} onChange={(e) => setZipCode(e.target.value)} maxLength={5} className="max-w-xs" />
          <Button type="submit">Find Representatives</Button>
        </form>
      </Card>

      {showReps && (
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {representatives.map((rep, idx) => (
            <Card key={idx} className="p-6">
              <h3 className="text-lg font-bold mb-1">{rep.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{rep.role} ({rep.party})</p>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2"><Phone className="w-4 h-4" />{rep.phone}</div>
                <div className="flex items-center gap-2"><Mail className="w-4 h-4" />{rep.email}</div>
              </div>
              <Button variant="outline" size="sm" className="w-full" onClick={() => handleSendMessage(rep.name)}>Send Message</Button>
            </Card>
          ))}
        </div>
      )}

      {showReps && (
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Compose Message</h3>
          <Textarea placeholder="Write your message about real estate legislation..." value={message} onChange={(e) => setMessage(e.target.value)} rows={6} className="mb-4" />
          <Button onClick={() => handleSendMessage('all representatives')}>Send to All</Button>
        </Card>
      )}
    </div>
  );
};
