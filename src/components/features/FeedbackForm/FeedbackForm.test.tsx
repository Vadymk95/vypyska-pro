import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ComponentProps } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { FEEDBACK_SOURCES } from '@/lib/constants';

import { FeedbackForm } from './';

vi.mock('@/store/feedbackStore', () => ({
    useFeedbackStore: {
        use: {
            sendFeedback: vi.fn(() => Promise.resolve()),
            isSubmitting: vi.fn(() => false),
            error: vi.fn(() => null),
            reset: vi.fn(() => {})
        }
    }
}));

vi.mock('lucide-react', () => ({
    Loader2: () => <div data-testid="loader" />,
    Send: () => <div data-testid="send-icon" />,
    Star: ({ className, ...props }: ComponentProps<'div'>) => (
        <div data-testid="star" className={className} {...props} />
    )
}));

describe('FeedbackForm', () => {
    it('renders form fields', () => {
        render(<FeedbackForm source={FEEDBACK_SOURCES.FOOTER} />);

        expect(screen.getByPlaceholderText(/Ваш email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Що можна покращити/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Надіслати відгук/i })).toBeInTheDocument();
    });

    it('shows validation errors for invalid email', async () => {
        render(<FeedbackForm source={FEEDBACK_SOURCES.FOOTER} />);

        const emailInput = screen.getByPlaceholderText(/Ваш email/i);
        const messageInput = screen.getByPlaceholderText(/Що можна покращити/i);

        fireEvent.change(messageInput, {
            target: { value: 'Valid message with enough characters' }
        });
        fireEvent.blur(messageInput);

        fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
        fireEvent.blur(emailInput);

        await waitFor(
            () => {
                expect(screen.getByText(/Введіть коректний email/i)).toBeInTheDocument();
            },
            { timeout: 2000 }
        );
    });

    it('shows validation errors for short message', async () => {
        render(<FeedbackForm source={FEEDBACK_SOURCES.FOOTER} />);

        const messageInput = screen.getByPlaceholderText(/Що можна покращити/i);
        const submitBtn = screen.getByRole('button', { name: /Надіслати відгук/i });

        fireEvent.change(messageInput, { target: { value: 'short' } });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(
                screen.getByText(/Повідомлення має містити мінімум 10 символів/i)
            ).toBeInTheDocument();
        });
    });

    it('handles rating selection', async () => {
        render(<FeedbackForm source={FEEDBACK_SOURCES.FOOTER} />);

        const stars = screen.getAllByTestId('star');
        fireEvent.click(stars[4].parentElement!);
    });
});
