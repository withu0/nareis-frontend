import { Button } from '@/components/ui/button';
import { Award, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FoundingMemberSection() {
  const navigate = useNavigate();

  return (
    <section className="mb-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 border border-blue-100">
      <div className="flex items-center gap-3 mb-6">
        <Award className="w-8 h-8 text-blue-600" />
        <h2 className="text-3xl font-bold text-gray-900">Membership: Building the Foundation</h2>

      </div>
      
      <p className="text-gray-800 mb-6 text-lg">
        Membership in NAREIS.org isn't about just joining an association—it's about becoming a member so you have a voice in shaping the future national standard for real-estate investing before it's decided for you. Join now and help set the direction.
      </p>


      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <Users className="w-6 h-6 text-blue-600 mb-3" />
          <h3 className="font-bold text-gray-900 mb-2">Shape the Future</h3>
          <p className="text-gray-700 text-sm">
            Foundation Members have direct input on standards, certification criteria, and the direction of the industry.
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <Award className="w-6 h-6 text-blue-600 mb-3" />
          <h3 className="font-bold text-gray-900 mb-2">Legacy Recognition</h3>
          <p className="text-gray-700 text-sm">
            Your name permanently recognized as a pioneer who helped establish professional standards.
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <TrendingUp className="w-6 h-6 text-blue-600 mb-3" />
          <h3 className="font-bold text-gray-900 mb-2">Lifetime Benefits</h3>
          <p className="text-gray-700 text-sm">
            Foundation Member status includes exclusive perks and recognition that lasts your entire membership.
          </p>
        </div>
      </div>

      <p className="text-gray-800 mb-6">
        This is your opportunity to be part of something bigger—to help define what it means to be a <span className="font-semibold">credentialed, professional real estate investor</span> in America.
      </p>

      <Button 
        size="lg" 
        className="bg-blue-600 hover:bg-blue-700 text-white"
        onClick={() => navigate('/signup')}
      >
        <ArrowRight className="w-5 h-5 mr-2" />
        Become A Member Now
      </Button>
    </section>
  );
}
