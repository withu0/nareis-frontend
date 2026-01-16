import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Upload } from 'lucide-react';

export function ProfilePhotoUpload({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(user?.user_metadata?.avatar_url || '');
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from('media').upload(fileName, file);

    if (uploadError) {
      toast({ title: 'Error', description: uploadError.message, variant: 'destructive' });
    } else {
      const { data } = supabase.storage.from('media').getPublicUrl(fileName);
      await supabase.auth.updateUser({ data: { avatar_url: data.publicUrl } });
      setPhotoUrl(data.publicUrl);
      toast({ title: 'Success', description: 'Profile photo updated' });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <Avatar className="w-32 h-32">
        <AvatarImage src={photoUrl} />
        <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <input type="file" id="photo" accept="image/*" onChange={handleUpload} className="hidden" />
        <Button type="button" onClick={() => document.getElementById('photo')?.click()} disabled={loading}>
          <Upload className="mr-2 h-4 w-4" /> {loading ? 'Uploading...' : 'Upload Photo'}
        </Button>
      </div>
    </div>
  );
}
