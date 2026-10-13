import { redirect } from 'react-router';

export const RouteLoader = {
  redirectToMainPage: () => {
    return redirect('/people');
  },
};
