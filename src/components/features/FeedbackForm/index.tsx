import { AlertCircle, Loader2, Send, Star } from 'lucide-react';
import type { FC } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { FeedbackSource } from '@/constants';

import { useFeedbackForm } from './useFeedbackForm';

interface FeedbackFormProps {
    source: FeedbackSource;
    className?: string;
    onSuccess?: () => void;
}

export const FeedbackForm: FC<FeedbackFormProps> = ({ source, className, onSuccess }) => {
    const {
        rating,
        isSubmitting,
        isSuccess,
        error,
        register,
        handleSubmit,
        handleRating,
        handleReset,
        errors
    } = useFeedbackForm({ source, onSuccess });

    if (isSuccess) {
        return (
            <Card className="border-green-200 bg-green-50 text-green-800">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <h3 className="mb-2 text-lg font-bold">Дякуємо за відгук!</h3>
                    <p>Ваша думка дуже важлива для нас.</p>
                    <Button variant="link" className="mt-2 text-green-700" onClick={handleReset}>
                        Відправити ще один
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
            {error && (
                <div
                    className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800"
                    role="alert"
                >
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                    <div className="flex-1 text-sm">
                        <p className="font-medium">Помилка відправки</p>
                        <p className="mt-1">{error}</p>
                    </div>
                </div>
            )}

            <div className="space-y-2">
                <Label>Оцінка (необов'язково)</Label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => handleRating(star)}
                            disabled={isSubmitting}
                            className={`transition-colors ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            aria-label={`Оцінити ${star} зірок`}
                        >
                            <Star className="h-6 w-6 fill-current" />
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    {...register('email')}
                    type="email"
                    placeholder="Ваш email (example@gmail.com)"
                    className={errors.email ? 'border-red-500' : ''}
                    disabled={isSubmitting}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="message">Повідомлення</Label>
                <Textarea
                    id="message"
                    {...register('message')}
                    className={errors.message ? 'border-red-500' : ''}
                    placeholder="Що можна покращити? Або просто ваші враження..."
                    disabled={isSubmitting}
                />
                {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                    <>
                        <Loader2
                            className="mr-2 h-4 w-4 animate-spin"
                            aria-label="Відправка в процесі"
                        />
                        Відправляється...
                    </>
                ) : (
                    <>
                        <Send className="mr-2 h-4 w-4" aria-hidden="true" />
                        Надіслати відгук
                    </>
                )}
            </Button>
        </form>
    );
};
