import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Bell } from 'lucide-react';

interface NotificationPreviewProps {
  title: string;
  message: string;
  link?: string;
  onClose: () => void;
}

export function NotificationPreview({ title, message, link, onClose }: NotificationPreviewProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Notification Preview</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">This is how your notification will appear to members:</p>
          
          <Card className="p-4 border-l-4 border-l-blue-500">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">{title || 'Notification Title'}</h4>
                <p className="text-sm text-gray-600">{message || 'Notification message will appear here...'}</p>
                {link && (
                  <a href={link} className="text-sm text-blue-600 hover:underline mt-2 inline-block">
                    View Details →
                  </a>
                )}
                <p className="text-xs text-gray-400 mt-2">Just now</p>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
