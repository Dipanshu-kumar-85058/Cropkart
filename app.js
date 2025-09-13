// =========================
// 1. Splash → Login
// =========================
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("splash").style.display = "none";
    document.getElementById("login").classList.remove("hidden");
  }, 2000); // 2s splash
});

// =========================
// 2. Fake Login
// =========================
function login() {
  const email = document.getElementById("email").value.trim();
  const pass = document.getElementById("password").value.trim();

  if (email && pass) {
    alert("✅ Login successful! Loading marketplace...");
    document.getElementById("login").classList.add("hidden");
    document.getElementById("marketplace").classList.remove("hidden");
    renderDemoCrops(); // load some sample crops
  } else {
    alert("⚠️ Please enter Gmail ID and Password");
  }
}

// =========================
// 3. Render Demo Crops
// =========================
function renderDemoCrops() {
  const demoCrops = [
    { name: "Wheat", price: "₹25/kg", farmer: "Ravi Sharma", img: "assets/wheat.jpg" },
    { name: "Rice", price: "₹40/kg", farmer: "Sunita Devi", img: "assets/rice.jpg" },
    { name: "Tomatoes", price: "₹20/kg", farmer: "Ram Singh", img: "assets/tomatoes.jpg" }
  ];

  const listingsEl = document.getElementById("listings");
  listingsEl.innerHTML = "";

  demoCrops.forEach(crop => {
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

function contactFarmer(name) {
  alert(`📞 Contacting ${name}...`);
}
