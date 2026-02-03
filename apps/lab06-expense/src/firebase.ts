// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCZvVVeaVfF3Tt0cqJG_lr0WLgwLXOJEPs",
    authDomain: "weblab6-ca38b.firebaseapp.com",
    projectId: "weblab6-ca38b",
    storageBucket: "weblab6-ca38b.firebasestorage.app",
    messagingSenderId: "660325994094",
    appId: "1:660325994094:web:8c2c719828afd1a5fba07f",
    measurementId: "G-42708JBPNH"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);