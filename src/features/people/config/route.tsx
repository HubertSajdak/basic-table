import type { RouteObject } from 'react-router';
import { PeopleList } from '../pages/PeopleList';

export const routes: RouteObject[] = [
  {
    path: 'people',
    element: <PeopleList />,
  },
];
