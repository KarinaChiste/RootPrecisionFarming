import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDWDvqaVuNmZPCn3pDjNluNzuLaAeEoU3Y",
  authDomain: "rootpercisionfarming.firebaseapp.com",
  projectId: "rootpercisionfarming",
  storageBucket: "rootpercisionfarming.firebasestorage.app",
  messagingSenderId: "46204651853",
  appId: "1:46204651853:web:01806d02ea582778b28f04",
  measurementId: "G-VBDQXVHD0V"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore database
export const db = getFirestore(app);