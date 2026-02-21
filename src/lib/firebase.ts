import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB9G-zJyIg1Ur1KGGsWoeWDDQQhPCI10bI",
    authDomain: "financial-tracker-a9357.firebaseapp.com",
    projectId: "financial-tracker-a9357",
    storageBucket: "financial-tracker-a9357.firebasestorage.app",
    messagingSenderId: "489079524100",
    appId: "1:489079524100:web:d18280d358a070101dde51",
    measurementId: "G-93QNN37Z72"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
