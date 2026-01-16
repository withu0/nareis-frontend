import React from 'react';
import { useNavigate } from 'react-router-dom';
import NewsCard from './NewsCard';
import { news } from '@/data/nareiMembers';


const NewsSection: React.FC = () => {
  const navigate = useNavigate();

  const handleViewAllNews = () => {
    navigate('/news');
  };

  return (
    <section id="news" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest News & Insights</h2>
          <p className="text-xl text-gray-600">Stay informed with industry news and updates</p>

        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {news.slice(0, 3).map((article) => (
            <NewsCard key={article.id} {...article} />
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={handleViewAllNews}
            className="bg-amber-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors cursor-pointer"
          >
            View All News & Insights
          </button>
        </div>
      </div>
    </section>
  );
};


export default NewsSection;

