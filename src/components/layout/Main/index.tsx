import type { FC } from 'react';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { trackPageView } from '@/lib/analytics';
import { RoutesPath } from '@/router/routes';

export const Main: FC = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === RoutesPath.Root) {
            trackPageView();
        }
    }, [location.pathname]);

    return (
        <main className="container mx-auto flex-1 px-4 py-8">
            <Outlet />
        </main>
    );
};
