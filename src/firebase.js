// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD6g_TyFdFB8zvUMU5r5jg-fVeZC6dmM_c",
  authDomain: "agrovid-fc435.firebaseapp.com",
  projectId: "agrovid-fc435",
  storageBucket: "agrovid-fc435.appspot.com",
  messagingSenderId: "149705864372",
  appId: "1:149705864372:web:f32584521c5261a02853e1",
  measurementId: "G-0MG5FXHWQX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
