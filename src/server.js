const express = require('express');
const admin = require('firebase-admin');

const serviceAccount = require('../config/socialsaplings-firebase-adminsdk-f2ewh-0dd19032c2.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(express.json()); // For parsing application/json

app.get('/', (req, res) => {
    res.send('Hello World!');
  });
  
  // Example API route
  app.get('/api/data', (req, res) => {
    // Logic to fetch and send data (e.g., from Firebase)
    res.json({ message: "Here's some data." });
  });
  
  app.use(express.static('public'));

  const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
