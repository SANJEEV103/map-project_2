// Initialize the map, centered on India
const map = L.map('map').setView([20.5937, 78.9629], 5);

// Define tile layers
const layers = {
    roadmap: L.tileLayer('http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}', {
        maxZoom: 19,
        opacity: 0,
        attribution: 'Map data © Google | DigiTree Labs'
    }),
    terrain: L.tileLayer('http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}', {
        maxZoom: 15,
        attribution: 'Map data © Google | DigiTree Labs'
    }),
    alteredRoadmap: L.tileLayer('http://mt0.google.com/vt/lyrs=r&hl=en&x={x}&y={y}&z={z}', {
        maxZoom: 19,
        attribution: 'Map data © Google | DigiTree Labs'
    }),
    satellite: L.tileLayer('http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}', {
        maxZoom: 19,
        attribution: 'Map data © Google | DigiTree Labs'
    }),
    terrainOnly: L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        maxZoom: 15,
        attribution: 'Map data © BaseMaps | DigiTree Labs'
    }),
    hybrid: L.tileLayer('http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}', {
        maxZoom: 19,
        attribution: 'Map data © Google | DigiTree Labs'
    }),
    aquarelle: L.tileLayer('https://api.maptiler.com/maps/aquarelle/{z}/{x}/{y}.png?key=5YSoBeKtZQUTh9rxmF7y', {
        maxZoom: 19,
        attribution: 'Map data © Google | DigiTree Labs'
    }),
    toner: L.tileLayer('https://api.maptiler.com/maps/toner-v2/{z}/{x}/{y}.png?key=5YSoBeKtZQUTh9rxmF7y', {
        maxZoom: 19,
        attribution: 'Map data © Google | DigiTree Labs'
    }),
    Bright: L.tileLayer('https://api.maptiler.com/maps/bright-v2/{z}/{x}/{y}.png?key=5YSoBeKtZQUTh9rxmF7y', {
        maxZoom: 19,
        attribution: 'Map data © Google | DigiTree Labs'
    })
};

// Set initial layer
layers.roadmap.addTo(map);

// Toggle dropdown visibility
const tileSwitcher = document.querySelector('.tile-switcher');
const dropdownButton = document.querySelector('.dropdown-button');
dropdownButton.addEventListener('click', () => {
    tileSwitcher.classList.toggle('active');
});

// Switch tile layers and close dropdown
function switchTile(type) {
    map.eachLayer(layer => map.removeLayer(layer));
    layers[type].addTo(map);
    tileSwitcher.classList.remove('active');
}

// Convert DMS to Decimal Degrees
function convertToDecimal(degreesStr) {
    const regex = /([NSWE])?\s*(\d{1,3})°(\d+(\.\d+)?)/;
    const match = degreesStr.match(regex);

    if (!match) return null;

    const direction = match[1];
    const degrees = parseFloat(match[2]);
    const minutes = parseFloat(match[3]);

    let decimal = degrees + (minutes / 60);

    if (direction === "S" || direction === "W") {
        decimal = -decimal;
    }

    return decimal;
}

// Fetch data and setup table iconSize:
let originalData = [];  // Store the fetched data
fetch('./assets/data.json')
    .then(response => response.json())
    .then(data => {
        originalData = data;
        renderTable(originalData);

        data.forEach((item, index) => {
            const latitude = item.latitude ? convertToDecimal(item.latitude) : null;
            const longitude = item.longitude ? convertToDecimal(item.longitude) : null;

            if (latitude && longitude) {
                const marker = L.marker([latitude, longitude]).addTo(map);
                marker.bindPopup(`
                    <div class="popup-content">
                        <h3>${item.polling_station_name}</h3>
                        <p><strong>Total Voters:</strong> ${item.total_voters}</p>
                        <p><strong>Male Count:</strong> ${item.Male_count}</p>
                        <p><strong>Female Count:</strong> ${item.Female_count}</p>
                        <p><strong>Male Percentage:</strong> ${item.Male_percentage}%</p>
                        <p><strong>Female Percentage:</strong> ${item.Female_percentage}%</p>
                    </div>
                `);
            }
        });
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });

// Sorting and Filtering
const searchInput = document.querySelector('.search-bar input');
const searchBtn = document.querySelector('.search-btn');
const filterDropdown = document.querySelector('.filter-dropdown select');

searchBtn.addEventListener('click', () => filterData());
filterDropdown.addEventListener('change', () => {
    if (filterDropdown.value === "femalePercentage") {
        sortDataByFemalePercentage();
    } else {
        filterData();
    }
});

function filterData() {
    const searchTerm = searchInput.value.toLowerCase();
    const filterValue = filterDropdown.value;
    let filteredData = originalData.filter(item => 
        Object.values(item).some(value => 
            String(value).toLowerCase().includes(searchTerm)
        )
    );

    if (filterValue && filterValue !== 'femalePercentage') {
        filteredData.sort((a, b) => {
            if (typeof a[filterValue] === 'number' && typeof b[filterValue] === 'number') {
                return a[filterValue] - b[filterValue];
            } else {
                return String(a[filterValue]).localeCompare(String(b[filterValue]));
            }
        });
    }
    renderTable(filteredData);
}

function sortDataByFemalePercentage() {
    const sortedData = [...originalData].sort((a, b) => parseFloat(b.Female_percentage) - parseFloat(a.Female_percentage));
    renderTable(sortedData);
}

function renderTable(data) {
    const tableBody = document.querySelector("#dataTable tbody");
    tableBody.innerHTML = '';
    data.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.part_no}</td>
            <td>${item.polling_station_name}</td>
            <td>${item.total_voters}</td>
            <td>${item.Male_count}</td>
            <td>${item.Female_count}</td>
            <td>${item.Male_percentage}%</td>
            <td>${item.Female_percentage}%</td>
            <td>${item.age_18_24}</td>
            <td>${item.age_25_34}</td>
            <td>${item.age_35_44}</td>
            <td>${item.age_45_60}</td>
            <td>${item.age_60_plus}</td>
            <td><button class="locate-btn" data-index="${index}">Locate</button></td>
        `;
        tableBody.appendChild(row);
    });
}

// Load and style the GeoJSON file
function loadGeoJson() {
    fetch('./assets/Mahnar_Villages.geojson') // Ensure the path to your GeoJSON file is correct
        .then(response => response.json())
        .then(data => {
            let count = 0; // Counter to alternate colors
            // Add the GeoJSON layer to the map
            L.geoJson(data, {
                style: function(feature) {
                    // Alternate fill color based on count
                    const fillColor = count % 2 === 0 ? 'orange' : 'blue';
                    count++; // Increment counter
                    return {
                        fillColor: fillColor, // Set the fill color dynamically
                        color: 'black',       // Black border
                        weight: 2,            // Border thickness
                        opacity: 1,           // Border opacity
                        fillOpacity: 1      // Fill opacity
                    };
                }
            }).addTo(map);
        })
        .catch(error => console.error('Error loading the GeoJSON data:', error));
}

// Call the function to load and style GeoJSON
loadGeoJson();

