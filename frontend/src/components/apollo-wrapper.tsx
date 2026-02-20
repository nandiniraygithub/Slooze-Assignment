'use client';

import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { client } from '@/lib/apollo';

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
