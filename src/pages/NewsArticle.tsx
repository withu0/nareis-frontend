import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { news } from '@/data/nareiMembers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Clock, ArrowLeft, Share2 } from 'lucide-react';
import SocialShare from '@/components/news/SocialShare';
import CommentsSection from '@/components/news/CommentsSection';
import RelatedArticles from '@/components/news/RelatedArticles';
import { BackButton } from '@/components/ui/back-button';


const NewsArticle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const article = news.find(a => a.id === id);

  if (!article) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Article not found</h1>
            <Button onClick={() => navigate('/news')}>Back to News</Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <BackButton />

          <Button
            variant="ghost"
            onClick={() => navigate('/news')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to News
          </Button>

          <article className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img src={article.image} alt={article.title} className="w-full h-96 object-cover" />
            
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  {article.category}
                </span>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  {article.date}
                </div>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-6">{article.title}</h1>

              <div className="flex items-center justify-between mb-8 pb-6 border-b">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={article.author.avatar} />
                    <AvatarFallback>{article.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{article.author.name}</p>
                    <p className="text-sm text-gray-500">{article.author.title}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Share2 className="h-5 w-5 text-gray-400" />
                  <SocialShare title={article.title} url={`/news/${article.id}`} />
                </div>
              </div>

              <div className="prose prose-lg max-w-none mb-12">
                {article.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="border-t pt-8">
                <CommentsSection />
              </div>
            </div>
          </article>

          <div className="mt-12">
            <RelatedArticles 
              currentArticleId={article.id} 
              category={article.category} 
              allArticles={news} 
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default NewsArticle;
