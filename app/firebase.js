// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7ePQN6_03sH1apONfUcyB0DgnWuPObQc",
  authDomain: "expense-tracker-f6810.firebaseapp.com",
  projectId: "expense-tracker-f6810",
  storageBucket: "expense-tracker-f6810.appspot.com",
  messagingSenderId: "779751570125",
  appId: "1:779751570125:web:4c308668efaad62baec784",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
