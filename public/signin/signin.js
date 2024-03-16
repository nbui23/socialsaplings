import { auth, signInWithEmailAndPassword } from '../../src/firebase/firebase.js';

document.getElementById('signin-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('user-email').value;
    const password = document.getElementById('user-password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // User signed in successfully
            console.log("User signed in: ", userCredential.user);

            // Get the ID token of the user
            userCredential.user.getIdToken().then(idToken => {
                // Store the ID token in localStorage for later use
                localStorage.setItem('idToken', idToken);

                window.location.href = '/tree-map';
            });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Error signing in:", errorCode, errorMessage);
            // Handle errors here, such as displaying a message to the user
        });
});

document.getElementById('signup').addEventListener('click', () => {
    window.location.href = '../signup/signup.html';
});
