import { getAnalytics, logEvent } from 'firebase/analytics';
import { app } from './config';

let analyticsInstance = null;

// Initialize analytics only in browser environment
if (typeof window !== 'undefined') {
  try {
    analyticsInstance = getAnalytics(app);
  } catch (error) {
    console.error('Analytics initialization failed:', error);
  }
}

export const logAnalyticsEvent = (eventName, eventParams = {}) => {
  if (!analyticsInstance) {
    console.warn('Analytics not initialized');
    return;
  }
  
  try {
    logEvent(analyticsInstance, eventName, eventParams);
  } catch (error) {
    console.error('Failed to log analytics event:', error);
  }
}; 