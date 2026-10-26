import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics, isSupported } from 'firebase/analytics'

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDSDYynkGI7mVAWfklaRBRem7xdAXg6GWE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ajeer-6ff1c.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ajeer-6ff1c",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ajeer-6ff1c.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "5028539350",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:5028539350:web:f8942815a970ae3cf25277",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-YXXGQXCGED"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

// Initialize Analytics conditionally
export let analytics = null
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app)
    }
  }).catch(() => {})
}

export default app
