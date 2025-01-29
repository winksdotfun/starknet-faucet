// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDyzIuow1wVwnysfY2WHGUeBhKBGDXVZuc",
  authDomain: "ultimate-analytics-9d0be.firebaseapp.com",
  projectId: "ultimate-analytics-9d0be",
  storageBucket: "ultimate-analytics-9d0be.firebasestorage.app",
  messagingSenderId: "108249184507",
  appId: "1:108249184507:web:d4653164cec30c6fecd85e",
  measurementId: "G-85NGN7TB3M"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Analytics
export const initAnalytics = async () => {
  if (await isSupported()) {
    return getAnalytics(app);
  }
  return null;
}; 