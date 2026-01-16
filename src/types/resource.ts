export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'report' | 'template' | 'guide' | 'webinar' | 'article' | 'whitepaper';
  category: string;
  topics: string[];
  imageUrl: string;
  fileUrl: string;
  fileSize: string;
  uploadedBy: string;
  uploadDate: string;
  downloads: number;
  rating: number;
  reviewCount: number;
  duration?: string;
}

export interface ResourceReview {
  id: string;
  resourceId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}
