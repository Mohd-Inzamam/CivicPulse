
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyDSBze03LKalRjXTQFkddsVndRqq4_uIfs",
    authDomain: "civicpulse-d4392.firebaseapp.com",
    projectId: "civicpulse-d4392",
    storageBucket: "civicpulse-d4392.firebasestorage.app",
    messagingSenderId: "141371799273",
    appId: "1:141371799273:web:ab00efc83c5f41532be278"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);