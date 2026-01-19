// Temporary stub - allows app to compile during migration to Node.js backend
// This file will be removed once migration is complete

const mockResponse = { data: null, error: { message: 'Migrating to Node.js backend' } };

export const supabase = {
  from: (table: string) => ({
    select: (columns?: string) => ({
      ...mockResponse,
      eq: (column: string, value: any) => ({
        ...mockResponse,
        single: () => Promise.resolve(mockResponse),
        order: (column: string, options?: any) => Promise.resolve(mockResponse),
        limit: (count: number) => ({
          ...mockResponse,
          single: () => Promise.resolve(mockResponse),
        }),
      }),
      order: (column: string, options?: any) => ({
        ...mockResponse,
        limit: (count: number) => Promise.resolve(mockResponse),
      }),
      gte: (column: string, value: any) => ({
        ...mockResponse,
        order: (column: string, options?: any) => Promise.resolve(mockResponse),
      }),
      in: (column: string, values: any[]) => Promise.resolve(mockResponse),
      single: () => Promise.resolve(mockResponse),
      then: (resolve: any) => resolve(mockResponse),
    }),
    insert: (data: any) => Promise.resolve(mockResponse),
    update: (data: any) => ({
      ...mockResponse,
      eq: (column: string, value: any) => Promise.resolve(mockResponse),
    }),
    delete: () => ({
      ...mockResponse,
      eq: (column: string, value: any) => Promise.resolve(mockResponse),
    }),
    upsert: (data: any) => Promise.resolve(mockResponse),
  }),
  functions: {
    invoke: (functionName: string, options?: any) => Promise.resolve(mockResponse),
  },
  storage: {
    from: (bucket: string) => ({
      upload: (path: string, file: any, options?: any) => Promise.resolve(mockResponse),
      getPublicUrl: (path: string) => ({ data: { publicUrl: '' } }),
      remove: (paths: string[]) => Promise.resolve(mockResponse),
    }),
  },
  rpc: (functionName: string, params?: any) => Promise.resolve(mockResponse),
};

export const debugSession = () => console.log('Debug: Using stub supabase client');
