import { auth, db, createUserWithEmailAndPassword, doc, setDoc, serverTimestamp } from '../../src/firebase/firebase.js';

document.getElementById('signin').addEventListener('click', () => {
    window.location = '../signin/signin.html';
});

document.getElementById('signup-form').addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the default form submission

    const email = document.getElementById('user-email').value;
    const password = document.getElementById('user-password').value;
    const username = document.getElementById('username').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // User account created, now add username and other info to Firestore
            return setDoc(doc(db, 'users', userCredential.user.uid), {
                username: username,
                profilePicture: 'default-image-url',
                joinedDate: serverTimestamp(),
                CO2Absorbed: 0,
                TreesPlanted: 0,
            });
        })
        .then(() => {
            console.log("User signed up and additional information stored.");
        })
        .catch((error) => {
            console.error("Error signing up:", error);
        });
});
