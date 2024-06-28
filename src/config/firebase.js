// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDY37U8vEZHtowrSpRkb0v6rwzwepMgM8w",
  authDomain: "test-project-30774.firebaseapp.com",
  projectId: "test-project-30774",
  storageBucket: "test-project-30774.appspot.com",
  messagingSenderId: "28081857759",
  appId: "1:28081857759:web:282561482c96cd9b2db56a",
  measurementId: "G-QSYH31XS0R",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
// const analytics = getAnalytics(app);
