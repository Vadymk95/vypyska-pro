import { getAnalytics, type Analytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

let analyticsInstance: Analytics | null = null;
let analyticsInitialized = false;

export const getAnalyticsInstance = (): Analytics | null => {
    if (analyticsInitialized) {
        return analyticsInstance;
    }

    if (typeof window !== 'undefined' && firebaseConfig.measurementId && !analyticsInstance) {
        try {
            analyticsInstance = getAnalytics(app);
            analyticsInitialized = true;
            return analyticsInstance;
        } catch (error) {
            console.error('[Firebase] Failed to initialize Firebase Analytics:', error);
            analyticsInitialized = true;
            return null;
        }
    }

    analyticsInitialized = true;
    return null;
};
