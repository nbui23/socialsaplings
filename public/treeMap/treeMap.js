let googleMapsApiLoaded = false;
let map;
let markers = []; // Global variable to hold all markers

document.addEventListener('DOMContentLoaded', function () {
    loadGoogleMapsApi();
});

document.getElementById('personal-trees').addEventListener('click', function () {
    handlePersonalTreesClick();
});

function handlePersonalTreesClick() {
    fetchUserData().then(username => {
        if (!map) {
            console.error("Google Maps has not been initialized.");
            return;
        }
        fetchTreeDataAndDisplayMarkers().then(() => {
            filterMarkersByUsername(username);
        });
    });
}

function fetchUserData() {
    const idToken = localStorage.getItem('idToken');
    if (!idToken) {
        window.location.href = '/signin';
        return Promise.reject(new Error('No idToken found'));
    }

    return fetch('/api/user-data', {
        headers: {
            'Authorization': `Bearer ${idToken}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            return response.json();
        })
        .then(data => {
            console.log("User data fetched successfully:", data);
            return data.username;
        })
        .catch(error => {
            console.error('Error:', error);
            return Promise.reject(error);
        });
}

function loadGoogleMapsApi() {
    if (googleMapsApiLoaded) {
        console.log("Google Maps API is already loaded.");
        return;
    }

    fetch('/api/maps-key')
        .then(response => response.json())
        .then(data => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${data.key}&callback=initMap&loading=async`;
            script.async = true;
            script.defer = true;
            script.onload = function () {
                googleMapsApiLoaded = true;
                console.log("Google Maps API loaded successfully.");
            };
            document.head.appendChild(script);
        })
        .catch(error => console.error('Failed to load Google Maps API key:', error));
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: { lat: 45.355871922772636, lng: -75.92183765681023 },
        streetViewControl: false,
        styles: getMapStyles(),
    });

    fetchTreeDataAndDisplayMarkers();
}

function getMapStyles() {
    return [
        {
            featureType: "poi",
            elementType: "all",
            stylers: [{ visibility: "off" }]
        },
        {
            featureType: "poi.park",
            elementType: "all",
            stylers: [{ visibility: "on" }]
        }
    ];
}

function fetchTreeDataAndDisplayMarkers() {
    return fetch('/api/tree-map/data')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            markers = data.map(tree => createMarkerForTree(tree));
            // new MarkerClusterer(map, markers, {
            //     imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
            // });
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

function createMarkerForTree(tree) {
    const marker = new google.maps.Marker({
        position: { lat: tree.latitude, lng: tree.longitude },
        icon: getMarkerIcon(tree.color),
        title: tree.username,
        map: map, // Directly assign map instead of using setMap
    });

    const infoWindow = new google.maps.InfoWindow({
        content: getInfoWindowContent(tree),
    });

    marker.addListener('click', () => {
        infoWindow.open({ anchor: marker, map, shouldFocus: false });
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
            <h3>Planted by: ${tree.username}</h3>
            <p>Planted on: ${tree.date}</p>
            <p>Species: ${tree.speciesName}</p>
        </div>
    `;
}

function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

function adjustMapViewToMarkers(markers) {
    if (markers.length === 0) {
        console.warn('No markers to adjust view for.');
        return;
    }

    const bounds = new google.maps.LatLngBounds();
    markers.forEach(marker => {
        bounds.extend(marker.getPosition());
    });
    map.fitBounds(bounds);
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function hideMarkers() {
    setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
    setMapOnAll(map);
}

// Filter markers by username but hide non-matching markers instead of deleting
function filterMarkersByUsername(username) {
    hideMarkers(); // First, hide all markers

    // Convert username to lowercase for case-insensitive comparison
    const usernameLower = username.toLowerCase();

    // Filter and then show markers based on username match
    markers.forEach(marker => {
        if (marker.title && marker.title.toLowerCase() === usernameLower) {
            marker.setMap(map); // Show marker
        }
    });
}


hideMarkers();