import firebase from 'firebase/compat/app';
import { collection, doc, setDoc, getDocs, addDoc, deleteDoc, getFirestore, getDoc } from "firebase/firestore"; 
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Configure Firebase.
const config = {
  apiKey: "AIzaSyD8EcwY-enP40uMOK41581WZoflCPzU1sI",
  authDomain: "firmament-a19df.firebaseapp.com",
  databaseURL: "https://firmament-a19df-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "firmament-a19df",
  storageBucket: "firmament-a19df.appspot.com",
  messagingSenderId: "159820547097",
  appId: "1:159820547097:web:09a3ee1677029d8f901688",
  measurementId: "G-3SFMRPYT0B"
};
// Initialize Firebase
const app = initializeApp(config);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export const rtdb = getDatabase();
// Pass your reCAPTCHA v3 site key (public key) to activate(). Make sure this
// key is the counterpart to the secret key you set in the Firebase console.
//const appCheck = initializeAppCheck(app, {
//  provider: new ReCaptchaV3Provider('6LexzZojAAAAADqZJlTI5cgvKt7vRwz9h2O2QKL8'),

  // Optional argument. If true, the SDK automatically refreshes App Check
  // tokens as needed.
//  isTokenAutoRefreshEnabled: true
//});

