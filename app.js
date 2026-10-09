const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const destinations = {
  "St. Joseph's Block": ["4 min", "320 m"],
  "St. Peter's Block": ["5 min", "410 m"],
  "St. Francis Block": ["7 min", "620 m"],
  "Madonna Cafeteria": ["6 min", "480 m"],
  "Sports Ground": ["8 min", "710 m"],
  "Central Library": ["5 min", "390 m"],
  "Food Court": ["3 min", "250 m"],
  "Asthra Venue": ["6 min", "520 m"],
  "Main Seminar Hall": ["5 min", "400 m"]
};

function openModal(id){ document.getElementById(id).classList.add("open"); }
function closeModal(id){ document.getElementById(id).classList.remove("open"); }

function showRoute(name){
  const data = destinations[name] || ["6 min","500 m"];
  $("#routeDestination").textContent = name;
  $("#routeEta").textContent = data[0];
  $("#routeDistance").textContent = data[1];
  $("#routeCard").classList.remove("hidden");
  $("#destination").value = name;
}

$$(".destination-chip").forEach(btn => btn.addEventListener("click", () => showRoute(btn.dataset.destination)));
$$(".event-item button").forEach(btn => btn.addEventListener("click", () => {
  closeModal("eventsModal");
  showRoute(btn.dataset.destination);
}));

$("#searchBtn").addEventListener("click", () => {
  const q = $("#destination").value.trim();
  if (!q) return;
  const key = Object.keys(destinations).find(k => k.toLowerCase().includes(q.toLowerCase()));
  showRoute(key || q);
});
$("#destination").addEventListener("keydown", e => {
  if(e.key === "Enter") $("#searchBtn").click();
});
$("#closeRoute").addEventListener("click", () => $("#routeCard").classList.add("hidden"));

$("#qrOpen").addEventListener("click", () => openModal("qrModal"));
$("#adminOpen").addEventListener("click", () => openModal("adminModal"));
$$("[data-close]").forEach(btn => btn.addEventListener("click", () => closeModal(btn.dataset.close)));
$$(".modal-backdrop").forEach(bg => bg.addEventListener("click", e => { if(e.target === bg) bg.classList.remove("open"); }));

$("#simulateScan").addEventListener("click", () => {
  $("#qrSuccess").classList.remove("hidden");
  $("#simulateScan").textContent = "Indoor Position Initialized";
});

$("#adminForm").addEventListener("submit", e => {
  e.preventDefault();
  const ok = $("#adminEmail").value === "admin@sjcetpalai.ac.in" && $("#adminPassword").value === "SJCET@123";
  if(ok){
    closeModal("adminModal");
    alert("Demo admin login successful. Connect this form to your secure backend for the final project.");
  }else{
    $("#adminError").classList.remove("hidden");
  }
});

$("#locateBtn").addEventListener("click", () => {
  if(!navigator.geolocation) return alert("Geolocation is not supported by this browser.");
  navigator.geolocation.getCurrentPosition(
    pos => {
      $("#currentLocation").value = `Current location (±${Math.round(pos.coords.accuracy)} m)`;
    },
    () => alert("Location permission was not available.")
  );
});

$("#recenterBtn").addEventListener("click", () => {
  document.querySelector(".aerial-layer").style.transform = "scale(1.02)";
});
let zoom = 1.02;
$("#zoomIn").addEventListener("click", () => {
  zoom = Math.min(1.35, zoom + .06);
  document.querySelector(".aerial-layer").style.transform = `scale(${zoom})`;
});
$("#zoomOut").addEventListener("click", () => {
  zoom = Math.max(1.0, zoom - .06);
  document.querySelector(".aerial-layer").style.transform = `scale(${zoom})`;
});

$("#aerialBtn").addEventListener("click", () => {
  $("#aerialBtn").classList.add("active");
  $("#mapBtn").classList.remove("active");
  document.querySelector(".aerial-layer").style.filter = "none";
});
$("#mapBtn").addEventListener("click", () => {
  $("#mapBtn").classList.add("active");
  $("#aerialBtn").classList.remove("active");
  // Visual fallback until a real map provider is connected.
  document.querySelector(".aerial-layer").style.filter = "saturate(.72) brightness(1.08)";
});

$$(".nav-item").forEach(btn => btn.addEventListener("click", () => {
  $$(".nav-item").forEach(n => n.classList.remove("active"));
  btn.classList.add("active");
  if(btn.dataset.panel === "facilities") openModal("facilitiesModal");
  if(btn.dataset.panel === "events") openModal("eventsModal");
}));

$("#viewAll").addEventListener("click", () => openModal("facilitiesModal"));
