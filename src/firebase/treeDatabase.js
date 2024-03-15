import { initializeApp } from 'firebase/app';
import { getFirestore, getDocs, query, where, addDoc, collection } from 'firebase/firestore';

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

let treeSpecies = [
  {
    name: "Pine",
    idealSoilClasses: ["Arenosols"],
    idealClimateClasses: ["cold", "temperate"],
    idealTopographyClasses: ["low", "medium"],
    idealBiodiversityClasses: ["low", "medium"]
  },
  {
    name: "Willow",
    idealSoilClasses: ["Gleysols"],
    idealClimateClasses: ["temperate", "hot"],
    idealTopographyClasses: ["low"],
    idealBiodiversityClasses: ["high"]
  },
  {
    name: "Beech",
    idealSoilClasses: ["Luvisols"],
    idealClimateClasses: ["temperate"],
    idealTopographyClasses: ["medium"],
    idealBiodiversityClasses: ["medium", "high"]
  },
  {
    name: "Maple",
    idealSoilClasses: ["Podzols"],
    idealClimateClasses: ["temperate"],
    idealTopographyClasses: ["medium", "high"],
    idealBiodiversityClasses: ["medium"]
  },
  {
    name: "Birch",
    idealSoilClasses: ["Podzols"],
    idealClimateClasses: ["cold"],
    idealTopographyClasses: ["medium", "high"],
    idealBiodiversityClasses: ["medium"]
  },
  {
    name: "Oak",
    idealSoilClasses: ["Vertisols"],
    idealClimateClasses: ["temperate"],
    idealTopographyClasses: ["low", "medium"],
    idealBiodiversityClasses: ["low", "medium"]
  },
  {
    name: "Sugar Maple",
    idealSoilClasses: ["Cambisols"],
    idealClimateClasses: ["temperate"],
    idealTopographyClasses: ["low", "medium"],
    idealBiodiversityClasses: ["high"]
  },
  {
    name: "White Pine",
    idealSoilClasses: ["Cambisols"],
    idealClimateClasses: ["cold", "temperate"],
    idealTopographyClasses: ["low", "medium"],
    idealBiodiversityClasses: ["medium"]
  },
  {
    name: "Northern Red Oak",
    idealSoilClasses: ["Cambisols"],
    idealClimateClasses: ["temperate"],
    idealTopographyClasses: ["low", "medium"],
    idealBiodiversityClasses: ["medium", "high"]
  }  
];

treeSpecies.forEach(async species => {
  let q = query(collection(db, "treeSpecies"), where("name", "==", species.name));
  let querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    // No matching documents, so add the new document
    addDoc(collection(db, "treeSpecies"), species)
      .then(docRef => console.log("Document written with ID: ", docRef.id))
      .catch(error => console.error("Error adding document: ", error));
  } else {
    console.log('Document with the same name already exists');
  }
});
