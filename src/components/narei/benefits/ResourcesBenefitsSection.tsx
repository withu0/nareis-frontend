import { Library, Briefcase, Newspaper, Video, Calendar, Mail, GraduationCap, BarChart3, Users as UsersIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ResourcesBenefitsSection = () => {
  const resources = [
    { icon: Library, title: "Resource Library", desc: "Exclusive tools, market reports, and investment guides to enhance your portfolio performance." },
    { icon: Briefcase, title: "Job Center", desc: "Post job openings at no cost and connect with qualified real estate professionals." },
    { icon: Newspaper, title: "Members Making News", desc: "Highlight your achievements and media coverage across our platforms." },
    { icon: Video, title: "On-Demand Webinars", desc: "Expert-led sessions on investment strategies, market analysis, and emerging trends." },
    { icon: Calendar, title: "Industry Event Calendar", desc: "Stay informed about conferences, webinars, and training opportunities." },
    { icon: Mail, title: "Communication", desc: "Stay updated with news, press releases, policy updates, and thought leadership." },
    { icon: GraduationCap, title: "Education Partnerships", desc: "Access scholarships and programs to advance your real estate education." },
    { icon: BarChart3, title: "Market Analytics", desc: "Benchmark your portfolio performance against national peers with exclusive data." },
    { icon: UsersIcon, title: "Diversity & Inclusion", desc: "Resources supporting diverse leadership and equitable opportunities in real estate." }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <img 
                src="https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1760607811110_029ebdba.webp" 
                alt="Digital resources"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-navy-900 mb-4">Resources</h2>
              <p className="text-xl text-gray-700">
                NAREIS.org provides comprehensive resources exclusively for members, designed to enhance investment success, operations, and professional development.
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {resources.map((resource, idx) => {
              const Icon = resource.icon;
              return (
                <div key={idx} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <Icon className="w-10 h-10 text-gold-500 mb-3" />
                  <h3 className="text-xl font-bold text-navy-900 mb-2">{resource.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{resource.desc}</p>
                  <Button variant="link" className="text-gold-600 p-0 text-sm">Learn More →</Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResourcesBenefitsSection;
