function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(sendPositionToServer, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function sendPositionToServer(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    fetch('http://localhost:3000/api/geolocation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude, longitude }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        alert('Location data sent successfully.');

        // Send a request to the /api/soildata endpoint
        return fetch('http://localhost:3000/api/soildata', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ latitude, longitude }),
        });
    })
    .then(response => response.json())
    .then(data => {
        console.log('Soil Data:', data);
        alert('Soil data retrieved successfully.');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Failed to send location data or retrieve soil data.');
    });
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}
