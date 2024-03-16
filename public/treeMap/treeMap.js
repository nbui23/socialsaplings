// Firebase configuration and initialization
const firebaseAppConfig = {
    apiKey: "AIzaSyCxuxa5bFTXVYF_NRH9HrRV_mebUzQ05OM",
    authDomain: "socialsaplings.firebaseapp.com",
    projectId: "socialsaplings",
    storageBucket: "socialsaplings.appspot.com",
    messagingSenderId: "387358176449",
    appId: "1:387358176449:web:170965d7d094b37c445040",
    measurementId: "G-WB4L946TCH"
};
firebase.initializeApp(firebaseAppConfig);
const db = firebase.firestore();

// Marker Colors
const markerColors = {
    "Pine": "green", "Willow": "blue", "Beech": "yellow",
    "Maple": "orange", "Birch": "pink", "Oak": "red",
    "Sugar Maple": "purple", "White Pine": "grey", "Northern Red Oak": "brown"
};

// Global variables
let googleMapsApiLoaded = false;
let map;
let markers = [];

// Initialization function
function init() {
    document.addEventListener('DOMContentLoaded', loadGoogleMapsApi);
    setupTreeSpeciesDropdown();
    setupEventListeners();
}

// Setup Tree Species Dropdown
function setupTreeSpeciesDropdown() {
    const select = document.getElementById('treeSpecies');
    const treeSpeciesNames = [
        "Pine", "Willow", "Beech", "Maple", "Birch", "Oak",
        "Sugar Maple", "White Pine", "Northern Red Oak", "Eastern Hemlock", "Unknown/Other"
    ];

    treeSpeciesNames.forEach(species => {
        const option = document.createElement('option');
        option.value = species;
        option.text = species;
        select.appendChild(option);
    });
}

// Setup Event Listeners
function setupEventListeners() {
    document.getElementById('personal-trees').addEventListener('click', handlePersonalTreesClick);
    document.getElementById('all-trees').addEventListener('click', showAllMarkers);
    document.getElementById('plant-tree').addEventListener('click', () => toggleModalVisibility('plantTreeModal', true));
    document.getElementById('plantTreeSubmit').addEventListener('click', handlePlantTreeSubmit);
}

// Load Google Maps API
function loadGoogleMapsApi() {
    if (googleMapsApiLoaded) return console.log("Google Maps API is already loaded.");
    fetch('/api/maps-key')
        .then(response => response.json())
        .then(data => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${data.key}&callback=initMap&loading=async`;
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
            script.onload = () => googleMapsApiLoaded = true;
        })
        .catch(error => console.error('Failed to load Google Maps API:', error));
}

// Initialize Google Maps
window.initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: { lat: 45.3558, lng: -75.9218 },
        streetViewControl: false,
        styles: mapStyles()
    });
    fetchTreeDataAndDisplayMarkers();
};

// Handle Personal Trees Click
function handlePersonalTreesClick() {
    if (!map) return console.error("Google Maps has not been initialized.");
    fetchUserData()
        .then(username => filterMarkersByUsername(username))
        .catch(error => console.error("Error fetching user data:", error));
}

// Handle Plant Tree Submit
async function handlePlantTreeSubmit() {
    try {
        const treeSpecies = document.getElementById('treeSpecies').value;
        const username = await fetchUserData();
        const color = markerColors[treeSpecies];
        const timeOfSubmission = new Date().toISOString();

        navigator.geolocation.getCurrentPosition(position => {
            const markerData = {
                speciesName: treeSpecies,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                date: timeOfSubmission,
                username: username,
                color: color,
            };
            addMarkerToDatabase(markerData);
            toggleModalVisibility('plantTreeModal', false);
        });
    } catch (error) {
        console.error("Error submitting tree:", error);
    }
}

// Fetch User Data
function fetchUserData() {
    const idToken = localStorage.getItem('idToken');
    if (!idToken) {
        window.location.href = '/signin';
        return Promise.reject('No idToken found');
    }

    return fetch('/api/user-data', {
        headers: { 'Authorization': `Bearer ${idToken}` }
    })
    .then(response => response.ok ? response.json() : Promise.reject('Failed to fetch user data'))
    .then(data => data.username);
}

// Add Marker to Database
function addMarkerToDatabase(markerData) {
    db.collection("treeMarkers").add(markerData)
        .then(docRef => console.log("Marker document written with ID:", docRef.id))
        .catch(error => console.error("Error adding marker document:", error));
}

// Fetch Tree Data and Display Markers
function fetchTreeDataAndDisplayMarkers() {
    fetch('/api/tree-map/data')
        .then(response => response.ok ? response.json() : Promise.reject('Network response was not ok'))
        .then(data => {
            markers = data.map(tree => createMarkerForTree(tree));
            // new MarkerClusterer(map, markers, {
            //     imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
            // });
        })
        .catch(error => console.error('Problem with fetch operation:', error));
}

function createMarkerForTree(tree) {
    const marker = new google.maps.Marker({
        position: { lat: tree.latitude, lng: tree.longitude },
        icon: getMarkerIcon(tree.color),
        title: tree.username,
        map: map,
    });

    const infoWindow = new google.maps.InfoWindow({
        content: getInfoWindowContent(tree),
    });

    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });

    return marker;
}

function getMarkerIcon(color) {
    return {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: color,
        fillOpacity: 1,
        strokeWeight: 0,
    };
}

function getInfoWindowContent(tree) {
    return `
        <div>
            <h3>Species: ${tree.speciesName}</h3>
            <p>Planted by: ${tree.username}</p>
            <p>Planted on: ${new Date(tree.date).toLocaleDateString()}</p>
        </div>
    `;
}

function filterMarkersByUsername(username) {
    const usernameLower = username.toLowerCase();
    markers.forEach(marker => {
        marker.setMap(null);
        if (marker.title && marker.title.toLowerCase().includes(usernameLower)) {
            marker.setMap(map);
        }
    });
    adjustMapViewToVisibleMarkers();
}

function showAllMarkers() {
    markers.forEach(marker => {
        marker.setMap(map);
    });
    adjustMapViewToVisibleMarkers();
}


function adjustMapViewToVisibleMarkers() {
    let bounds = new google.maps.LatLngBounds();
    let visibleMarkersCount = 0;

    markers.forEach(marker => {
        if (marker.getMap() !== null) { // Check if the marker is visible
            bounds.extend(marker.getPosition());
            visibleMarkersCount++;
        }
    });

    if (visibleMarkersCount > 0) {
        map.fitBounds(bounds, {padding: 10});
    } else {
        console.log("No visible markers to adjust map view.");
    }
}

function toggleModalVisibility(modalId, isVisible) {
    const displayValue = isVisible ? 'block' : 'none';
    document.getElementById(modalId).style.display = displayValue;
}

function mapStyles() {
    return [
        {
            featureType: "poi",
            elementType: "all",
            stylers: [{ visibility: "off" }]
        },
        {
            featureType: "poi.park",
            elementType: "all",
            stylers: [{ visibility: "off" }]
        }
    ];
}

init();