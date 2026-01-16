export interface CertificationModule {
  id: string;
  title: string;
  description: string;
  durationHours: number;
  orderIndex: number;
  content: string;
  required: boolean;
  completed: boolean;
  score?: number;
}

export interface CertificationStatus {
  status: 'pending' | 'in_progress' | 'certified' | 'renewal_needed';
  certificationDate?: string;
  expirationDate?: string;
  certificateNumber?: string;
  progress: number;
}

export const certificationModules: CertificationModule[] = [
  {
    id: '1',
    title: 'Real Estate Investment Fundamentals',
    description: 'Master the core principles of real estate investing including property analysis, market research, and investment strategies.',
    durationHours: 8,
    orderIndex: 1,
    content: 'Comprehensive overview of real estate investment principles, market analysis, and strategic planning.',
    required: true,
    completed: true,
    score: 92
  },
  {
    id: '2',
    title: 'Property Acquisition & Due Diligence',
    description: 'Learn systematic approaches to finding, analyzing, and acquiring investment properties with confidence.',
    durationHours: 6,
    orderIndex: 2,
    content: 'Deep dive into property acquisition strategies, due diligence processes, and deal analysis.',
    required: true,
    completed: true,
    score: 88
  },
  {
    id: '3',
    title: 'Financing & Capital Structure',
    description: 'Understand financing options, capital stacks, and how to structure deals for maximum returns.',
    durationHours: 5,
    orderIndex: 3,
    content: 'Explore various financing mechanisms, capital structure optimization, and creative financing strategies.',
    required: true,
    completed: false
  },
  {
    id: '4',
    title: 'Property Management Excellence',
    description: 'Develop skills in tenant relations, maintenance systems, and operational efficiency.',
    durationHours: 4,
    orderIndex: 4,
    content: 'Best practices for property management, tenant screening, and operational systems.',
    required: true,
    completed: false
  },
  {
    id: '5',
    title: 'Legal & Regulatory Compliance',
    description: 'Navigate legal requirements, contracts, and regulatory frameworks in real estate investing.',
    durationHours: 5,
    orderIndex: 5,
    content: 'Understanding legal obligations, contract law, and regulatory compliance in real estate.',
    required: true,
    completed: false
  },
  {
    id: '6',
    title: 'Exit Strategies & Portfolio Growth',
    description: 'Plan strategic exits and scale your portfolio through proven growth methodologies.',
    durationHours: 4,
    orderIndex: 6,
    content: 'Advanced portfolio management, exit strategy planning, and scaling methodologies.',
    required: true,
    completed: false
  }
];
