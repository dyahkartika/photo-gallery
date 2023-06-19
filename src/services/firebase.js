import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyD5ekEa8HuGitwJVqK0oM75h_LOODH59Bw",
  authDomain: "photo-gallery-f8c37.firebaseapp.com",
  projectId: "photo-gallery-f8c37",
  storageBucket: "photo-gallery-f8c37.appspot.com",
  messagingSenderId: "278178893696",
  appId: "1:278178893696:web:4fb59072b0c403569c7b65",
  measurementId: "G-T9DQ5W2MDM"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
