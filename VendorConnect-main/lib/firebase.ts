"use client"

import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDw5Xw40Qcp7HH8qrY1pETZGZ9VBuzHP7Q",
  authDomain: "cervixcheck-5ce65.firebaseapp.com",
  projectId: "cervixcheck-5ce65",
  storageBucket: "cervixcheck-5ce65.firebasestorage.app",
  messagingSenderId: "325620099510",
  appId: "1:325620099510:web:44d1fc917e5e772eb43917",
  measurementId: "G-WGPF0R2P9Q",
}

// Initialize Firebase app
let app
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
} catch (error) {
  console.error("Firebase initialization error:", error)
  app = initializeApp(firebaseConfig)
}

// Initialize Firebase services with error handling
let auth
let db

try {
  auth = getAuth(app)
  db = getFirestore(app)
} catch (error) {
  console.error("Firebase services initialization error:", error)
  // Create mock services for fallback
  auth = null
  db = null
}

export { auth, db, app }
