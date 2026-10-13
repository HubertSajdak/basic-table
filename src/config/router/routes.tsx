import { DashboardLayout } from '@/layouts/DashboardLayout';
import { createBrowserRouter, Outlet, type RouteObject } from 'react-router';
import { routes as peopleRoutes } from '@/features/people/config/route';
import { RouteLoader } from '@/shared/utils/routeLoaders';
import { routes as homeRoutes } from '@/features/home/config/route';
const routes: RouteObject[] = [
  {
    element: (
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    ),
    children: [
      {
        path: '/',
        loader: RouteLoader.redirectToMainPage,
      },
      ...peopleRoutes,
      ...homeRoutes,
    ],
  },
];

export const router = createBrowserRouter(routes);
