// Temporary stub - allows app to compile during migration to Node.js backend
// This file will be removed once migration is complete
// Returns empty data without errors to prevent toasts

const mockResponse = { data: null, error: null };

// Helper to create chainable query methods that properly handle chaining
const createChainableMethods = (): any => {
  const chainable = {
    ...mockResponse,
    eq: (column: string, value: any) => createChainableMethods(),
    gte: (column: string, value: any) => createChainableMethods(),
    lte: (column: string, value: any) => createChainableMethods(),
    gt: (column: string, value: any) => createChainableMethods(),
    lt: (column: string, value: any) => createChainableMethods(),
    in: (column: string, values: any[]) => createChainableMethods(),
    order: (column: string, options?: any) => createChainableMethods(),
    limit: (count: number) => createChainableMethods(),
    single: () => Promise.resolve(mockResponse),
    then: (resolve: any) => Promise.resolve(mockResponse).then(resolve),
    catch: (reject: any) => Promise.resolve(mockResponse).catch(reject),
  };
  return chainable;
};

export const supabase = {
  from: (table: string) => ({
    select: (columns?: string) => createChainableMethods(),
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
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    signInWithPassword: (credentials: any) => Promise.resolve({ data: { user: null, session: null }, error: null }),
    signUp: (credentials: any) => Promise.resolve({ data: { user: null, session: null }, error: null }),
    updateUser: (updates: any) => Promise.resolve({ data: { user: null }, error: null }),
    resend: (options: any) => Promise.resolve({ error: null }),
  },
};

export const debugSession = () => console.log('Debug: Using stub supabase client');
