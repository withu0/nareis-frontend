import { Button } from '@/components/ui/button';

const BenefitHero = () => {
  const handleJoinClick = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <section className="relative bg-gray-100 py-24">
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url('https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1760607807497_2db99bb4.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 text-gray-900">
            Power Without the Price Tag
          </h1>
          <p className="text-2xl mb-4 text-gray-900 font-semibold">
            The Next Level of Professional Credibility
          </p>
          <p className="text-xl mb-8 text-gray-800">
            Gain verified professional status, strategic mastermind connections, and national recognition—all at a price that makes elite-level resources accessible to every serious investor. NAREIS membership isn't just about what you get—it's about who you become.
          </p>


          <Button onClick={handleJoinClick} size="lg" className="bg-gold-500 hover:bg-gold-600 text-navy-900">
            Become a Member
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BenefitHero;
