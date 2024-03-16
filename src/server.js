import express from 'express';
import admin from 'firebase-admin';
import path from 'path';
import cors from 'cors';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createRequire } from 'module';

// Routes
import { treeRecommendationRouter } from './routes/treeRecommendation.js';
import { treeMapRouter } from './routes/treeMap.js';
import { postsRouter } from './routes/posts.js';
import { usersRouter } from './routes/users.js';

// Environment and Firebase Configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: path.resolve(__dirname, '../config/.env') });
const require = createRequire(import.meta.url);
const serviceAccount = require('../config/socialsaplings-firebase-adminsdk-f2ewh-0dd19032c2.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Express Application Setup
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));

// Static Routes
app.use('/src', express.static(path.join(__dirname, '../src')));

// Authentication Middleware
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

// Utility for serving static HTML files
const serveStaticHtml = (relativePath) => (req, res) => {
  res.sendFile(path.join(__dirname, relativePath));
};

// Static HTML Routes
app.get('/signin', serveStaticHtml('../public/signin/signin.html'));
app.get('/signup', serveStaticHtml('../public/signup/signup.html'));
app.get('/tree-map', serveStaticHtml('../public/treeMap/treeMap.html'));
app.get('/media-feed', serveStaticHtml('../public/mediaFeed/mediaFeed.html'));

// API Routes
app.use('/api/treeRecommendation', treeRecommendationRouter);
app.use('/api/tree-map', treeMapRouter);
app.use('/api/posts', postsRouter);
app.use('/api/users', usersRouter);

// User Data Route
app.get('/api/user-data', async (req, res) => {
  if (!req.user) return res.status(401).send('Unauthorized');

  try {
    const userDoc = await admin.firestore().collection('users').doc(req.user.uid).get();
    if (!userDoc.exists) return res.status(404).send('User not found');

    const data = userDoc.data();
    res.json({
      userId: userDoc.id,
      ...data
    });
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    res.status(500).send('Error fetching user data');
  }
});

// API Keys Routes
app.get('/api/maps-key', (req, res) => res.json({ key: process.env.MAPS_API_KEY }));
app.get('/api/weather-key', (req, res) => res.json({ key: process.env.WEATHER_API_KEY }));

// Server Initialization
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { admin, db };
