import type { FC } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { RoutesPath } from '@/router/routes';

export const NotFoundPage: FC = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <h1 className="absolute text-[12rem] font-extrabold tracking-tighter text-primary/5 pointer-events-none select-none">
                404
            </h1>
            <div className="relative z-10 flex flex-col items-center gap-4 text-center px-4">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                    Сторінку не знайдено
                </h2>
                <p className="max-w-[500px] text-lg text-muted-foreground">
                    Вибачте, але сторінка, яку ви шукаєте, не існує або була переміщена.
                </p>
                <Button asChild size="lg" className="mt-4">
                    <Link to={RoutesPath.Root}>Повернутися на головну</Link>
                </Button>
            </div>
        </div>
    );
};

export default NotFoundPage;
