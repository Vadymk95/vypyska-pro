import type { FC } from 'react';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { trackPageView } from '@/lib/analytics';
import { RoutesPath } from '@/router/routes';

export const Main: FC = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === RoutesPath.Root) {
            // Lazy load analytics after page is interactive to avoid blocking render
            if (document.readyState === 'complete') {
                if ('requestIdleCallback' in window) {
                    requestIdleCallback(() => trackPageView(), { timeout: 2000 });
                } else {
                    setTimeout(() => trackPageView(), 1000);
                }
            } else {
                const handleLoad = () => {
                    if ('requestIdleCallback' in window) {
                        requestIdleCallback(() => trackPageView(), { timeout: 2000 });
                    } else {
                        setTimeout(() => trackPageView(), 1000);
                    }
                };
                window.addEventListener('load', handleLoad, { once: true });
                return () => window.removeEventListener('load', handleLoad);
            }
        }
    }, [location.pathname]);

    return (
        <main className="container mx-auto flex-1 px-4 py-8">
            <Outlet />
        </main>
    );
};
