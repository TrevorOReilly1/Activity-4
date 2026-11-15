import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

//REPLACE THE CODE BELOW WITH YOUR CONFIG FROM FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyDLwRQ4Ce5I8Qx-reKUlYQPDyuVOntZy6s",
  authDomain: "subscriptions-15008.firebaseapp.com",
  projectId: "subscriptions-15008",
  storageBucket: "subscriptions-15008.firebasestorage.app",
  messagingSenderId: "828115355594",
  appId: "1:828115355594:web:3576cf8d63d272d2657133"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);
export default db;
