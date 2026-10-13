import { RouterProvider as RouterDomProvider } from 'react-router';
import { router } from '@/config/router/routes';

export function RouterProvider() {
  return <RouterDomProvider router={router} />;
}
