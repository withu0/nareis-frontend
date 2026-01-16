export interface OrganizationSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs: string[];
}

export interface EventSchema {
  '@context': string;
  '@type': string;
  name: string;
  startDate: string;
  endDate?: string;
  location: {
    '@type': string;
    name: string;
    address: string;
  };
  description: string;
  organizer: {
    '@type': string;
    name: string;
  };
}

export const organizationSchema: OrganizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'NAREIS',
  url: 'https://nareis.org',
  logo: 'https://nareis.org/logo.png',
  description: 'National Association of Real Estate Investors',
  sameAs: [
    'https://facebook.com/nareis',
    'https://twitter.com/nareis',
    'https://linkedin.com/company/nareis'
  ]
};

export function createEventSchema(event: any): EventSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.date,
    endDate: event.endDate,
    location: {
      '@type': 'Place',
      name: event.location,
      address: event.address || event.location
    },
    description: event.description,
    organizer: {
      '@type': 'Organization',
      name: 'NAREIS'
    }
  };
}