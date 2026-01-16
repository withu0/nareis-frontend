import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const FinalCTA = () => {
  const handleDownload = () => {
    alert('Member Benefit Guide download would start here');
  };

  const handleJoin = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-gradient-to-br from-navy-900 to-navy-800 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Your Voice. Your Value. Your NAREIS.org Membership.
          </h2>
          <p className="text-xl mb-8 text-gray-200">
            NAREIS.org members represent a powerful and diverse community of leaders committed to professional, ethical real estate investing. We proudly offer exclusive benefits designed to strengthen your portfolio, support your success, and enhance your leadership.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleDownload}
              size="lg" 
              className="bg-white text-navy-900 hover:bg-gray-100"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Benefit Guide
            </Button>
            <Button 
              onClick={handleJoin}
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-navy-900"
            >
              Join NAREIS.org Today
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
