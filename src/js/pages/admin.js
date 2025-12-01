// src/js/pages/admin.js

document.addEventListener("DOMContentLoaded", function () {
  const adminName = document.getElementsByClassName("adminName");
  const onlineUserCount = document.getElementById("onlineUserCount");
  const totalRegistrations = document.getElementById("totalRegistrations");

  // --- 1. Cek Sesi dan Tampilkan Nama ---
  const currentUser = localStorage.getItem("currentUser");

  if (currentUser) {
    const user = JSON.parse(currentUser);
    // Tampilkan nama admin
    Array.from(adminName).forEach((el) => {
      el.innerText = user.name || "Admin";
    });

    let totalUsers = 0;
    let allUsers = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      // User disimpan dengan key berupa email
      if (key.includes("@")) {
        try {
          const user = JSON.parse(localStorage.getItem(key));
          if (user && typeof user === "object") {
            totalUsers++;
            allUsers.push(user);
          }
        } catch (error) {
          console.warn("Gagal parse user:", key);
        }
      }
    }

    totalRegistrations.textContent = totalUsers;

    // --- 3. Hitung User Online Berdasarkan LocalStorage ---
    let onlineUsers = 0;
    const now = Date.now();
    const ONLINE_TIMEOUT = 3 * 60 * 1000; // 3 menit

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      // Key online disimpan sebagai: online_email
      if (key.startsWith("online_")) {
        const lastActive = Number(localStorage.getItem(key));

        // Jika user masih aktif < 3 menit lalu, hitung sebagai ONLINE
        if (now - lastActive <= ONLINE_TIMEOUT) {
          onlineUsers++;
        }
      }
    }

    onlineUserCount.textContent = onlineUsers;
  } else {
    // Tidak ada sesi
    alert("Anda harus login untuk mengakses halaman Admin.");
    window.location.href = "../../pages/auth/login.html";
  }
});

// admin_dashboard.js
document.addEventListener("DOMContentLoaded", () => {
  const navItems = Array.from(document.querySelectorAll(".nav-item"));
  if (!navItems.length) {
    console.warn(
      "Tidak ditemukan elemen .nav-item — pastikan class nav-item ada pada link di sidebar."
    );
    return;
  }

  // Mapping aman: map text menu (lowercase, trimmed) ke selector section yang benar.
  const labelToSelector = {
    "dashboard utama": ".main-dashboard",
    dashboard: ".main-dashboard",
    "manajemen user": "#manajemenUser",
    "manajemen pengguna": "#manajemenUser",
    "data gizi": "#dataGizi",
    gizi: "#dataGizi",
    "laporan & analitik": "#laporanAnalitik",
    "laporan dan analitik": "#laporanAnalitik",
    laporan: "#laporanAnalitik",
    "pengaturan sistem": "#pengaturanSistem",
    pengaturan: "#pengaturanSistem",
  };

  // Kumpulkan semua section yang tersedia dari mapping (ada kemungkinan beberapa selector tidak ada)
  const selectors = new Set(Object.values(labelToSelector));
  // tambahkan .main-dashboard jika belum
  selectors.add(".main-dashboard");

  const sectionElements = {};
  selectors.forEach((sel) => {
    try {
      const el = document.querySelector(sel);
      if (el) sectionElements[sel] = el;
      else console.info(`Selector tidak ditemukan di DOM: ${sel}`);
    } catch (e) {
      console.error("Error saat querySelector:", sel, e);
    }
  });

  // Utility: sembunyikan semua section (pakai kelas 'hidden')
  function hideAllSections() {
    Object.values(sectionElements).forEach((el) => {
      el.classList.add("hidden");
      el.classList.remove("show");
    });
  }

  // Utility: tampilkan satu section by selector
  function showSection(selector) {
    const el = sectionElements[selector];
    if (!el) {
      console.warn(
        "Tried to show section but selector not found in sectionElements:",
        selector
      );
      return;
    }
    el.classList.remove("hidden");
    el.classList.add("show");
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Inisialisasi: sembunyikan semua, lalu tampilkan dashboard (default)
  hideAllSections();
  const defaultSelector =
    labelToSelector["dashboard utama"] || ".main-dashboard";
  if (sectionElements[defaultSelector]) {
    showSection(defaultSelector);
  } else {
    // Jika main-dashboard tidak ditemukan, pilih first available
    const first = Object.keys(sectionElements)[0];
    if (first) showSection(first);
  }

  // Tambahkan event click ke tiap nav item
  navItems.forEach((item) => {
    item.addEventListener("click", (ev) => {
      ev.preventDefault(); // penting supaya anchor tidak menavigasi/reload

      // set active class pada menu
      navItems.forEach((n) => n.classList.remove("active"));
      item.classList.add("active");

      // ambil teks menu; jika ada data-target gunakan itu (lebih andal)
      const dataTarget = item.dataset.target?.trim();
      let clickedKey = "";

      if (dataTarget) {
        // jika developer men-set data-target ke selector, gunakan langsung
        clickedKey = dataTarget;
      } else {
        // normalize innerText: lowercase, trim, collapse spaces
        const text = item.textContent || item.innerText || "";
        clickedKey = text.replace(/\s+/g, " ").trim().toLowerCase();
      }

      // jika clickedKey berupa selector langsung (dimulai dengan '#' atau '.'), pakai itu
      if (clickedKey.startsWith("#") || clickedKey.startsWith(".")) {
        if (sectionElements[clickedKey]) {
          hideAllSections();
          showSection(clickedKey);
        } else {
          console.warn(
            "Selector yang diberikan lewat data-target tidak ditemukan:",
            clickedKey
          );
        }
        return;
      }

      // cari mapping dari label ke selector
      const targetSelector = labelToSelector[clickedKey];

      if (targetSelector && sectionElements[targetSelector]) {
        hideAllSections();
        showSection(targetSelector);
      } else {
        console.warn(
          "Tidak ada mapping section untuk menu:",
          clickedKey,
          "— coba periksa label atau tambahkan data-target pada nav item."
        );
      }
    });
  });

  // OPTIONAL: enable navigation via hash (contoh: #manajemenUser)
  window.addEventListener("hashchange", () => {
    const hash = location.hash.replace("#", "");
    if (!hash) return;
    const byId = `#${hash}`;
    if (sectionElements[byId]) {
      // set active nav jika ada yang match text dengan hash
      navItems.forEach((n) => {
        if (
          n.dataset.target === byId ||
          (n.textContent || "").toLowerCase().includes(hash.toLowerCase())
        ) {
          navItems.forEach((m) => m.classList.remove("active"));
          n.classList.add("active");
        }
      });
      hideAllSections();
      showSection(byId);
    }
  });
});

// =======================================================
// REALTIME USER LIST + USER TABLE + ONLINE STATUS
// =======================================================
function getAllUsers() {
  const users = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    // hanya key email
    if (key.includes("@")) {
      try {
        const user = JSON.parse(localStorage.getItem(key));
        if (user && typeof user === "object") {
          users.push(user);
        }
      } catch {}
    }
  }

  return users;
}

function getOnlineUsers() {
  const now = Date.now();
  const ONLINE_TIMEOUT = 3 * 60 * 1000;
  const online = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    if (key.startsWith("online_")) {
      const lastActive = Number(localStorage.getItem(key));

      if (now - lastActive <= ONLINE_TIMEOUT) {
        const email = key.replace("online_", "");
        online.push(email);
      }
    }
  }

  return online;
}

function updateOnlineUserList() {
  const listEl = document.getElementById("onlineUserList");
  if (!listEl) return;

  const online = getOnlineUsers();

  listEl.innerHTML = "";

  if (online.length === 0) {
    listEl.innerHTML = "<li>Tidak ada user online</li>";
    return;
  }

  online.forEach((email) => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="status-dot online"></span> ${email}`;
    listEl.appendChild(li);
  });
}

function updateUserTable() {
  const tableBody = document.getElementById("userTableBody");
  if (!tableBody) return;

  const users = getAllUsers();
  const online = getOnlineUsers();

  tableBody.innerHTML = "";

  users.forEach((user) => {
    const row = document.createElement("tr");

    const isOnline = online.includes(user.email);

    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>
        <span class="status-dot ${isOnline ? "online" : "offline"}"></span>
        ${isOnline ? "Online" : "Offline"}
      </td>
      <td><button class="btn-secondary user-detail-btn">Detail</button></td>
    `;
    row.querySelector(".user-detail-btn").addEventListener("click", () => {
      openUserDetail(user);
    });
    tableBody.appendChild(row);
  });
}

function filterUsers() {
  const searchValue = document
    .getElementById("searchUserInput")
    .value.toLowerCase();
  const statusFilter = document.getElementById("filterUserStatus").value;

  const rows = document.querySelectorAll("#userTableBody tr");

  rows.forEach((row) => {
    const name = row.children[0].textContent.toLowerCase();
    const email = row.children[1].textContent.toLowerCase();
    const statusText = row.children[2].textContent.trim().toLowerCase();

    let visible = true;

    if (
      searchValue &&
      !(name.includes(searchValue) || email.includes(searchValue))
    ) {
      visible = false;
    }

    if (statusFilter !== "all" && !statusText.includes(statusFilter)) {
      visible = false;
    }

    row.style.display = visible ? "" : "none";
  });
}

document
  .getElementById("searchUserInput")
  .addEventListener("input", filterUsers);
document
  .getElementById("filterUserStatus")
  .addEventListener("change", filterUsers);
// buka modal detail
function openUserDetail(user) {
  document.getElementById("modalUserName").textContent = user.name;
  document.getElementById("modalUserEmail").textContent = user.email;
  document.getElementById("modalUserRole").textContent = user.role || "User";
  document.getElementById("modalUserDate").textContent =
    user.date || "Tidak tersedia";

  const online = getOnlineUsers();
  const isOnline = online.includes(user.email);

  document.getElementById("modalUserStatus").textContent = isOnline
    ? "Online"
    : "Offline";

  document.getElementById("userDetailModal").classList.remove("hidden");
}

document.getElementById("closeUserModal").addEventListener("click", () => {
  document.getElementById("userDetailModal").classList.add("hidden");
});

// ketika klik background modal
document.getElementById("userDetailModal").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) {
    e.currentTarget.classList.add("hidden");
  }
});

function getAllDoctors() {
  const doctors = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    if (key.startsWith("doctor_")) {
      try {
        const doc = JSON.parse(localStorage.getItem(key));
        doc.id = key;
        doctors.push(doc);
      } catch {}
    }
  }

  return doctors;
}

function updateDoctorTable() {
  const body = document.getElementById("doctorTableBody");
  if (!body) return;

  const doctors = getAllDoctors();
  body.innerHTML = "";

  doctors.forEach((doc) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${doc.name}</td>
      <td>${doc.specialist}</td>
      <td>
        <span class="status-dot ${
          doc.status === "ready" ? "online" : "offline"
        }"></span>
        ${doc.status}
      </td>
      <td><button class="btn-secondary">Ubah</button></td>
    `;

    row.querySelector("button").addEventListener("click", () => {
      const newStatus = prompt(
        "Masukkan status baru (ready/busy/offline):",
        doc.status
      );
      if (newStatus) {
        doc.status = newStatus;
        localStorage.setItem(doc.id, JSON.stringify(doc));
        updateDoctorTable();
      }
    });

    body.appendChild(row);
  });
}

// =======================================================
// JALANKAN SETIAP 4 DETIK (REALTIME UPDATE)
// =======================================================
setInterval(() => {
  updateOnlineUserList();
  updateUserTable();
  updateDoctorTable();

  const online = getOnlineUsers();
  const onlineCounter = document.getElementById("onlineUserCount");
  if (onlineCounter) onlineCounter.textContent = online.length;
}, 4000);

// Tunggu 500ms agar DOM stabil lalu update pertama kali
setTimeout(() => {
  updateOnlineUserList();
  updateUserTable();
}, 500);
