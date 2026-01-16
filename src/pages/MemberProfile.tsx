import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Member } from '@/types/member';
import { fetchMemberById } from '@/lib/memberService';
import { MemberProfileHeader } from '@/components/members/MemberProfileHeader';
import { MemberContactForm } from '@/components/members/MemberContactForm';
import { MemberSocialShare } from '@/components/members/MemberSocialShare';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Phone, Globe, Linkedin, Briefcase, Users, Shield } from 'lucide-react';

export default function MemberProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMember() {
      if (!id) return;
      setLoading(true);
      const data = await fetchMemberById(id);
      setMember(data);
      setLoading(false);
    }
    loadMember();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Member Not Found</h1>
        <Button onClick={() => navigate('/member-directory')}>Back to Directory</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Button variant="ghost" onClick={() => navigate('/member-directory')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
        </Button>

        <MemberProfileHeader member={member} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Briefcase className="w-5 h-5" /> About</CardTitle></CardHeader>
              <CardContent><p className="text-gray-700 leading-relaxed">{member.bio}</p></CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5" /> Expertise</CardTitle></CardHeader>
              <CardContent><div className="flex flex-wrap gap-2">{member.expertise.map((skill) => (<Badge key={skill} variant="secondary" className="px-3 py-1">{skill}</Badge>))}</div></CardContent>
            </Card>

            <MemberContactForm memberName={member.name} memberId={member.id} />
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> Contact Info</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {member.email && <a href={`mailto:${member.email}`} className="flex items-center gap-3 text-gray-700 hover:text-blue-600"><Mail className="w-4 h-4" />{member.email}</a>}
                {member.phone && <a href={`tel:${member.phone}`} className="flex items-center gap-3 text-gray-700 hover:text-blue-600"><Phone className="w-4 h-4" />{member.phone}</a>}
                {member.website && <a href={member.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-700 hover:text-blue-600"><Globe className="w-4 h-4" />Website</a>}
                {member.linkedin && <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-700 hover:text-blue-600"><Linkedin className="w-4 h-4" />LinkedIn</a>}
              </CardContent>
            </Card>

            <MemberSocialShare memberName={member.name} memberTitle={member.title} memberCompany={member.company} />

            {member.isAvailableForNetworking && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-6 text-center">
                  <Badge className="bg-green-600 text-white mb-2">Available for Networking</Badge>
                  <p className="text-sm text-green-700">This member is open to networking opportunities</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
