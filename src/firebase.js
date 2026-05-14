import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDUZlwwUID-_s1fNTJrL00c3LhC8pCQp54",
  authDomain: "authentication-for-sm.firebaseapp.com",
  projectId: "authentication-for-sm",
  storageBucket: "authentication-for-sm.firebasestorage.app",
  messagingSenderId: "326731515746",
  appId: "1:326731515746:web:a22c6de8ec83d16a40ce3b",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
