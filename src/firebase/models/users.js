const admin = require('./firebase/firebase-admin.js');
const db = admin.firestore();

function addUser(userData) {
  const userSchema = {
    username: userData.username || '',
    email: userData.email || '',
    profilePicture: userData.profilePicture || 'default-image-url',
    joinedDate: admin.firestore.FieldValue.serverTimestamp(),
    CO2Absorbed: 0,
    TreesPlanted: 0,
  };
  return db.collection('users').add(userSchema);
}
