import { Button } from '@/components/ui/button';
import { Users, DollarSign, GraduationCap, Scale, TrendingUp, ArrowRight, Award, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WhyJoinSection() {
  const navigate = useNavigate();

  const handleJoinClick = () => {
    navigate('/signup');
  };

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Join NAREIS</h2>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            Earn Professional Certification & Credibility
          </h3>
          <p className="text-gray-800">
            Become a <span className="font-semibold">NAREIS Certified Professional</span>—a verified credential that sets you apart in the marketplace. Our certification program establishes you as a legitimate, trained investor who meets national standards. Display your verified badge on your website, business cards, and marketing materials to instantly build trust with sellers, lenders, and partners.
          </p>
        </div>


        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Join the Strategic Mastermind
          </h3>
          <p className="text-gray-800">
            Connect with <span className="font-semibold">serious investors</span> in a strategic mastermind environment—not just networking, but peer accountability, deal collaboration, and high-level problem-solving. One strategic partnership here can transform your next twelve months. Members share deals, co-invest, and hold each other accountable to ambitious goals.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            Access Investor-Only Benefits
          </h3>
          <p className="text-gray-800">
            Group pricing on materials, financing, property services, software, and insurance. Members often save thousands annually—sometimes on their first project.
          </p>
        </div>


        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            Train With Proven Systems
          </h3>
          <p className="text-gray-800">
            From BRRRR to flips to multi-unit acquisitions, our on-demand courses and live sessions deliver step-by-step tactics you can use this week.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-600" />
            Shape the Laws That Shape Your Future
          </h3>
          <p className="text-gray-800">
            We don't sit on the sidelines. Our advocacy team works daily at the local, state, and federal levels—defending property rights, pushing for investor-friendly legislation, and fighting back against policies that harm independent investors. When decisions about housing, taxes, or landlord regulations are made, your voice is heard.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Get the Inside Track
          </h3>
          <p className="text-gray-800">
            We alert members to new rules, funding programs, and compliance shifts—before they hit the news. Stay proactive, not reactive.
          </p>
        </div>

        <div className="pt-8 border-t border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Raise Your Standard?</h3>
          <p className="text-gray-800 mb-2">
            Join the movement of investors who are <span className="font-semibold">defining the future</span> of real estate investing in America.
          </p>
          <p className="text-gray-800 mb-2">
            Earn your professional certification. Build strategic partnerships. Gain national recognition.
          </p>
          <p className="text-gray-800 mb-6">
            This is your opportunity to be part of something bigger—to help establish the standards that will shape the industry for decades to come.
          </p>
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleJoinClick}
          >
            <ArrowRight className="w-5 h-5 mr-2" />
            Become a Member Now
          </Button>

        </div>
      </div>
    </section>
  );
}
