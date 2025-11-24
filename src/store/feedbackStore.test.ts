import { addDoc } from 'firebase/firestore';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FEEDBACK_SOURCES } from '@/constants';

import { useFeedbackStore } from './feedbackStore';

vi.mock('@/lib/firebase', () => ({
    db: {}
}));

vi.mock('firebase/firestore', () => ({
    collection: vi.fn(() => ({})),
    addDoc: vi.fn(),
    serverTimestamp: vi.fn(() => ({ seconds: Date.now(), nanoseconds: 0 }))
}));

describe('feedbackStore', () => {
    beforeEach(() => {
        useFeedbackStore.getState().reset();
    });

    it('should have initial state', () => {
        const state = useFeedbackStore.getState();
        expect(state.isSubmitting).toBe(false);
        expect(state.error).toBe(null);
    });

    it('should set isSubmitting to true when sending feedback', async () => {
        vi.mocked(addDoc).mockResolvedValue({ id: 'test-id' } as never);

        const sendFeedback = useFeedbackStore.getState().sendFeedback;
        const promise = sendFeedback({
            email: 'test@example.com',
            message: 'Test message',
            source: FEEDBACK_SOURCES.FOOTER
        });

        expect(useFeedbackStore.getState().isSubmitting).toBe(true);
        expect(useFeedbackStore.getState().error).toBe(null);

        await promise;

        expect(useFeedbackStore.getState().isSubmitting).toBe(false);
        expect(useFeedbackStore.getState().error).toBe(null);
    });

    it('should handle sendFeedback success', async () => {
        vi.mocked(addDoc).mockResolvedValue({ id: 'test-id' } as never);

        const sendFeedback = useFeedbackStore.getState().sendFeedback;
        await sendFeedback({
            email: 'test@example.com',
            message: 'Test message',
            rating: 5,
            source: FEEDBACK_SOURCES.CONVERSION_SUCCESS
        });

        expect(addDoc).toHaveBeenCalled();
        expect(useFeedbackStore.getState().isSubmitting).toBe(false);
        expect(useFeedbackStore.getState().error).toBe(null);
    });

    it('should handle sendFeedback error with permission message', async () => {
        const permissionError = new Error('permission denied');
        vi.mocked(addDoc).mockRejectedValue(permissionError);

        const sendFeedback = useFeedbackStore.getState().sendFeedback;

        await expect(
            sendFeedback({
                email: 'test@example.com',
                message: 'Test message',
                source: FEEDBACK_SOURCES.FOOTER
            })
        ).rejects.toThrow('Недостатньо прав для відправки відгуку');

        expect(useFeedbackStore.getState().isSubmitting).toBe(false);
        expect(useFeedbackStore.getState().error).toBe(
            'Недостатньо прав для відправки відгуку. Перевірте налаштування Firebase.'
        );
    });

    it('should handle sendFeedback error with generic message', async () => {
        const genericError = new Error('Network error');
        vi.mocked(addDoc).mockRejectedValue(genericError);

        const sendFeedback = useFeedbackStore.getState().sendFeedback;

        await expect(
            sendFeedback({
                email: 'test@example.com',
                message: 'Test message',
                source: FEEDBACK_SOURCES.FOOTER
            })
        ).rejects.toThrow('Не вдалося відправити відгук');

        expect(useFeedbackStore.getState().isSubmitting).toBe(false);
        expect(useFeedbackStore.getState().error).toBe(
            'Не вдалося відправити відгук. Перевірте підключення до інтернету та спробуйте ще раз.'
        );
    });

    it('should handle sendFeedback with unknown error', async () => {
        vi.mocked(addDoc).mockRejectedValue('Unknown error');

        const sendFeedback = useFeedbackStore.getState().sendFeedback;

        await expect(
            sendFeedback({
                email: 'test@example.com',
                message: 'Test message',
                source: FEEDBACK_SOURCES.FOOTER
            })
        ).rejects.toThrow('Не вдалося відправити відгук');

        expect(useFeedbackStore.getState().isSubmitting).toBe(false);
        expect(useFeedbackStore.getState().error).toBe(
            'Не вдалося відправити відгук. Спробуйте ще раз пізніше.'
        );
    });

    it('should reset state', () => {
        useFeedbackStore.setState({ isSubmitting: true, error: 'Test error' });

        useFeedbackStore.getState().reset();

        expect(useFeedbackStore.getState().isSubmitting).toBe(false);
        expect(useFeedbackStore.getState().error).toBe(null);
    });
});
