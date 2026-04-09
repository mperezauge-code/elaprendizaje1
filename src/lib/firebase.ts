import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDK6moLSDjZS-Qf6rWLZ-DogsM9i-SkW-g",
  authDomain: "escuelita-ia-curs-1.firebaseapp.com",
  projectId: "escuelita-ia-curs-1",
  storageBucket: "escuelita-ia-curs-1.firebasestorage.app",
  messagingSenderId: "128468191273",
  appId: "1:128468191273:web:98412f7718d75150d1f438"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
