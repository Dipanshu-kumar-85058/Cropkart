//--- GLOBAL STATE ---
let currentLang = 'en'; 
let allCrops = []; 

// --- TRANSLATION DATA ---
const translations = {
    en: {
        browseCrops: "Browse Crops",
        listYourCrop: "List Your Crop",
        signIn: "Sign In",
        heroTitle: "Fresh from Farm to Your Table",
        heroSubtitle: "Connect directly with farmers. Buy fresh produce.",
        availableCrops: "Available Crops",
        orderSuccessful: "Order Successful! ✅",
        welcomeBack: "Welcome back",
        listNewCrop: "List a New Crop",
        cropNameLabel: "Crop Name",
        locationLabel: "Location",
        priceLabel: "Price (₹)",
        unitLabel: "Per",
        photoLabel: "Photo of Crop",
        submitListing: "Submit Listing",
        orderNow: "Order Now"
    },
    hi: {
        browseCrops: "फसलें देखें",
        listYourCrop: " अपनी फसल बेचें",
        signIn: "साइन इन करें",
        heroTitle: "खेत से सीधे आपकी मेज पर",
        heroSubtitle: "किसानों से सीधे जुड़ें। ताज़ा उपज खरीदें।",
        availableCrops: "उपलब्ध फसलें",
        orderSuccessful: "ऑर्डर सफल! ✅",
        welcomeBack: "वापसी पर स्वागत है",
        listNewCrop: "एक नई फसल सूचीबद्ध करें",
        cropNameLabel: "फ़सल का नाम",
        locationLabel: "स्थान",
        priceLabel: "कीमत (₹)",
        unitLabel: "प्रति",
        photoLabel: "फसल की तस्वीर",
        submitListing: "लिस्टिंग जमा करें",
        orderNow: "अभी ऑर्डर करें"
    }
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    fetchCrops();
    document.getElementById('listCropForm').addEventListener('submit', handleAddCrop);
});

// --- CORE FUNCTIONS ---

async function fetchCrops() {
    try {
        const response = await fetch('crops.json');
        allCrops = await response.json();
        renderCrops(allCrops);
    } catch (error) {
        console.error('Error fetching crop data:', error);
    }
}


function renderCrops(cropsToRender) {
    const cropGrid = document.getElementById('cropGrid');
    cropGrid.innerHTML = '';
  
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
        cropGrid.appendChild(card);
    });
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
