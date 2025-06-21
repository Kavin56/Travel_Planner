import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAR9dq1akl2v_aEQmA0h9ucDm_yPAXB2N4",
  authDomain: "awesomeeds.firebaseapp.com",
  projectId: "awesomeeds",
  storageBucket: "awesomeeds.firebasestorage.app",
  messagingSenderId: "842763416031",
  appId: "1:842763416031:web:9b8c3c3a0a1a50a464146a",
  measurementId: "G-RKS5P9P34F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Analytics (optional - for tracking)
export const analytics = getAnalytics(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app; 