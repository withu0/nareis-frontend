export interface User {
  id: string;
  email: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  organization?: string;
  jobTitle?: string;
  emailVerified: boolean;
  role: 'member' | 'admin';
  membershipTier?: string;
  membershipStatus?: 'pending' | 'approved' | 'rejected' | 'active' | 'canceling';
  membershipExpiresAt?: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  onboardingCompleted?: boolean;
  profilePictureUrl?: string;
  chapterId?: string;
  interests?: string[];
  createdAt?: string;
  updatedAt?: string;
}
