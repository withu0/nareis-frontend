import { supabase } from './supabase';

export interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  author: string;
  url?: string;
}

export async function fetchRealEstateNews(): Promise<NewsArticle[]> {
  try {
    // Call the Supabase edge function to fetch news
    const { data, error } = await supabase.functions.invoke('fetch-real-estate-news', {
      body: {}
    });

    if (error) {
      console.error('Error fetching news:', error);
      return getFallbackNews();
    }

    return data?.articles || getFallbackNews();
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return getFallbackNews();
  }
}

function getFallbackNews(): NewsArticle[] {
  return [
    {
      id: 1,
      title: "Arrived Launches Trading Platform for Rental Home Shares",
      excerpt: "Seattle-based Arrived introduces secondary market allowing investors to trade shares of rental properties, marking a significant shift in fractional real estate investment accessibility.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
      category: "Market Insights",
      date: "November 15, 2025",
      author: "Sarah Johnson"
    },
    {
      id: 2,
      title: "Alternative Property Types Gain Investor Attention",
      excerpt: "Self-storage, data centers, and life sciences facilities emerge as top performers as investors diversify beyond traditional office and retail sectors.",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
      category: "Industry Updates",
      date: "November 14, 2025",
      author: "Michael Chen"
    },
    {
      id: 3,
      title: "Global Real Estate Markets Show Recovery Signs",
      excerpt: "Deloitte's 2025 outlook reveals stabilizing property values and renewed investor confidence across major metropolitan markets worldwide.",
      image: "https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=800",
      category: "Market Insights",
      date: "November 13, 2025",
      author: "Emily Rodriguez"
    }
  ];
}

