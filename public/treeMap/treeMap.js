let googleMapsApiLoaded = false;

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
            };
            document.head.appendChild(script);
        })
        .catch(error => console.error('Failed to load Google Maps API key:', error));
}

function initMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: { lat: 45.355871922772636, lng: -75.92183765681023 },
        streetViewControl: false,
        styles: [
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
        ]
    });

    fetchTreeDataAndDisplayMarkers(map);
}

function fetchTreeDataAndDisplayMarkers(map) {
    fetch('/api/tree-map/data')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const markers = data.map(tree => {
                const marker = new google.maps.Marker({
                    position: { lat: tree.latitude, lng: tree.longitude },
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: tree.color,
                        fillOpacity: 1,
                        strokeWeight: 0,
                    },
                    title: tree.speciesName,
                });

                const infoWindowContent = `
                    <div>
                        <h3>Planted by: ${tree.username}</h3>
                        <p>Planted on: ${tree.date}</p>
                        <p>Species: ${tree.speciesName}</p>
                    </div>
                `;

                const infoWindow = new google.maps.InfoWindow({
                    content: infoWindowContent,
                });

                marker.addListener('click', () => {
                    infoWindow.open({
                        anchor: marker,
                        map,
                        shouldFocus: false,
                    });
                });

                return marker;
            });

            let markerClusterer = new MarkerClusterer(map, markers, { 
                imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' //TODO: change this shit
            });
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}


loadGoogleMapsApi();
