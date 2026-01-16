import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Share2, Linkedin, Twitter, Facebook, Link2, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Props {
  memberName: string;
  memberTitle: string;
  memberCompany: string;
}

export function MemberSocialShare({ memberName, memberTitle, memberCompany }: Props) {
  const { toast } = useToast();
  const currentUrl = window.location.href;
  const shareText = `Check out ${memberName}, ${memberTitle} at ${memberCompany} - NAREI Member`;

  const shareLinks = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    email: `mailto:?subject=${encodeURIComponent(`NAREI Member: ${memberName}`)}&body=${encodeURIComponent(`${shareText}\n\n${currentUrl}`)}`
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      toast({ title: 'Link Copied!', description: 'Profile link copied to clipboard' });
    } catch {
      toast({ title: 'Error', description: 'Failed to copy link', variant: 'destructive' });
    }
  };

  const openShare = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Share2 className="w-5 h-5" /> Share Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => openShare(shareLinks.linkedin)} className="flex items-center gap-2">
            <Linkedin className="w-4 h-4 text-blue-700" /> LinkedIn
          </Button>
          <Button variant="outline" size="sm" onClick={() => openShare(shareLinks.twitter)} className="flex items-center gap-2">
            <Twitter className="w-4 h-4 text-sky-500" /> Twitter
          </Button>
          <Button variant="outline" size="sm" onClick={() => openShare(shareLinks.facebook)} className="flex items-center gap-2">
            <Facebook className="w-4 h-4 text-blue-600" /> Facebook
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.location.href = shareLinks.email} className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-600" /> Email
          </Button>
          <Button variant="outline" size="sm" onClick={copyToClipboard} className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-gray-600" /> Copy Link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
