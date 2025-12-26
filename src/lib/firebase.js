// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDsYQnYlQjDmOznZxatZSim9VSViuvdq9Q",
  authDomain: "unilinka-43300.firebaseapp.com",
  projectId: "unilinka-43300",
  storageBucket: "unilinka-43300.firebasestorage.app",
  messagingSenderId: "291411061592",
  appId: "1:291411061592:web:89c815a795cefad603932d",
  measurementId: "G-DJN0ZL3BQZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics only in browser environment
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app;

