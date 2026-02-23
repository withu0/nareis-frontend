import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Briefcase, ExternalLink, AlertTriangle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { FeaturedMembershipForm } from './FeaturedMembershipForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FeaturedMember {
  id: string;
  company_name: string;
  logo_url: string;
  website_url: string;
  status: string;
  end_date: string;
  payment_status: string;
}

// Fallback static members if database is empty
const staticFeaturedMembers = [
  {
    id: 'static-1',
    company_name: 'Cabinet Creations',
    logo_url: 'https://d64gsuwffb70l.cloudfront.net/6849691d0ad29e5fa5584183_1763467138389_d4f81d38.png',
    website_url: 'https://cabinetcreationsusa.com/',
    status: 'active',
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    payment_status: 'completed'
  },
  {
    id: 'static-2',
    company_name: 'Iron Lux',
    logo_url: 'https://d64gsuwffb70l.cloudfront.net/6849691d0ad29e5fa5584183_1763467138775_832d37e6.png',
    website_url: 'https://shopironlux.com/',
    status: 'active',
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    payment_status: 'completed'
  }
];

const FeaturedMembers: React.FC = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [showBecomeFeatured, setShowBecomeFeatured] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [targetUrl, setTargetUrl] = useState('');
  const [featuredMembers, setFeaturedMembers] = useState<FeaturedMember[]>(staticFeaturedMembers);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedMembers();
  }, []);

  const fetchFeaturedMembers = async () => {
    try {
      // TODO: Implement featured memberships in backend
      // For now, using static members
      setFeaturedMembers(staticFeaturedMembers);
    } catch (error) {
      console.error('Error:', error);
      setFeaturedMembers(staticFeaturedMembers);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoClick = (website?: string) => {
    if (website) {
      setTargetUrl(website);
      setShowWarning(true);
    }
  };

  const handleProceed = () => {
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
    setShowWarning(false);
    setTargetUrl('');
  };

  const handleCancel = () => {
    setShowWarning(false);
    setTargetUrl('');
  };

  const handleBecomeFeatured = () => {
    if (!user) {
      navigate('/login?redirect=/?featured=true');
      return;
    }
    setShowBecomeFeatured(false);
    setShowPaymentForm(true);
  };

  return (
    <section className="py-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Featured Members
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto whitespace-nowrap">Exceptional professionals driving innovation and excellence in real estate investing</p>

        </div>

        <div className={`grid ${featuredMembers.length === 1 ? 'grid-cols-1 max-w-md' : 'md:grid-cols-2 max-w-3xl'} gap-6 mx-auto`}>
          {featuredMembers.map((member) => (
            <div
              key={member.id}
              onClick={() => handleLogoClick(member.website_url)}
              className={`bg-transparent rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-6 flex items-center justify-center ${
                member.website_url ? 'cursor-pointer' : ''
              }`}
            >
              <img
                src={member.logo_url}
                alt={member.company_name}
                className="w-1/2 h-auto object-contain"
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <Button 
            onClick={() => setShowBecomeFeatured(true)}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Become a Featured Member
          </Button>
        </div>
      </div>

      {/* External Link Warning Dialog */}
      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Leaving NAREIS.org
            </DialogTitle>
            <DialogDescription className="pt-4">
              You are about to leave NAREIS.org and visit an external website. NAREIS is not responsible for the content or availability of external sites.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleCancel}>
              Stay on NAREIS.org
            </Button>
            <Button onClick={handleProceed} className="gap-2">
              Continue <ExternalLink className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Become Featured Dialog */}
      <Dialog open={showBecomeFeatured} onOpenChange={setShowBecomeFeatured}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-blue-600" />
              Become a Featured Member
            </DialogTitle>
            <DialogDescription className="pt-4 space-y-4">
              <p>
                Featured membership provides premium visibility for your business on NAREIS.org for 30 days.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Benefits Include:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Prominent logo placement on homepage for 30 days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Direct link to your website</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Enhanced member directory listing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Priority placement in search results</span>
                  </li>
                </ul>
              </div>
              <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                <p className="text-lg font-bold text-gray-900">$300 for 30 days</p>
                <p className="text-sm text-gray-600">One-time payment</p>
              </div>
              {!user && (
                <p className="text-sm text-amber-600 font-medium">
                  You must be logged in as a member to purchase featured membership.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowBecomeFeatured(false)}>
              Cancel
            </Button>
            <Button onClick={handleBecomeFeatured} className="bg-blue-600 hover:bg-blue-700">
              {user ? 'Continue to Payment' : 'Log In to Continue'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Form Dialog */}
      <Dialog open={showPaymentForm} onOpenChange={setShowPaymentForm}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Featured Membership Payment</DialogTitle>
            <DialogDescription>
              Enter your company details to proceed with payment.
            </DialogDescription>
          </DialogHeader>
          <FeaturedMembershipForm onClose={() => setShowPaymentForm(false)} />
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default FeaturedMembers;
