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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

config({ path: path.resolve(__dirname, '../config/.env') });

const serviceAccount = require('../config/socialsaplings-firebase-adminsdk-f2ewh-0dd19032c2.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();

app.use('/src', express.static(path.join(__dirname, '../src')));
app.use(express.json());
app.use(cors());

// Route for the signin page
app.get('/signin', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/signin/signin.html'));
});

// Route for the signup page
app.get('/signup', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/signup/signup.html'));
});

app.use('/api/treeRecommendation', treeRecommendationRouter);

app.use('/api/tree-map', treeMapRouter);

app.get('/api/maps-key', (req, res) => {
  res.json({ key: process.env.MAPS_API_KEY });
});

app.use(express.static(path.join(__dirname, '../public')));

app.use(express.static('dist'));

app.use(express.static(path.join(__dirname, '../dist')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});