export const FEEDBACK_SOURCES = {
    FOOTER: 'footer',
    CONVERSION_SUCCESS: 'conversion_success'
} as const;

export type FeedbackSource = (typeof FEEDBACK_SOURCES)[keyof typeof FEEDBACK_SOURCES];
