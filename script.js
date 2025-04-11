// Initialize the map, centered on India
const map = L.map('map').setView([20.5937, 78.9629], 5);

// Define tile layers
const layers = {
  roadmap: L.tileLayer('http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}', {
    maxZoom: 19,
    attribution: 'Map data © Google | Cyber Zone Academy'
  }),
  terrain: L.tileLayer('http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}', {
    maxZoom: 15,
    attribution: 'Map data © Google | Cyber Zone Academy'
  }),
  alteredRoadmap: L.tileLayer('http://mt0.google.com/vt/lyrs=r&hl=en&x={x}&y={y}&z={z}', {
    maxZoom: 19,
    attribution: 'Map data © Google | Cyber Zone Academy'
  }),
  satellite: L.tileLayer('http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}', {
    maxZoom: 19,
    attribution: 'Map data © Google | Cyber Zone Academy'
  }),
  terrainOnly: L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    maxZoom: 15,
    attribution: 'Map data © BaseMaps | Cyber Zone Academy'
  }),
  hybrid: L.tileLayer('http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}', {
    maxZoom: 19,
    attribution: 'Map data © Google | Cyber Zone Academy'
  }),
  aquarelle: L.tileLayer('https://api.maptiler.com/maps/aquarelle/{z}/{x}/{y}.png?key=5YSoBeKtZQUTh9rxmF7y', {
    maxZoom: 19,
    attribution: 'Map data © Google | Cyber Zone Academy'
  }),
  toner: L.tileLayer('https://api.maptiler.com/maps/toner-v2/{z}/{x}/{y}.png?key=5YSoBeKtZQUTh9rxmF7y', {
    maxZoom: 19,
    attribution: 'Map data © Google | Cyber Zone Academy'
  }),
  Bright: L.tileLayer('https://api.maptiler.com/maps/bright-v2/{z}/{x}/{y}.png?key=5YSoBeKtZQUTh9rxmF7y', {
    maxZoom: 19,
    attribution: 'Map data © Google | Cyber Zone Academy'
  })
  
};

// Set initial layer (optional, remove if no default view desired)
layers.roadmap.addTo(map);
// Load the GeoJSON file
omnivore.geojson('./assets/Mahnar_Villages.geojson').addTo(map);
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
  tileSwitcher.classList.remove('active'); // Close dropdown after selecting
}

// Function to convert DMS to Decimal Degrees
function convertToDecimal(degreesStr) {
    const regex = /([NSWE])?\s*(\d{1,3})°(\d+(\.\d+)?)/;
    const match = degreesStr.match(regex);

    if (!match) return null;

    const direction = match[1];
    const degrees = parseFloat(match[2]);
    const minutes = parseFloat(match[3]);

    let decimal = degrees + (minutes / 60);

    // Adjust for direction (N/S or E/W)
    if (direction === "S" || direction === "W") {
        decimal = -decimal;
    }

    return decimal;
}

// Fetch data from a local JSON file
fetch('./assets/data.json')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.querySelector("#dataTable tbody");

        data.forEach((item, index) => {
            // Create a new table row and populate it with the data
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

            // Add markers for each location in your dataset
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

        // Add event listener for locate buttons
        document.querySelectorAll(".locate-btn").forEach(button => {
            button.addEventListener("click", function() {
                const index = this.getAttribute("data-index");
                const item = data[index];

                // Check if latitude and longitude are available
                const latitude = item.latitude ? convertToDecimal(item.latitude) : null;
                const longitude = item.longitude ? convertToDecimal(item.longitude) : null;

                if (latitude && longitude) {
                    // Center map on the location and zoom in
                    map.flyTo([latitude, longitude], 18);

                    // Add marker on map after delay
                    setTimeout(() => {
                        const marker = L.marker([latitude, longitude]).addTo(map);
                        marker.bindPopup(`
                            <div class="popup-content">
                                <h3>${item.polling_station_name}</h3>
                                <p><strong>Total Voters:</strong> ${item.total_voters}</p>
                                <p><strong>Male Count:</strong> ${item.Male_count}</p>
                                <p><strong>Female Count:</strong> ${item.Female_count}</p>
                                <p><strong>Male Percentage:</strong> ${item.Male_percentage}%</p>
                                <p><strong>Female Percentage:</strong> ${item.Female_percentage}%</p>
                                <p><strong>Age 18-24:</strong> ${item.age_18_24}</p>
                                <p><strong>Age 25-34:</strong> ${item.age_25_34}</p>
                                <p><strong>Age 35-44:</strong> ${item.age_35_44}</p>
                                <p><strong>Age 45-60:</strong> ${item.age_45_60}</p>
                                <p><strong>Age 60+:</strong> ${item.age_60_plus}</p>
                            </div>
                        `).openPopup();
                    }, 3000); // Popup appears after 1 second delay
                } else {
                    alert("Latitude and Longitude are not available for this location.");
                }
            });
        });

    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });
const searchInput = document.querySelector('.search-bar input');
const searchBtn = document.querySelector('.search-btn');
const filterDropdown = document.querySelector('.filter-dropdown select');

let originalData = []; // Store the fetched data to avoid refetching



// Function to filter data based on search input
function filterData() {
    const searchTerm = searchInput.value.toLowerCase();
    const filterValue = filterDropdown.value;

    // Filter by search term
    let filteredData = originalData.filter(item => 
        Object.values(item).some(value => 
            String(value).toLowerCase().includes(searchTerm)
        )
    );

    // Sort filtered data by selected filter
    if (filterValue) {
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

// Event listeners for search and filter
searchBtn.addEventListener('click', filterData);
filterDropdown.addEventListener('change', filterData);

// Optional: Debounce search input
searchInput.addEventListener('input', debounce(filterData, 300));

// Debounce function to limit function calls
function debounce(func, delay) {
    let debounceTimer;
    return function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(this, arguments), delay);
    };
}

// Load GeoJSON from a local file
const geojsonLayer = omnivore.geojson('./assets/Mahnar_Villages.geojson')
  .on('ready', function() {
    // When the GeoJSON is loaded, apply styles and add to the map
    this.eachLayer(function(layer) {
      layer.setStyle({
        color: 'black', // Color of the boundary
        weight: 2, // Thickness of the boundary line
        fillColor: '#f2f4f3', // Fill color of the region
        fillOpacity: 0.5 // Opacity of the fill
      });
    });
  })
  .addTo(map);
  layer.setStyle({
    color: '#ff7800', // Example: changing to orange
    weight: 2,
    fillColor: '#f2f4f3',
    fillOpacity: 0.5
  });

  
  