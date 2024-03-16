document.addEventListener('DOMContentLoaded', function() {
    fetchUserData().then(username => {
        document.getElementById('username').textContent = username; 
        fetchTreeData(username); 
    }).catch(error => {
        console.error('Initialization error:', error);
    });
});

function fetchUserData() {
    const idToken = localStorage.getItem('idToken');
    if (!idToken) {
        window.location.href = '/signin';
        return Promise.reject('No idToken found');
    }

    return fetch('http://localhost:3000/api/user-data', {
        headers: { 'Authorization': `Bearer ${idToken}` }
    })
    .then(response => response.ok ? response.json() : Promise.reject('Failed to fetch user data'))
    .then(data => data.username);
}

function fetchTreeData(username) {
    fetch('http://localhost:3000/api/tree-map/data')
    .then(response => {
        if (!response.ok) throw new Error('Failed to fetch tree data');
        return response.json();
    })
    .then(data => {
        const treesPlanted = calculateTreesPlantedByUsername(data, username);
        document.getElementById('trees-planted').textContent = treesPlanted;
        const totalCO2Absorbed = calculateTotalCO2Absorbed(data);
        document.getElementById('co2-absorbed').textContent = totalCO2Absorbed;
    })
    .catch(error => console.error('Error:', error));
}

function calculateTreesPlantedByUsername(trees, username) {
    const treesPlantedByUser = trees.filter(tree => tree.username === username);
    
    return treesPlantedByUser.length;
}

function calculateTotalCO2Absorbed(trees) {
    const currentYear = new Date().getFullYear();
    let totalCO2Absorbed = 0;

    trees.forEach(tree => {
        const yearPlanted = new Date(tree.date).getFullYear();
        const yearsPlanted = currentYear - yearPlanted;
        const annualCO2AbsorptionRate = 5.9; // kg of CO2 per year for a young tree
        totalCO2Absorbed += yearsPlanted * annualCO2AbsorptionRate;
    });

    return totalCO2Absorbed;
}