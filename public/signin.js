import { auth, signInWithEmailAndPassword } from '../src/firebase/firebase.js';

document.getElementById('signin-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('user-email').value;
    const password = document.getElementById('user-password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("User signed in: ", user);
        })
        .catch((error) => {
            console.error("Error signing in:", error);
        });
});
