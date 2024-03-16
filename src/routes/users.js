import express from 'express';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

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

const router = express.Router();
const db = getFirestore(app);

router.get('/', async (req, res) => {
    // Get all db "users" collection
    try {
        const usersCollection = collection(db, 'users');
        const usersDocs = await getDocs(usersCollection);
        const users = usersDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(users);
    } catch (error) {
        console.error("Error fetching users: ", error);
        res.status(500).send(error);
    }
});

export { router as usersRouter }