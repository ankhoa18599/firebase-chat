// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCEuG1fckkrqUKc7rN78m6SCLzfE84sUvk",
    authDomain: "bbc-chat-2022.firebaseapp.com",
    projectId: "bbc-chat-2022",
    storageBucket: "bbc-chat-2022.appspot.com",
    messagingSenderId: "1089866834616",
    appId: "1:1089866834616:web:f148fde73d4b16edcd0a4d",
    measurementId: "G-RP7Z0BK64Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth()
const provider = new GoogleAuthProvider();
export { db, auth, provider };


