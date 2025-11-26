import { logEvent } from 'firebase/analytics';

import { getAnalyticsInstance } from './firebase';

export const trackPageView = () => {
    const analytics = getAnalyticsInstance();
    if (!analytics) {
        return;
    }

    try {
        logEvent(analytics, 'page_view', {
            page_path: '/',
            page_title: 'Vypyska.pro - Конвертер виписок'
        });
    } catch (error) {
        console.error('[Analytics] Failed to track page view:', error);
    }
};

export const trackReportGenerated = (params: {
    format: 'txt' | 'xml';
    bank: string;
    transaction_count: number;
}) => {
    const analytics = getAnalyticsInstance();
    if (!analytics) {
        return;
    }

    try {
        logEvent(analytics, 'report_generated', {
            format: params.format,
            bank: params.bank,
            transaction_count: params.transaction_count
        });
    } catch (error) {
        console.error('[Analytics] Failed to track report generation:', error);
    }
};
