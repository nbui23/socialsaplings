import { initializeApp } from 'firebase/app';
import { getFirestore, addDoc, collection } from 'firebase/firestore';


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

const markerColors = {
    "Pine": "green",
    "Willow": "blue",
    "Beech": "yellow",
    "Maple": "orange",
    "Birch": "pink",
    "Oak": "red",
    "Sugar Maple": "purple",
    "White Pine": "grey",
    "Northern Red Oak": "brown"
};

const treeSpeciesNames = [
    "Pine", "Willow", "Beech", "Maple", "Birch",
    "Oak", "Sugar Maple", "White Pine", "Northern Red Oak"
];

const baseCoordinates = {
    lat: 45.355871922772636,
    lon: -75.92183765681023
};

const usernames = ["timmy", "taseenw", "vanessavo", "normanbui"];

const getRandomSpeciesName = () => {
    return treeSpeciesNames[Math.floor(Math.random() * treeSpeciesNames.length)];
};

const getRandomCoordinates = (base, variance = 0.01) => {
    return {
        lat: base.lat + (Math.random() - 0.5) * variance,
        lon: base.lon + (Math.random() - 0.5) * variance
    };
};

const getRandomUsername = () => {
    return usernames[Math.floor(Math.random() * usernames.length)];
};

const generateMarkers = async () => {
    for (let i = 0; i < 20; i++) {
        const speciesName = getRandomSpeciesName();
        const coords = getRandomCoordinates(baseCoordinates);

        console.log("Generated speciesName:", speciesName);

        const markerData = {
            speciesName: speciesName,
            latitude: coords.lat,
            longitude: coords.lon,
            date: new Date().toISOString(),
            username: getRandomUsername(),
            color: markerColors[speciesName],
        };

        console.log("Attempting to add marker data:", markerData);

        try {
            const docRef = await addDoc(collection(db, "treeMarkers"), markerData);
            console.log("Marker document written with ID: ", docRef.id);
        } catch (error) {
            console.error("Error adding marker document: ", error);
        }
    }
};


generateMarkers();