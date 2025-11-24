import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { FeedbackSource } from '@/constants';
import { db } from '@/lib/firebase';

import { createSelectors } from './utils/createSelectors';

export interface FeedbackData {
    email: string;
    message: string;
    rating?: number;
    source?: FeedbackSource;
}

interface FeedbackState {
    isSubmitting: boolean;
    error: string | null;
    sendFeedback: (data: FeedbackData) => Promise<void>;
    reset: () => void;
}

const useFeedbackStoreBase = create<FeedbackState>()(
    devtools(
        (set) => ({
            isSubmitting: false,
            error: null,
            sendFeedback: async (data: FeedbackData) => {
                set({ isSubmitting: true, error: null }, false, {
                    type: 'feedback-store/send/start'
                });

                try {
                    await addDoc(collection(db, 'feedbacks'), {
                        ...data,
                        createdAt: serverTimestamp(),
                        userAgent: navigator.userAgent
                    });

                    set({ isSubmitting: false, error: null }, false, {
                        type: 'feedback-store/send/success'
                    });
                } catch (error) {
                    console.error('Error sending feedback:', error);

                    const errorMessage =
                        error instanceof Error
                            ? error.message.includes('permission')
                                ? 'Недостатньо прав для відправки відгуку. Перевірте налаштування Firebase.'
                                : 'Не вдалося відправити відгук. Перевірте підключення до інтернету та спробуйте ще раз.'
                            : 'Не вдалося відправити відгук. Спробуйте ще раз пізніше.';

                    set({ isSubmitting: false, error: errorMessage }, false, {
                        type: 'feedback-store/send/error'
                    });

                    throw new Error(errorMessage);
                }
            },
            reset: () => {
                set({ isSubmitting: false, error: null }, false, {
                    type: 'feedback-store/reset'
                });
            }
        }),
        { name: 'feedback-store' }
    )
);

export const useFeedbackStore = createSelectors(useFeedbackStoreBase);
