import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDyzIuow1wVwnysfY2WHGUeBhKBGDXVZuc",
  authDomain: "ultimate-analytics-9d0be.firebaseapp.com",
  projectId: "ultimate-analytics-9d0be",
  storageBucket: "ultimate-analytics-9d0be.firebasestorage.app",
  messagingSenderId: "108249184507",
  appId: "1:108249184507:web:d4653164cec30c6fecd85e",
  measurementId: "G-85NGN7TB3M"
};

let analytics = null;
let app = null;

// Initialize Firebase when the DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    try {
      app = initializeApp(firebaseConfig);
      analytics = getAnalytics(app);
    } catch (error) {
      console.error('Firebase initialization error:', error);
    }
  });
}

export const logAnalyticsEvent = (eventName, params = {}) => {
  if (!analytics) {
    console.warn('Analytics not initialized yet');
    return;
  }

  try {
    const enrichedParams = {
      ...params,
      app_name: 'MonadFaucet'
    };
    logEvent(analytics, eventName, enrichedParams);
  } catch (error) {
    console.error('Failed to log analytics event:', error);
  }
};
