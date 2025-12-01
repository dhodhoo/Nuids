document.addEventListener("DOMContentLoaded", () => {
  const rsListContainer = document.getElementById("rs-list");
  const searchButton = document.getElementById("search-rs-btn");
  const locationInput = document.getElementById("location-input");

  let map;
  let userLat = -6.9175;
  let userLon = 107.6191;

  function initializeMap(lat, lon) {
    if (map) {
      map.remove();
    }

    map = L.map("map").setView([lat, lon], 14); // Zoom level 14

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    L.marker([lat, lon]).addTo(map).bindPopup("Lokasi Anda").openPopup();
  }

  function getLocationAndSearch() {
    rsListContainer.innerHTML = '<p class="loading-text">Mencari lokasi...</p>';

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          userLat = position.coords.latitude;
          userLon = position.coords.longitude;
          initializeMap(userLat, userLon);
          findNearbyHospitals(userLat, userLon);
        },
        (error) => {
          console.error("Error mendapatkan lokasi:", error);
          rsListContainer.innerHTML =
            '<p class="loading-text">Izin lokasi ditolak. Mencoba dengan lokasi default (Bandung).</p>';
          initializeMap(userLat, userLon);
          findNearbyHospitals(userLat, userLon);
        }
      );
    } else {
      rsListContainer.innerHTML =
        '<p class="loading-text">Browser tidak mendukung Geolocation. Menggunakan lokasi default.</p>';
      initializeMap(userLat, userLon);
      findNearbyHospitals(userLat, userLon);
    }
  }

  async function findNearbyHospitals(lat, lon) {
    rsListContainer.innerHTML =
      '<p class="loading-text">Mencari Rumah Sakit Terdekat...</p>';

    const url = `https://nominatim.openstreetmap.org/search?q=hospital&format=json&limit=15&lat=${lat}&lon=${lon}&addressdetails=1&extratags=1&radius=5000`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      map.eachLayer((layer) => {
        if (
          layer instanceof L.Marker &&
          layer.getPopup().getContent() !== "Lokasi Anda"
        ) {
          map.removeLayer(layer);
        }
      });

      if (data.length > 0) {
        const results = data.map((item) => ({
          name: item.display_name.split(",")[0].trim(),
          lat: item.lat,
          lon: item.lon,
          distance: calculateDistance(
            lat,
            lon,
            parseFloat(item.lat),
            parseFloat(item.lon)
          ),
        }));

        results.sort((a, b) => a.distance.value - b.distance.value);

        populateHospitalList(results);

        results.forEach((rs) => {
          L.marker([rs.lat, rs.lon])
            .addTo(map)
            .bindPopup(`<b>${rs.name}</b><br>${rs.distance.display}`);
        });
      } else {
        rsListContainer.innerHTML =
          '<p class="loading-text">Tidak ada Rumah Sakit ditemukan dalam radius 5km.</p>';
      }
    } catch (e) {
      rsListContainer.innerHTML =
        '<p class="loading-text" style="color: #dc3545;">Gagal terhubung ke API Nominatim.</p>';
      console.error(e);
    }
  }

  // FUNGSI UTILITY: Menghitung Jarak Haversine (Sederhana)
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius Bumi dalam km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = R * c;

    let displayDistance;
    let distanceValue;

    if (distanceKm < 1) {
      distanceValue = Math.round(distanceKm * 1000);
      displayDistance = `${distanceValue} m`;
    } else {
      distanceValue = Math.round(distanceKm * 10) / 10;
      displayDistance = `${distanceValue} km`;
    }

    return { value: distanceKm, display: displayDistance };
  }

  function populateHospitalList(results) {
    rsListContainer.innerHTML = "";

    if (results.length === 0) {
      rsListContainer.innerHTML =
        '<p class="loading-text" style="text-align: center;">Tidak ada Rumah Sakit ditemukan dalam radius pencarian.</p>';
      return;
    }

    results.forEach((rs) => {
      const listItem = document.createElement("div");
      listItem.classList.add("rs-list-item");

      listItem.innerHTML = `
            <span class="rs-name">${rs.name}</span>
            <span class="rs-distance">${rs.distance.display}</span>
        `;

      rsListContainer.appendChild(listItem);
    });
  }

  searchButton.addEventListener("click", () => {
    const location = locationInput.value.trim();
    if (location.toLowerCase() === "dekat saya" || location === "") {
      getLocationAndSearch(); // Mulai dari Geolocation
    } else {
      alert(
        `Pencarian kustom untuk "${location}" belum diimplementasikan. Memuat RS terdekat dari lokasi Anda saat ini.`
      );
      getLocationAndSearch();
    }
  });

  // Mulai proses saat halaman dimuat
  getLocationAndSearch();
});
