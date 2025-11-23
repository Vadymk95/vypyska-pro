import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

import type { FeedbackSource } from '@/lib/constants';
import { db } from '@/lib/firebase';

export interface FeedbackData {
    email: string;
    message: string;
    rating?: number;
    source?: FeedbackSource;
}

export const sendFeedback = async (data: FeedbackData): Promise<void> => {
    try {
        await addDoc(collection(db, 'feedbacks'), {
            ...data,
            createdAt: serverTimestamp(),
            userAgent: navigator.userAgent
        });
    } catch (error) {
        console.error('Error sending feedback:', error);
        // Re-throw with user-friendly message
        if (error instanceof Error) {
            throw new Error(
                error.message.includes('permission')
                    ? 'Недостатньо прав для відправки відгуку. Перевірте налаштування Firebase.'
                    : 'Не вдалося відправити відгук. Перевірте підключення до інтернету та спробуйте ще раз.'
            );
        }
        throw new Error('Не вдалося відправити відгук. Спробуйте ще раз пізніше.');
    }
};
