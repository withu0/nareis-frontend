import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
}

interface RelatedArticlesProps {
  currentArticleId: string;
  category: string;
  allArticles: Article[];
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({ currentArticleId, category, allArticles }) => {
  const navigate = useNavigate();
  
  const relatedArticles = allArticles
    .filter(article => article.id !== currentArticleId && article.category === category)
    .slice(0, 3);

  if (relatedArticles.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Related Articles</h3>
      <div className="grid gap-4">
        {relatedArticles.map((article) => (
          <div
            key={article.id}
            onClick={() => navigate(`/news/${article.id}`)}
            className="flex gap-4 p-4 bg-white rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
          >
            <img src={article.image} alt={article.title} className="w-24 h-24 object-cover rounded" />
            <div className="flex-1">
              <h4 className="font-semibold hover:text-blue-900 mb-1">{article.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{article.excerpt}</p>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {article.date}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedArticles;
