import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAILLh8tr8F6bRQN2Ycx2UCQWY4QrGaYsk",
  authDomain: "mean-dfd43.firebaseapp.com",
  projectId: "mean-dfd43",
  storageBucket: "mean-dfd43.appspot.com", // SAI storageBucket sửa lại đúng format
  messagingSenderId: "519931404779",
  appId: "1:519931404779:web:91d63b164d5af57a89b9ae",
  measurementId: "G-VMMLC04F9V",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
console.log("Firebase App:", app);
console.log("Firebase Auth:", auth);

export { auth };
