import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 🔒 THE FIREWALL FIX: Force Long Polling
// Many adblockers, Brave Shields, and corporate firewalls block Firestore's 
// default "Streaming" connection. Forcing "Long Polling" uses standard HTTPS 
// requests which bypasses most of these blocks.
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

const auth = getAuth(auth ? undefined : app);
// Note: We use a ternary above just to ensure we don't re-init auth if it exists, 
// though getAuth(app) is already a singleton.
const finalAuth = getAuth(app);

export { app, db, auth: finalAuth };
