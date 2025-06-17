import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { Layout } from '../components/templates';
import Studio from '../pages/Studio';
import { Actors } from '../pages/Actors';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Studio />,
      },
      {
        path: '/actors',
        element: <Actors />,
      },
    ],
  },
]);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
