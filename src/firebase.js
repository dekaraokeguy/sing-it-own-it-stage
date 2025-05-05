
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBnrQ7cLLX3XqFhyzGF8a3srwm8CEhkGys",
  authDomain: "sing-it-own-it.firebaseapp.com",
  projectId: "sing-it-own-it",
  storageBucket: "sing-it-own-it.appspot.com",
  messagingSenderId: "1076286272302",
  appId: "1:1076286272302:web:c355c494c2c3a258e6c0bf",
  measurementId: "G-2GH9V34K0W"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
