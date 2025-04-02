// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_i6lkMzZ_hRFQ1VEUKsFFohrwgnIkjnA",
  authDomain: "gamified-613fd.firebaseapp.com",
  projectId: "gamified-613fd",
  storageBucket: "gamified-613fd.firebasestorage.app",
  messagingSenderId: "632516326863",
  appId: "1:632516326863:web:13651eb6bb8f167b3a0eba",
  measurementId: "G-Z19G4YSS3D",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
