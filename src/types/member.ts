export interface Member {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  state: string;
  industry: string;
  expertise: string[];
  membershipTier: 'foundation' | 'growth' | 'professional' | 'enterprise' | 'founding-lifetime' | 'service-partner';
  bio: string;
  email: string;
  phone: string;
  website?: string;
  linkedin?: string;
  image: string;
  joinedDate: string;
  isAvailableForNetworking: boolean;
}

