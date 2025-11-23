import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import type { FeedbackSource } from '@/lib/constants';
import { sendFeedback } from '@/lib/services/feedback';

const feedbackSchema = z.object({
    email: z.string().email('Введіть коректний email'),
    message: z.string().min(10, 'Повідомлення має містити мінімум 10 символів'),
    rating: z.number().min(1).max(5).optional()
});

export type FeedbackFormValues = z.infer<typeof feedbackSchema>;

interface UseFeedbackFormProps {
    source: FeedbackSource;
    onSuccess?: () => void;
}

export const useFeedbackForm = ({ source, onSuccess }: UseFeedbackFormProps) => {
    const [rating, setRating] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset
    } = useForm<FeedbackFormValues>({
        resolver: zodResolver(feedbackSchema),
        mode: 'onBlur',
        defaultValues: {
            rating: 0
        }
    });

    const handleRating = (value: number) => {
        setRating(value);
        setValue('rating', value);
    };

    const onSubmit = async (data: FeedbackFormValues) => {
        setIsSubmitting(true);
        setError(null);
        try {
            if (!import.meta.env.VITE_FIREBASE_API_KEY) {
                console.warn('Firebase config missing, simulating success:', data);
                await new Promise((resolve) => setTimeout(resolve, 1000));
            } else {
                await sendFeedback({ ...data, source });
            }
            setIsSuccess(true);
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error(err);
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : 'Не вдалося відправити відгук. Спробуйте ще раз пізніше.';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setIsSuccess(false);
        setRating(0);
        setError(null);
        reset();
    };

    return {
        rating,
        isSubmitting,
        isSuccess,
        error,
        register,
        handleSubmit: handleSubmit(onSubmit),
        handleRating,
        handleReset,
        errors
    };
};
