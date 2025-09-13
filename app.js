// --- GLOBAL STATE ---
let currentLang = 'en';
let allCrops = [];

// --- TRANSLATION DATA ---
const translations = { /* ... (no changes) ... */ };

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    fetchDataAndRender(); // Renamed for clarity
    document.getElementById('listCropForm').addEventListener('submit', handleAddCrop);
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
});

// --- CORE FUNCTIONS ---

/**
 * Fetches data and then calls functions to render all necessary page sections.
 */
async function fetchDataAndRender() {
    try {
        const response = await fetch('crops.json');
        allCrops = await response.json();
        
        // Populate all dynamic sections of the site
        renderBestsellers();
        renderFeaturedFarmers();
        applyFilters(); // Initial render for the browse page
        
    } catch (error) {
        console.error('Error fetching crop data:', error);
    }
}

/**
 * Renders crop cards into a specified container.
 * @param {Array} cropsToRender - An array of crop objects to display.
 * @param {string} containerId - The ID of the container element to put the cards in.
 */
function renderCrops(cropsToRender, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return; // Exit if the container doesn't exist
    
    container.innerHTML = ''; // Clear previous content

    if (cropsToRender.length === 0) {
        container.innerHTML = `<p>No crops found.</p>`;
        return;
    }

    cropsToRender.forEach(crop => {
        const card = document.createElement('div');
        card.className = 'crop-card';
        card.innerHTML = `
            <img src="${crop.image}" alt="${crop.name}">
            <div class="card-content">
                <h4>${crop.name}</h4>
                <p class="price">₹${crop.price} / ${crop.unit}</p>
                <p class="location">${crop.location}</p>
            </div>
            <div class="card-actions">
                <button class="btn-order" onclick="placeOrder(${crop.id})" data-lang-key="orderNow">${translations[currentLang].orderNow}</button>
            </div>
        `;
        container.appendChild(card);
    });
}


// --- [NEW] HOMEPAGE RENDER FUNCTIONS ---

/**
 * Filters for bestseller crops and renders them on the homepage.
 */
function renderBestsellers() {
    const bestsellers = allCrops.filter(crop => crop.bestseller === true).slice(0, 4); // Show max 4
    renderCrops(bestsellers, 'bestsellerGrid');
}

/**
 * Finds unique featured farmers and renders their cards on the homepage.
 */
function renderFeaturedFarmers() {
    const featuredFarmerGrid = document.getElementById('featuredFarmerGrid');
    const featuredFarmers = new Map();

    // Use a Map to automatically handle uniqueness based on farmer's name
    allCrops.forEach(crop => {
        if (crop.farmer.featured) {
            featuredFarmers.set(crop.farmer.name, crop.farmer);
        }
    });

    featuredFarmerGrid.innerHTML = ''; // Clear previous content
    featuredFarmers.forEach(farmer => {
        const card = document.createElement('div');
        card.className = 'farmer-card';
        card.innerHTML = `
            <img src="${farmer.avatar}" alt="${farmer.name}">
            <h4>${farmer.name}</h4>
        `;
        featuredFarmerGrid.appendChild(card);
    });
}


// --- FILTERING LOGIC ---

/**
 * Gets all filter values, filters the master list, and re-renders the browse grid.
 */
function applyFilters() {
    // 1. Get current values from all filter inputs
    const typeCheckboxes = document.querySelectorAll('#cropTypeFilter input:checked');
    const selectedTypes = Array.from(typeCheckboxes).map(cb => cb.value);
    const maxPrice = document.getElementById('priceRange').value;
    const locationQuery = document.getElementById('locationFilter').value.toLowerCase();
    const maxDistance = document.getElementById('distanceFilter').value; // Get distance value

    document.getElementById('priceValue').textContent = `₹${maxPrice}`;

    // 2. Filter the 'allCrops' array
    const filteredCrops = allCrops.filter(crop => {
        const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(crop.type);
        const priceMatch = crop.price <= maxPrice;
        const locationMatch = locationQuery === '' || crop.location.toLowerCase().includes(locationQuery);
        
        // [NEW] Distance Match Logic
        const distanceMatch = maxDistance === 'any' || 
                              (maxDistance === '100' && crop.distance > 50) || 
                              (crop.distance <= parseInt(maxDistance));

        return typeMatch && priceMatch && locationMatch && distanceMatch;
    });

    // 3. Re-render the main crop grid with only the filtered results
    const resultsTitle = document.getElementById('resultsTitle');
    resultsTitle.textContent = `Available Crops (${filteredCrops.length} results)`;
    renderCrops(filteredCrops, 'cropGrid');
}


// --- PAGE & MODAL NAVIGATION ---

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

function showModal(modalId) { document.getElementById(modalId).style.display = 'flex'; }
function hideModal(modalId) { document.getElementById(modalId).style.display = 'none'; }


// --- FEATURE LOGIC ---

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'hi' : 'en';

    document.querySelectorAll('[data-lang-key]').forEach(el => {
        const key = el.getAttribute('data-lang-key');
      
        if (translations[currentLang][key]) {
            el.innerText = translations[currentLang][key];
        }
    });
    
    document.getElementById('lang-switcher').innerText = currentLang === 'en' ? 'हिन्दी' : 'English';
    renderCrops(allCrops);
}

function handleAddCrop(event) {
    event.preventDefault();
  
    const newCrop = {
        id: allCrops.length + 1, // Create a simple new ID.
        name: document.getElementById('cropName').value,
        location: document.getElementById('location').value,
        price: document.getElementById('price').value,
        unit: document.getElementById('unit').value,
        image: 'https://images.unsplash.com/photo-1571771894824-c13b2412b375?q=80&w=2070'
    };
  
    allCrops.unshift(newCrop); 
  
    renderCrops(allCrops);

    hideModal('listCropModal');
    document.getElementById('listCropForm').reset();
    alert(`${newCrop.name} has been listed successfully for this session!`);
}


function placeOrder(cropId) {
    const crop = allCrops.find(c => c.id === cropId);

    if (crop) {
        const orderDetailsContainer = document.getElementById('orderDetails');
      
        orderDetailsContainer.innerHTML = `
            <p>Your order request has been sent to the farmer.</p>
            <strong>Crop:</strong> ${crop.name}<br>
            <strong>Price:</strong> ₹${crop.price} / ${crop.unit}<br>
            <strong>Location:</strong> ${crop.location}
        `;
        
        showModal('orderSuccessModal');
    } else {
        console.error('Could not find crop with ID:', cropId);
        alert('An error occurred. Could not find crop details.');
    }
}

// --- [ADDED] NEW FUNCTION TO HANDLE LOGIN ---

function handleLogin(event) {
    event.preventDefault(); 
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');

    // --- Simulated User Database ---
    const correctEmail = "farmer@cropkart.com";
    const correctPassword = "password123";

    if (email === correctEmail && password === correctPassword) {
        // If login is successful
        alert("Login Successful! Welcome back.");
        errorDiv.style.display = 'none';
        showPage('browsePage');
    } else {
        // If login fails
        errorDiv.textContent = "Invalid email or password. Please try again.";
        errorDiv.style.display = 'block';
    }
}

