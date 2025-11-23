import { createBrowserRouter } from 'react-router-dom';

import { App } from '@/App';
import { WithSuspense } from '@/hocs/WithSuspense';
import { ConverterPage } from '@/pages/ConverterPage';
import { DevPlayground } from '@/pages/DevPlayground';
import { NotFoundPage } from '@/pages/NotFoundPage';

import { RoutesPath } from './routes';

export const router = createBrowserRouter([
    {
        path: RoutesPath.Root,
        element: <App />,
        children: [
            {
                // index: true means that this route is the default route
                index: true,
                element: <ConverterPage />
            },
            {
                path: RoutesPath.NotFound,
                element: WithSuspense(<NotFoundPage />)
            },
            ...(import.meta.env.DEV
                ? [
                      {
                          path: RoutesPath.DevPlayground,
                          element: WithSuspense(<DevPlayground />)
                      }
                  ]
                : [])
        ]
    }
]);
