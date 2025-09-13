// Global variables
let crops = [];
let userRole = null;
let userName = null;
let currentLang = 'en';

// Language Dictionary
const strings = {
  en: {
    splashTitle: "🌱 CropKart",
    splashTagline: "Empowering Farmers, Connecting Communities",
    welcomeMsg: "Welcome to CropKart",
    selectRole: "Select your role:",
    farmerBtn: "👨‍🌾 Farmer",
    consumerBtn: "🛒 Consumer",
    farmerLoginTitle: "Farmer Login",
    consumerLoginTitle: "Consumer Login",
    fullNamePlaceholder: "Full Name",
    emailPlaceholder: "Email",
    passwordPlaceholder: "Password",
    loginBtn: "Login",
    marketplaceTitle: "🌾 CropKart Marketplace",
    searchPlaceholder: "Search crops...",
    sortBy: "Sort By",
    priceLowHigh: "Price: Low → High",
    priceHighLow: "Price: High → Low",
    nameAZ: "Name A-Z",
    postCropBtn: "+ Post Crop",
    postCropFormTitle: "Post a New Crop",
    cropNamePlaceholder: "Crop Name",
    pricePlaceholder: "Price (e.g. ₹30/kg)",
    imageURLPlaceholder: "Image URL",
    submitBtn: "Submit",
    noCropsFound: "No crops found.",
    contactBtn: "Contact",
    priceLabel: "Price:",
    farmerLabel: "Farmer:",
    fillAllFieldsAlert: "⚠️ Please fill all fields!",
    welcomeAlert: (name) => `✅ Welcome, ${name}!`,
    contactingAlert: (name) => `📞 Contacting ${name}...`,
    cropAddedAlert: "✅ Crop added successfully!"
  },
  hi: {
    splashTitle: "🌱 फसलकार्ट",
    splashTagline: "किसानों को सशक्त बनाना, समुदायों को जोड़ना",
    welcomeMsg: "फसलकार्ट में आपका स्वागत है",
    selectRole: "अपनी भूमिका चुनें:",
    farmerBtn: "👨‍🌾 किसान",
    consumerBtn: "🛒 उपभोक्ता",
    farmerLoginTitle: "किसान लॉगिन",
    consumerLoginTitle: "उपभोक्ता लॉगिन",
    fullNamePlaceholder: "पूरा नाम",
    emailPlaceholder: "ईमेल",
    passwordPlaceholder: "पासवर्ड",
    loginBtn: "लॉगिन करें",
    marketplaceTitle: "🌾 फसलकार्ट बाज़ार",
    searchPlaceholder: "फसलों की खोज करें...",
    sortBy: "क्रमबद्ध करें",
    priceLowHigh: "मूल्य: कम → अधिक",
    priceHighLow: "मूल्य: अधिक → कम",
    nameAZ: "नाम A-Z",
    postCropBtn: "+ फसल पोस्ट करें",
    postCropFormTitle: "एक नई फसल पोस्ट करें",
    cropNamePlaceholder: "फसल का नाम",
    pricePlaceholder: "कीमत (उदाहरण: ₹30/किलो)",
    imageURLPlaceholder: "छवि का यूआरएल",
    submitBtn: "जमा करें",
    noCropsFound: "कोई फसल नहीं मिली।",
    contactBtn: "संपर्क करें",
    priceLabel: "कीमत:",
    farmerLabel: "किसान:",
    fillAllFieldsAlert: "⚠️ कृपया सभी फ़ील्ड भरें!",
    welcomeAlert: (name) => `✅ स्वागत है, ${name}!`,
    contactingAlert: (name) => `📞 ${name} से संपर्क किया जा रहा है...`,
    cropAddedAlert: "✅ फसल सफलतापूर्वक जोड़ दी गई है!"
  }
};

// Function to update all text based on the current language
function updateUI() {
  const lang = strings[currentLang];
  
  // Update elements with data-i18n attributes
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (lang[key]) {
      el.textContent = lang[key];
    }
  });

  // Update placeholders with data-i18n-placeholder attributes
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (lang[key]) {
      el.placeholder = lang[key];
    }
  });

  // Update select options
  document.getElementById('sortSelect').options[0].textContent = lang.sortBy;
  document.getElementById('sortSelect').options[1].textContent = lang.priceLowHigh;
  document.getElementById('sortSelect').options[2].textContent = lang.priceHighLow;
  document.getElementById('sortSelect').options[3].textContent = lang.nameAZ;

  // Re-render crops to update the text inside the cards
  if (crops.length > 0) {
    renderCrops(crops);
  } else {
    document.getElementById("listings").innerHTML = `<p>${lang.noCropsFound}</p>`;
  }
}

// Function to toggle the language
function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'hi' : 'en';
  document.getElementById("langToggleBtn").textContent = currentLang === 'en' ? 'हिन्दी' : 'English';
  updateUI();
}

// --- INITIAL APP LOAD & NAVIGATION ---
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("splash").classList.add("hidden");
    document.getElementById("roleSelect").classList.remove("hidden");
    updateUI(); // Initial UI update after splash screen
  }, 2000);
});

function showRoleForm(role) {
  document.getElementById("roleSelect").classList.add("hidden");
  if (role === 'farmer') {
    document.getElementById("farmerForm").classList.remove("hidden");
  } else if (role === 'consumer') {
    document.getElementById("consumerForm").classList.remove("hidden");
  }
}

function loginUser(role) {
  userRole = role;
  const lang = strings[currentLang];
  
  if (userRole === 'farmer') {
    userName = document.getElementById("farmerName").value.trim();
    if (!userName || !document.getElementById("farmerEmail").value.trim() || !document.getElementById("farmerPass").value.trim()) {
      alert(lang.fillAllFieldsAlert);
      return;
    }
    document.getElementById("farmerForm").classList.add("hidden");
    document.getElementById("listCropBtn").classList.remove("hidden");
  } else { // consumer
    userName = document.getElementById("consumerEmail").value.trim();
    if (!userName || !document.getElementById("consumerPass").value.trim()) {
      alert(lang.fillAllFieldsAlert);
      return;
    }
    document.getElementById("consumerForm").classList.add("hidden");
  }
  
  alert(lang.welcomeAlert(userName));
  document.getElementById("marketplace").classList.remove("hidden");
  loadCrops();
}

// --- CORE FUNCTIONALITY ---
async function loadCrops() {
  try {
    const response = await fetch("crops.json");
    if (!response.ok) throw new Error("Network response was not ok");
    crops = await response.json();
    renderCrops(crops);
  } catch (error) {
    console.error("Error loading crops.json, using fallback data.", error);
    crops = [
      { name: "Tomatoes", price: "₹20/kg", farmer: "Ram Singh", img: "https://i.ibb.co/JrFh2mX/tomatoes.jpg" },
      { name: "Wheat", price: "₹25/kg", farmer: "Ravi Sharma", img: "https://i.ibb.co/2K5yCpV/wheat.jpg" }
    ];
    renderCrops(crops);
  }
}

function renderCrops(list) {
  const listingsEl = document.getElementById("listings");
  listingsEl.innerHTML = "";
  const lang = strings[currentLang];

  if (list.length === 0) {
    listingsEl.innerHTML = `<p>${lang.noCropsFound}</p>`;
    return;
  }

  list.forEach(crop => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${crop.img}" alt="${crop.name}">
      <h3>${crop.name}</h3>
      <p><strong>${lang.priceLabel}</strong> ${crop.price}</p>
      <p><strong>${lang.farmerLabel}</strong> ${crop.farmer}</p>
      <button onclick="contactFarmer('${crop.farmer}')">${lang.contactBtn}</button>
    `;
    listingsEl.appendChild(card);
  });
}

function contactFarmer(name) {
  alert(strings[currentLang].contactingAlert(name));
}

function filterCrops() {
  const query = document.getElementById("searchBar").value.toLowerCase();
  const filtered = crops.filter(crop => crop.name.toLowerCase().includes(query));
  renderCrops(filtered);
}

function sortCrops() {
  const value = document.getElementById("sortSelect").value;
  let sorted = [...crops];

  if (value === "priceLow") {
    sorted.sort((a, b) => extractPrice(a.price) - extractPrice(b.price));
  } else if (value === "priceHigh") {
    sorted.sort((a, b) => extractPrice(b.price) - extractPrice(a.price));
  } else if (value === "name") {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  }

  renderCrops(sorted);
}

function extractPrice(priceStr) {
  return parseInt(priceStr.replace(/[^\d]/g, "")) || 0;
}

// --- POST CROP FORM ---
function toggleForm() {
  document.getElementById("postForm").classList.toggle("hidden");
}

function addCrop() {
  const lang = strings[currentLang];
  const name = document.getElementById("newCropName").value.trim();
  const price = document.getElementById("newCropPrice").value.trim();
  const img = document.getElementById("newCropImg").value.trim() || "https://via.placeholder.com/150";

  if (!name || !price) {
    alert(lang.fillAllFieldsAlert);
    return;
  }

  const newCrop = { name, price, farmer: userName, img };
  crops.unshift(newCrop);
  renderCrops(crops);

  document.getElementById("newCropName").value = "";
  document.getElementById("newCropPrice").value = "";
  document.getElementById("newCropImg").value = "";
  toggleForm();
  alert(lang.cropAddedAlert);
}

// Expose functions to the global scope
window.showRoleForm = showRoleForm;
window.loginUser = loginUser;
window.filterCrops = filterCrops;
window.sortCrops = sortCrops;
window.contactFarmer = contactFarmer;
window.toggleForm = toggleForm;
window.addCrop = addCrop;
window.toggleLanguage = toggleLanguage;
