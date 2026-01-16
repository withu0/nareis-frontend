import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface PhotoUploadStepProps {
  data: any;
  onChange: (field: string, value: string) => void;
}

export default function PhotoUploadStep({ data, onChange }: PhotoUploadStepProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Error', description: 'Please upload an image file', variant: 'destructive' });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Error', description: 'File size must be less than 5MB', variant: 'destructive' });
      return;
    }

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      onChange('profilePhoto', publicUrl);
      toast({ title: 'Success', description: 'Photo uploaded successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Add Your Profile Photo</h3>
        <p className="text-gray-600">Help other members recognize you</p>
      </div>
      
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="w-32 h-32">
          <AvatarImage src={data.profilePhoto} />
          <AvatarFallback className="bg-blue-100">
            <User className="w-16 h-16 text-blue-600" />
          </AvatarFallback>
        </Avatar>

        <div>
          <input
            type="file"
            id="photo-upload"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
          <Label htmlFor="photo-upload">
            <Button type="button" variant="outline" disabled={uploading} asChild>
              <span className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Photo'}
              </span>
            </Button>
          </Label>
        </div>

        <p className="text-sm text-gray-500 text-center">
          Recommended: Square image, at least 400x400px<br />
          Max file size: 5MB
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
        <strong>Optional:</strong> You can skip this step and add a photo later from your profile settings.
      </div>
    </div>
  );
}
