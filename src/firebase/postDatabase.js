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


let postData = [
    {
        title: "TEST event",
        user : "0tpO5XeYnLNRwP5vz2bivRQrc1v1",
        date : new Date().toISOString(),
        likes: ["cLXbp8kqWdhs4Ifn9uzKfpum40k1","gl3sTxGefdSCuh65DjbB2ClN2053","m6rADXvLnFVSSASkSdF9Fq8TshT2"],
        comments: [
            {
                comment: "excited!",
                user: "m6rADXvLnFVSSASkSdF9Fq8TshT2"
            },
            {
                comment: "lets gooo",
                user: "gl3sTxGefdSCuh65DjbB2ClN2053"
            }
        ],
        isEvent: true, 
        location: "Ottawa",
        textBody: "yabagabadoo",
        image: "https://i.redd.it/xkf6q3a92ty71.png",            
    },
    {
        title: "Tree Planting Event",
        user: "0tpO5XeYnLNRwP5vz2bivRQrc1v1",
        date: new Date('10 February 2023 09:30 UTC').toISOString(),
        likes: ["cLXbp8kqWdhs4Ifn9uzKfpum40k1", "gl3sTxGefdSCuh65DjbB2ClN2053"],
        comments: [
            {
                comment: "Great initiative!",
                user: "cLXbp8kqWdhs4Ifn9uzKfpum40k1"
            },
            {
                comment: "Count me in for the next tree planting event!",
                user: "gl3sTxGefdSCuh65DjbB2ClN2053"
            }
        ],
        isEvent: true,
        location: "New York City",
        textBody: "We're organizing a tree planting event in Central Park this weekend! Join us to make a difference!",
        image: "https://www.theglobeandmail.com/resizer/JwQ2c02ge_l2mHtLnCQFMwXimjw=/arc-anglerfish-tgam-prod-tgam/public/FH7SWBKLCJGTFBD6N4GF5DT3BQ.JPG"
    },
    {
        title: "My experience at a tree planting workshop!",
        user: "ywXlV0oBQyfJkyZuaGgPUSh2dGp1",
        date: new Date('08 June 2023 13:15 UTC').toISOString(),
        likes: ["i01NqL3xhKdB4L3vGm4dcfMT33j2"],
        comments: [
            {
                comment: "I love seeing so many people passionate about tree planting!",
                user: "i01NqL3xhKdB4L3vGm4dcfMT33j2"
            },
            {
                comment: "We need more events like these to raise awareness about the importance of trees!",
                user: "m6rADXvLnFVSSASkSdF9Fq8TshT2"
            }
        ],
        isEvent: false,
        location: "San Francisco",
        textBody: "Attended a tree planting workshop today. Learned a lot about native tree species!",
        image: "https://caseytrees.org/wp-content/uploads/2017/03/Tree-Planting-Workshop-thumbnail.jpg"
    }
]

postData.forEach(async post => {
    // No matching documents, so add the new document
    addDoc(collection(db, "posts"), post)
    .then(docRef => console.log("Document written with ID: ", docRef.id))
    .catch(error => console.error("Error adding document: ", error));
});