const admin = require('firebase-admin');

const serviceAccount = require('.../config/socialsaplings-firebase-adminsdk-f2ewh-0dd19032c2.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://socialsaplings.appspot.com"
});

const db = admin.firestore();

module.exports = { admin, db };