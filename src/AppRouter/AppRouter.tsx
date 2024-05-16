import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Loader from './../assets/images/Loader.svg?react';
import Landing from '../components/Landing';

type RoutesProps = {
  path: string;
  element: React.ReactNode;
  requiresToken?: boolean;
};

const PlayPage = React.lazy(() => import('../pages/PlayPage'));
const Layout = React.lazy(() => import('./../components/Layout'))

const routes: RoutesProps[] = [
  {
    path: '/play',
    element: <PlayPage />,
  },
];

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route
        key={'/'}
        path={'/'}
        element={<Landing />} 
      />
      <Route element={<Layout />}>
        {routes.map((route) => {
          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center h-screen">
                        <Loader />
                    </div>
                  }
                >
                  {route.element}
                </Suspense>
              }
            />
          );
        })}
        <Route path={'*'} element={<Navigate to={'/'} />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
