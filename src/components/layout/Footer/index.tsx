import type { FC } from 'react';

import { TermsOfUseModal } from '@/components/features/TermsOfUseModal';

export const Footer: FC = () => {
    return (
        <footer className="border-t py-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Vypyska.pro. Зроблено в Україні 🇺🇦</p>
            <div className="mt-2">
                <TermsOfUseModal
                    trigger={
                        <button className="text-xs underline hover:text-foreground transition-colors">
                            Умови використання
                        </button>
                    }
                />
            </div>
        </footer>
    );
};
