import { auth, signInWithEmailAndPassword } from '../../src/firebase/firebase.js';

document.getElementById('signup').addEventListener('click', () => {
    window.location = '../signup/signup.html';
});

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
            if (error.code === 'auth/invalid-login-credentials') {
                console.error("Invalid login credentials. Please check your email and password.");
            } else {
                console.error("Error signing in:", error);
            }
        });
});