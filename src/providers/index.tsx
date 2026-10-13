import { ReactQueryProvider } from './ReactQuery';
import { RouterProvider } from './Router';
export const CombinedProviders = () => (
  <ReactQueryProvider>
    <RouterProvider />
  </ReactQueryProvider>
);
