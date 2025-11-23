import type { FC } from 'react';
import { Outlet } from 'react-router-dom';

export const Main: FC = () => {
    return (
        <main className="container mx-auto flex-1 px-4 py-8">
            <Outlet />
        </main>
    );
};
