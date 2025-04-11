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