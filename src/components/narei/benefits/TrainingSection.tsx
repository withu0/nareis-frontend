import { Calendar, Video, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TrainingSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-navy-900 mb-4">Education & Training</h2>
              <p className="text-xl text-gray-700">
                <strong>Where Real Estate Leaders Learn and Connect</strong><br />
                NAREIS.org connects investors through national, regional, and virtual programs that foster education, peer engagement, and leadership growth in real estate investing.
              </p>
            </div>
            <div>
              <img 
                src="https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1760607808965_e33fa5ee.webp" 
                alt="Conference networking"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg">
              <Calendar className="w-12 h-12 text-gold-500 mb-4" />
              <h3 className="text-2xl font-bold text-navy-900 mb-3">National Conference</h3>
              <p className="text-gray-600 mb-4">
                Held each year, NAREIS.org National is a 3-day conference for investors and industry leaders, offering expert content, high-level networking, and CE credits.
              </p>
              <Button variant="link" className="text-gold-600 p-0">Learn More →</Button>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <Video className="w-12 h-12 text-gold-500 mb-4" />
              <h3 className="text-2xl font-bold text-navy-900 mb-3">Webinars</h3>
              <p className="text-gray-600 mb-4">
                Monthly webinars featuring leading experts on investment strategies, market analysis, financing, legal compliance, and property management.
              </p>
              <Button variant="link" className="text-gold-600 p-0">Learn More →</Button>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <Users className="w-12 h-12 text-gold-500 mb-4" />
              <h3 className="text-2xl font-bold text-navy-900 mb-3">I2I Meetings</h3>
              <p className="text-gray-600 mb-4">
                Our Investor to Investor (I2I) series fosters connection around emerging issues including market trends, financing strategies, and technology.
              </p>
              <Button variant="link" className="text-gold-600 p-0">Learn More →</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrainingSection;
