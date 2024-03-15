import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js';
import { getFirestore, doc, serverTimestamp, setDoc, query, where, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-storage.js';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCxuxa5bFTXVYF_NRH9HrRV_mebUzQ05OM",
    authDomain: "socialsaplings.firebaseapp.com",
    projectId: "socialsaplings",
    storageBucket: "socialsaplings.appspot.com",
    messagingSenderId: "387358176449",
    appId: "1:387358176449:web:170965d7d094b37c445040",
    measurementId: "G-WB4L946TCH"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage, signInWithEmailAndPassword, createUserWithEmailAndPassword, doc, serverTimestamp, setDoc, query, where, collection, getDocs };