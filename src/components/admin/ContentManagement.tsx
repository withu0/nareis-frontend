import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Eye, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ContentManagement() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const [resources, setResources] = useState([
    { id: 1, title: 'Industry Report 2024', type: 'PDF', status: 'published', views: 342, date: '2024-03-10' },
    { id: 2, title: 'Best Practices Guide', type: 'Document', status: 'published', views: 567, date: '2024-03-08' },
    { id: 3, title: 'Market Analysis', type: 'PDF', status: 'draft', views: 0, date: '2024-03-15' },
  ]);

  const [testimonials, setTestimonials] = useState([
    { id: 1, author: 'John Smith', content: 'NAREI has been instrumental in our advocacy efforts...', status: 'pending', date: '2024-03-14' },
    { id: 2, author: 'Sarah Johnson', content: 'The resources provided are invaluable for our business...', status: 'approved', date: '2024-03-12' },
  ]);

  const handleApproveTestimonial = (id: number) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status: 'approved' } : t));
    toast({ title: 'Testimonial approved', description: 'The testimonial is now visible on the website.' });
  };

  const handleRejectTestimonial = (id: number) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status: 'rejected' } : t));
    toast({ title: 'Testimonial rejected', variant: 'destructive' });
  };

  const handleDeleteResource = (id: number) => {
    setResources(prev => prev.filter(r => r.id !== id));
    toast({ title: 'Resource deleted', variant: 'destructive' });
  };

  return (
    <Tabs defaultValue="resources" className="space-y-6">
      <TabsList>
        <TabsTrigger value="resources">Resources</TabsTrigger>
        <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
        <TabsTrigger value="news">News</TabsTrigger>
      </TabsList>

      <TabsContent value="resources">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Resource Library</h3>
            <Button>Add New Resource</Button>
          </div>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input placeholder="Search resources..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
          <div className="space-y-3">
            {resources.map((resource) => (
              <div key={resource.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{resource.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge variant="outline">{resource.type}</Badge>
                    <Badge variant={resource.status === 'published' ? 'default' : 'secondary'}>{resource.status}</Badge>
                    <span className="text-sm text-gray-500">{resource.views} views</span>
                    <span className="text-sm text-gray-500">{resource.date}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost"><Eye className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost"><Edit className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDeleteResource(resource.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="testimonials">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Testimonial Moderation</h3>
          <div className="space-y-4">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{testimonial.author}</h4>
                    <p className="text-sm text-gray-500">{testimonial.date}</p>
                  </div>
                  <Badge variant={testimonial.status === 'approved' ? 'default' : testimonial.status === 'pending' ? 'secondary' : 'destructive'}>
                    {testimonial.status}
                  </Badge>
                </div>
                <p className="text-gray-700 mb-3">{testimonial.content}</p>
                {testimonial.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleApproveTestimonial(testimonial.id)}>
                      <CheckCircle className="h-4 w-4 mr-1" /> Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleRejectTestimonial(testimonial.id)}>
                      <XCircle className="h-4 w-4 mr-1" /> Reject
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="news">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">News Management</h3>
          <p className="text-gray-600">News article management coming soon...</p>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
