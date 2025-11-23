import { Suspense, type ReactNode } from 'react';

interface WithSuspenseOptions {
    showLoader?: boolean;
}

export const WithSuspense = (
    element: ReactNode,
    options: WithSuspenseOptions = { showLoader: true }
) => (
    <Suspense
        fallback={
            options.showLoader ? (
                <div className="flex min-h-screen items-center justify-center">
                    <div className="text-center">
                        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                        <p className="text-muted-foreground text-sm">Завантаження...</p>
                    </div>
                </div>
            ) : null
        }
    >
        {element}
    </Suspense>
);
