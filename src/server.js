import express from 'express';
import admin from 'firebase-admin';
import path from 'path';
import cors from 'cors';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createRequire } from 'module';
import { treeRecommendationRouter } from './routes/treeRecommendation.js';
import { treeMapRouter } from './routes/treeMap.js';
import { postsRouter } from './routes/posts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

config({ path: path.resolve(__dirname, '../config/.env') });

const serviceAccount = require('../config/socialsaplings-firebase-adminsdk-f2ewh-0dd19032c2.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
const db = admin.firestore();

app.use('/src', express.static(path.join(__dirname, '../src')));
app.use(express.json());
app.use(cors());

app.use(async (req, res, next) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (idToken) {
      try {
          const decodedToken = await admin.auth().verifyIdToken(idToken);
          req.user = decodedToken;
      } catch (error) {
          console.error('Error while verifying token', error);
      }
  }

  next();
});

// Route for the signin page
app.get('/signin', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/signin/signin.html'));
});

// Route for the signup page
app.get('/signup', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/signup/signup.html'));
});

app.get('/tree-map', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/treeMap/treeMap.html'));
});

app.use('/api/treeRecommendation', treeRecommendationRouter);
app.use('/api/tree-map', treeMapRouter);
app.use('/api/posts', postsRouter);

app.get('/api/user-data', async (req, res) => {
  const uid = req.user.uid; // Obtained from the decoded token
  
  try {
      const userDoc = await db.collection('users').doc(uid).get();
      if (userDoc.exists) {
          console.log('User data:', userDoc.data());
          res.json(userDoc.data());
      } else {
          res.status(404).send('User not found');
      }

  } catch (error) {
      console.error('Failed to fetch user data:', error);
      res.status(500).send('Error fetching user data');
  }
});
  
app.get('/api/maps-key', (req, res) => {
  res.json({ key: process.env.MAPS_API_KEY });
});

app.get('/api/weather-key', (req, res) => {
  res.json({ key: process.env.WEATHER_API_KEY });
});

app.use(express.static(path.join(__dirname, '../public')));

export { db };

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});