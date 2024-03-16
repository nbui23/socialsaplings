function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(sendPositionToServer, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function sendPositionToServer(position) {
    const loadingElement = document.getElementById('loading');
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log("Sending location data to server:", latitude, longitude);
    loadingElement.style.display = 'block';

    fetch('http://localhost:3000/api/treerecommendation/geolocation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude, longitude }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);

        // Send a request to the /api/soildata endpoint
        return fetch('http://localhost:3000/api/treerecommendation', {
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
        displayTreeRecommendations(data.treeRecommendation);
        loadingElement.style.display = 'none';
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Failed to send location data or retrieve soil data.');
        loadingElement.style.display = 'none';
    });
}

function displayTreeRecommendations(recommendations) {
/*
[
    {
        "idealClimateClasses": [
            "cold",
            "temperate"
        ],
        "name": "White Pine",
        "idealBiodiversityClasses": [
            "medium",
            "high"
        ],
        "idealTopographyClasses": [
            "low",
            "medium"
        ],
        "idealSoilClasses": [
            "Cambisols"
        ]
    },
    {
        "idealBiodiversityClasses": [
            "high"
        ],
        "name": "Sugar Maple",
        "idealSoilClasses": [
            "Cambisols"
        ],
        "idealClimateClasses": [
            "cold",
            "temperate"
        ],
        "idealTopographyClasses": [
            "low",
            "medium"
        ]
    }
]
*/
    const treeRecommendationsDiv = document.querySelector('.tree-recommendationsInner');

    treeRecommendationsDiv.innerHTML = '';


    recommendations.forEach(tree => {
        const item = document.createElement('div');
        item.classList.add('item');

        const ul = document.createElement('ul');

        const imgLi = document.createElement('li');
        const img = document.createElement('img');
        img.src = getTreeImage(tree.name);
        img.alt = 'Tree Image';
        img.classList.add('templatemo-item');
        imgLi.appendChild(img);
        ul.appendChild(imgLi);

        // Create list elements for each property of the tree
        // Specify the titles and values directly
        const titles = ['Name', 'Climate Class', 'Biodiversity Class', 'Topography Class', 'Soil Class'];
        const values = [capitalizeFirstLetter(tree.name), capitalizeFirstLetter(tree.idealClimateClasses.join(', ')), capitalizeFirstLetter(tree.idealBiodiversityClasses.join(', ')), capitalizeFirstLetter(tree.idealTopographyClasses.join(', ')), capitalizeFirstLetter(tree.idealSoilClasses.join(', '))];

        for (let i = 0; i < titles.length; i++) {
            const li = document.createElement('li');
            const title = document.createElement('h4');
            const span = document.createElement('span');
            title.textContent = values[i];
            span.textContent = titles[i];
            li.appendChild(title);
            li.appendChild(span);
            ul.appendChild(li);
        }
        item.appendChild(ul);
        treeRecommendationsDiv.appendChild(item);
    });
}

function capitalizeFirstLetter(string) {
    return string.replace(/\b\w/g, char => char.toUpperCase());
}

function getTreeImage(treeName) {
    const dummyTreeImages = {
        Pine: 'https://shop-static.arborday.org/media/0000649_ponderosa-pine.jpg',
        Willow: 'https://cdn.britannica.com/23/60423-050-A24B296C/Weeping-willow.jpg',
        Beech: 'https://forestry.com/wp/wp-content/uploads/2023/10/2-76.webp',
        Maple: 'https://live.staticflickr.com/177/456797312_fa6014b723_b.jpg',
        Birch: 'https://i.ebayimg.com/images/g/~tIAAOSwhAFiLmVG/s-l1200.webp',
        Oak: 'https://cdn.britannica.com/92/142292-004-459092B7.jpg',
        'Sugar Maple': 'https://floraefarms.com/cdn/shop/products/AcerSaccharum_SugarMaple_2_918x.jpg?v=1618497345',
        'White Pine': 'https://www.ontario.ca/files/2023-07/mnr-srb-easternwhitepine-tree-1200x1200-2023-07-27.jpg',
        'Northern Red Oak': 'https://treesforever.org/wp-content/uploads/2021/09/Scarlet_Oak_Tree_Fall_grande.jpg',
        'Eastern Hemlock': 'https://neerhoflandscapes.com/wp-content/uploads/2021/05/DETA-3945.jpg'
    };

    return dummyTreeImages[treeName];
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
