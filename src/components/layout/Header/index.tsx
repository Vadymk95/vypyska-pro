import { ShieldCheck } from 'lucide-react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';

import { RoutesPath } from '@/router/routes';

export const Header: FC = () => {
    return (
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link
                    to={RoutesPath.Root}
                    className="flex items-center text-xl font-bold tracking-tight"
                >
                    <span className="text-primary">Vypyska</span>.pro
                </Link>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <ShieldCheck
                        className="h-4 w-4 text-green-500"
                        aria-label="Іконка безпеки"
                    />
                    <span>Безпечно та Локально</span>
                </div>
            </div>
        </header>
    );
};
