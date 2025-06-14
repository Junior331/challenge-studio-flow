import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { Layout } from '../components/layout';
import Studio from '../pages/Studio';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Studio />,
      },
    ],
  },
]);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
