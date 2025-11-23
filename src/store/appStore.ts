import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import type { ParseResult } from '@/lib/parsers/types';

import { createSelectors } from './utils/createSelectors';

interface HistoryItem {
    id: string;
    date: string; // ISO date of conversion
    fileName: string;
    bankName: string;
    transactionCount: number;
    data: ParseResult;
}

interface AppState {
    history: HistoryItem[];
    addToHistory: (item: Omit<HistoryItem, 'id' | 'date'>) => void;
    clearHistory: () => void;
}

const useAppStoreBase = create<AppState>()(
    devtools(
        persist(
            (set) => ({
                history: [],
                addToHistory: (item) => {
                    const newItem: HistoryItem = {
                        ...item,
                        id: crypto.randomUUID(),
                        date: new Date().toISOString()
                    };

                    set(
                        (state) => ({
                            // Keep only last 10 items
                            history: [newItem, ...state.history].slice(0, 10)
                        }),
                        false,
                        { type: 'app-store/history/add' }
                    );
                },
                clearHistory: () => {
                    set({ history: [] }, false, { type: 'app-store/history/clear' });
                }
            }),
            { name: 'vypyska-storage' }
        ),
        { name: 'app-store' }
    )
);

export const useAppStore = createSelectors(useAppStoreBase);
