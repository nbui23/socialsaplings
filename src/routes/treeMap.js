import express from 'express';
import { db } from '../server.js';

const router = express.Router();

// API endpoint to get tree data
router.get('/data', async (req, res) => {
    try {
        const treeMarkersRef = db.collection('treeMarkers');
        const snapshot = await treeMarkersRef.get();
        const trees = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(trees);
    } catch (error) {
        console.error("Error fetching tree data: ", error);
        res.status(500).send(error);
    }
});

// API endpoint to add a new tree marker
router.post('/add', async (req, res) => {
    try {
        const newTreeMarker = req.body;
        const docRef = await db.collection('treeMarkers').add(newTreeMarker);
        res.status(201).send({ success: true, id: docRef.id });
    } catch (error) {
        console.error("Error adding new tree marker: ", error);
        res.status(500).send({ success: false, error: error.message });
    }
});

export { router as treeMapRouter };
