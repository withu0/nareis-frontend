import React from 'react';
import { GraduationCap, BookOpen, Award, Video } from 'lucide-react';

const EducationSection: React.FC = () => {
  const programs = [
    { icon: GraduationCap, title: 'Certified Real Estate Investor (CREI)', level: 'Professional', duration: '6 months' },
    { icon: Award, title: 'Advanced Property Management', level: 'Expert', duration: '3 months' },
    { icon: BookOpen, title: 'Tax Strategy Masterclass', level: 'Intermediate', duration: '8 weeks' },
    { icon: Video, title: 'Syndication Fundamentals', level: 'Beginner', duration: '4 weeks' }
  ];

  const handleEnroll = (program: string) => {
    alert(`Enrolling in: ${program}`);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Education & Certification</h2>
          <p className="text-xl text-gray-600">Advance your expertise with industry-leading programs</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((program, idx) => (
            <div key={idx} className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all">
              <program.icon className="w-12 h-12 text-blue-900 mb-4" />
              <h3 className="font-bold text-lg mb-2">{program.title}</h3>
              <div className="flex gap-2 mb-3">
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">{program.level}</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{program.duration}</span>
              </div>
              <button
                onClick={() => handleEnroll(program.title)}
                className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition-colors mt-4"
              >
                Enroll Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
