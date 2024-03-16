import express from 'express';
import fetch from 'node-fetch';
import { config } from 'dotenv';

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore'; 

const firebaseConfig = {
    apiKey: "AIzaSyCxuxa5bFTXVYF_NRH9HrRV_mebUzQ05OM",
    authDomain: "socialsaplings.firebaseapp.com",
    projectId: "socialsaplings",
    storageBucket: "socialsaplings.appspot.com",
    messagingSenderId: "387358176449",
    appId: "1:387358176449:web:170965d7d094b37c445040",
    measurementId: "G-WB4L946TCH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const router = express.Router();
config();
const weatherKey = process.env.WEATHER_API_KEY;

async function getTreeSpecies() {
    const treeSpeciesCollection = collection(db, 'treeSpecies');
    const treeSpeciesSnapshot = await getDocs(treeSpeciesCollection);
    const treeSpeciesList = treeSpeciesSnapshot.docs.map(doc => doc.data());
    return treeSpeciesList;
}

// Endpoint to receive geolocation data
router.post('/geolocation', (req, res) => {
    const { lat, lon } = req.body;

    if (lat && lon) {
        console.log(`Received geolocation data: lat ${lat}, lon ${lon}`);
        res.json({
            success: true,
            message: 'Geolocation data received successfully.'
        });
    } else {
        res.status(400).json({
            success: false,
            message: 'Both lat and lon are required.'
        });
    }
});

async function fetchSoilClass(lat, lon) {
    const response = await fetch(`https://rest.isric.org/soilgrids/v2.0/classification/query?lon=${lon}&lat=${lat}&number_classes=0`);
    if (!response.ok) throw new Error('Failed to fetch soil data.');
    return response.json();
}

function classifySoilData(soilData) {
    const wbClass = soilData.wrb_class_name;
    return wbClass;
}

async function fetchClimateData(lat, lon) {
    const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherKey}`);
    if (!response.ok) throw new Error('Failed to fetch climate data.');
    return response.json();
}

function classifyClimateData(climateData) {
    const temperature = climateData.main.temp - 273.15; // kelvin to celsius
    if (temperature < 10) return 'cold';
    if (temperature < 20) return 'temperate';
    return 'hot';
}

async function fetchTopographyData(lat, lon) {
    const response = await fetch(`https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lon}`);
    if (!response.ok) throw new Error('Failed to fetch topography data.');
    return response.json();
}

function classifyTopographyData(topographyData) {
    const elevation = topographyData.results[0].elevation;
    if (elevation < 200) return 'low';
    if (elevation < 2000) return 'medium';
    return 'high';
}

async function fetchBiodiversityData(lat, lon) {
    const response = await fetch(`https://api.gbif.org/v1/occurrence/search?lat=${lat}&lon=${lon}`);
    if (!response.ok) throw new Error('Failed to fetch biodiversity data.');
    return response.json();
}

function classifyBiodiversityData(biodiversityData) {
    if (biodiversityData.count < 1000) return 'low';
    if (biodiversityData.count < 10000) return 'medium';
    return 'high';
}

// async function matchTreesToConditions(soilClass, climateClass, topographyClass, biodiversityClass) {
async function matchTreesToConditions(soilClass, topographyClass, biodiversityClass) {
    soilClass = soilClass.trim().toLowerCase();
    topographyClass = topographyClass.trim().toLowerCase();
    biodiversityClass = biodiversityClass.trim().toLowerCase();
    const treeSpecies = await getTreeSpecies();
    const matchingTrees = treeSpecies.filter(tree => {
        const soilMatch = tree.idealSoilClasses.map(value => value.toLowerCase()).includes(soilClass);
        const topographyMatch = tree.idealTopographyClasses.map(value => value.toLowerCase()).includes(topographyClass);
        const biodiversityMatch = tree.idealBiodiversityClasses.map(value => value.toLowerCase()).includes(biodiversityClass);

        return soilMatch && topographyMatch && biodiversityMatch;
    });
    return matchingTrees.map(tree => tree.name);
}
export { router as treeRecommendationRouter };

router.post('/', async (req, res) => {
    const { lat, lon } = req.body;

    if (!lat || !lon) {
        return res.status(400).json({
            success: false,
            message: 'Both lat and lon are required.'
        });
    }

    try {
        const soilData = await fetchSoilClass(lat, lon);
        // const climateData = await fetchClimateData(lat, lon);
        const topographyData = await fetchTopographyData(lat, lon);
        const biodiversityData = await fetchBiodiversityData(lat, lon);

        const soilClass = classifySoilData(soilData);
        // const climateClass = classifyClimateData(climateData);
        const topographyClass = classifyTopographyData(topographyData);
        const biodiversityClass = classifyBiodiversityData(biodiversityData);

        // const treeRecommendation = await matchTreesToConditions(soilClass, climateClass, topographyClass, biodiversityClass);
        const treeRecommendation = await matchTreesToConditions(soilClass, topographyClass, biodiversityClass)

        res.json({
            success: true,
            message: 'Tree recommendation generated successfully.',
            treeRecommendation
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate tree recommendation.'
        });
    }
});
