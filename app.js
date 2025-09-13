//Splash & Login

window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("splash").style.display = "none";
    document.getElementById("login").classList.remove("hidden");
  }, 3000);
});

//Fake Login

function login() {
  const email = document.getElementById("email").value.trim();
  const pass = document.getElementById("password").value.trim();

  if (email && pass) {
    document.getElementById("login").classList.add("hidden");
    document.getElementById("marketplace").classList.remove("hidden");
    loadCrops(); // Load crops after login
  } else {
    alert("⚠️ Please enter Gmail ID and Password");
  }
}

//Load Crops from JSON

let crops = [];

async function loadCrops() {
  try {
    const response = await fetch("crops.json");
    const data = await response.json();
    crops = data;
    renderCrops(crops);
  } catch (error) {
    console.error("Error loading crops.json", error);
    crops = [
      { name: "Tomatoes", price: "₹20/kg", farmer: "Ram Singh", img: "assets/tomatoes.jpg" },
      { name: "Wheat", price: "₹25/kg", farmer: "Ravi Sharma", img: "assets/wheat.jpg" },
      { name: "Rice", price: "₹40/kg", farmer: "Sunita Devi", img: "assets/rice.jpg" }
    ];
    renderCrops(crops);
  }
}

//Render Crop Listings

function renderCrops(list) {
  const listingsEl = document.getElementById("listings");
  listingsEl.innerHTML = "";

  if (list.length === 0) {
    listingsEl.innerHTML = "<p>No crops found.</p>";
    return;
  }

  list.forEach(crop => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${crop.img}" alt="${crop.name}">
      <h3>${crop.name}</h3>
      <p><strong>Price:</strong> ${crop.price}</p>
      <p><strong>Farmer:</strong> ${crop.farmer}</p>
      <button onclick="contactFarmer('${crop.farmer}')">Contact</button>
    `;
    listingsEl.appendChild(card);
  });
}

//Contact Farmer

function contactFarmer(name) {
  alert(`📞 Contacting ${name}...`);
}

// Search Crops

function filterCrops() {
  const query = document.getElementById("searchBar").value.toLowerCase();
  const filtered = crops.filter(crop => crop.name.toLowerCase().includes(query));
  renderCrops(filtered);
}

//Sort Crops

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

// Helper
function extractPrice(priceStr) {
  return parseInt(priceStr.replace(/[^\d]/g, "")) || 0;
}

//Post Crop Form

function toggleForm() {
  document.getElementById("postForm").classList.toggle("hidden");
}

function addCrop() {
  const name = document.getElementById("cropName").value.trim();
  const price = document.getElementById("cropPrice").value.trim();
  const farmer = document.getElementById("farmerName").value.trim();
  const img = document.getElementById("cropImg").value.trim() || "assets/default.jpg";

  if (!name || !price || !farmer) {
    alert("⚠️ Please fill all fields!");
    return;
  }

  const newCrop = { name, price, farmer, img };
  crops.unshift(newCrop);
  renderCrops(crops);

  // Reset form
  document.getElementById("cropName").value = "";
  document.getElementById("cropPrice").value = "";
  document.getElementById("farmerName").value = "";
  document.getElementById("cropImg").value = "";
  toggleForm();
  alert("✅ Crop added successfully!");
}
