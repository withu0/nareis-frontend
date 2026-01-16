import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for subscribing!');
  };

  const handleMembershipClick = () => {
    navigate('/');
    setTimeout(() => {
      const membershipSection = document.getElementById('membership');
      if (membershipSection) {
        membershipSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleProtectedResourceClick = async (path: string) => {
    if (!user) {
      navigate('/login', { state: { from: path } });
      return;
    }

    // Check if user has paid membership
    const { data: customer } = await supabase
      .from('customers')
      .select('membership_tier, approval_status')
      .eq('id', user.id)
      .single();

    if (!customer || !customer.membership_tier || customer.approval_status !== 'approved') {
      handleMembershipClick();
      return;
    }

    navigate(path);
  };

  return (
    <footer className="bg-blue-900 text-white border-t-4 border-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold text-red-500 mb-4">NAREIS.org</h3>
            <p className="text-blue-200 mb-4">Empowering real estate investors and service partners nationwide through education, advocacy, and networking.</p>

            <div className="flex gap-3">
              <button onClick={() => alert('Opening Facebook')} className="hover:text-red-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </button>
              <button onClick={() => alert('Opening Twitter')} className="hover:text-red-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </button>
              <button onClick={() => alert('Opening LinkedIn')} className="hover:text-red-500 transition-colors">
                <Linkedin className="w-5 h-5" />
              </button>
              <button onClick={() => alert('Opening Instagram')} className="hover:text-red-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-red-500">Quick Links</h4>
            <ul className="space-y-2">
              <li><button onClick={() => navigate('/about')} className="text-blue-200 hover:text-red-500 transition-colors">About Us</button></li>
              <li><button onClick={handleMembershipClick} className="text-blue-200 hover:text-red-500 transition-colors">Membership</button></li>
              <li><button onClick={() => handleProtectedResourceClick('/events')} className="text-blue-200 hover:text-red-500 transition-colors">Events</button></li>
              <li><button onClick={() => handleProtectedResourceClick('/certification')} className="text-blue-200 hover:text-red-500 transition-colors">Certifications</button></li>
              <li><button onClick={() => handleProtectedResourceClick('/advocacy')} className="text-blue-200 hover:text-red-500 transition-colors">Advocacy</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-red-500">Resources</h4>
            <ul className="space-y-2">
              <li><button onClick={() => handleProtectedResourceClick('/resources')} className="text-blue-200 hover:text-red-500 transition-colors">Resource Library</button></li>
              <li><button onClick={() => handleProtectedResourceClick('/resources')} className="text-blue-200 hover:text-red-500 transition-colors">Market Reports</button></li>
              <li><button onClick={() => handleProtectedResourceClick('/video-library')} className="text-blue-200 hover:text-red-500 transition-colors">Webinars</button></li>
              <li><button onClick={() => handleProtectedResourceClick('/member-directory')} className="text-blue-200 hover:text-red-500 transition-colors">Member Directory</button></li>
              <li><button onClick={() => handleProtectedResourceClick('/find-local-chapter')} className="text-blue-200 hover:text-red-500 transition-colors">Chapter Locator</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-red-500">Contact</h4>
            <ul className="space-y-3 text-blue-200">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>123 Investment Boulevard<br />Suite 500<br />Washington, DC 20001</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <span>(717) 725-1513</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span>info@nareis.org</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-blue-700 pt-8">
          <div className="text-center text-blue-200 text-sm">
            <p>&copy; 2025 National Association of Real Estate Investors & Service Partners. All rights reserved.</p>

            <div className="mt-2 space-x-4">
              <button onClick={() => navigate('/privacy-policy')} className="hover:text-red-500 transition-colors">Privacy Policy</button>
              <button onClick={() => navigate('/terms-of-service')} className="hover:text-red-500 transition-colors">Terms of Service</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
