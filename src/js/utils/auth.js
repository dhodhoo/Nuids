// Auth object sebagai variabel global
var Auth = {
  initAdmin: function () {
    const user = this.getCurrentUser();

    // Jika bukan admin → tendang!
    if (!user || user.role !== "admin") {
      alert("Akses ditolak! Hanya Admin yang diizinkan.");
      window.location.href = "../../../index.html";
      return false;
    }

    return user;
  },

  // Simpan user ke localStorage
  saveUser: function (userData) {
    localStorage.setItem(userData.email, JSON.stringify(userData));
  },

  // Ambil user berdasarkan email
  getUserByEmail: function (email) {
    const data = localStorage.getItem(email);
    return data ? JSON.parse(data) : null;
  },

  // Set user yang sedang login
  setCurrentUser: function (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    this.updateUserStatus();
  },

  // Ambil user yang sedang login
  getCurrentUser: function () {
    const data = localStorage.getItem("currentUser");
    return data ? JSON.parse(data) : null;
  },

  // Logout
  logout: function () {
    const user = this.getCurrentUser();
    if (user) localStorage.removeItem("online_" + user.email);
    localStorage.removeItem("currentUser");
    window.location.href = "/index.html";
    alert("Anda telah logout");
  },

  // Tandai user online
  setOnline: function () {
    const user = this.getCurrentUser();
    if (user) {
      localStorage.setItem("online_" + user.email, Date.now());
      this.updateUserStatus();
    }
  },

  // ================== REGISTER ==================
  register: function ({ name, email, password }) {
    // Validasi
    if (!name || !email || !password)
      throw new Error("Semua kolom wajib diisi!");
    if (password.length < 8) throw new Error("Password minimal 8 karakter!");
    if (this.getUserByEmail(email)) throw new Error("Email sudah terdaftar!");

    const role = email === "admin@nuids.com" ? "admin" : "user";
    const userData = { name, email, password, role };

    this.saveUser(userData);
    this.setCurrentUser(userData);

    alert("Registrasi berhasil! Selamat datang, " + name + "!");

    setTimeout(() => {
      window.location.href =
        role === "admin"
          ? "../../../src/pages/admin/admin.html"
          : "../../../src/pages/user/home.html";
    }, 1000);
  },

  // ================== LOGIN ==================
  login: function ({ email, password }) {
    const user = this.getUserByEmail(email);

    if (!user)
      throw new Error("Akun tidak ditemukan. Silakan registrasi dulu.");
    if (user.password !== password) throw new Error("Password salah!");

    this.setCurrentUser(user);
    this.setOnline();

    alert(`Selamat datang kembali, ${user.name}!`);
    setTimeout(() => {
      window.location.href =
        user.role === "admin"
          ? "../../../src/pages/admin/admin.html"
          : "../../../src/pages/user/home.html";
    }, 1000);
  },

  // Update status pengguna di UI
  updateUserStatus: function () {
    const user = this.getCurrentUser();
    const userInfoEl = document.getElementById("currentUserInfo");
    const onlineStatusEl = document.getElementById("onlineStatus");

    if (userInfoEl && onlineStatusEl) {
      if (user) {
        userInfoEl.innerHTML = `
                            <p><strong>Nama:</strong> ${user.name}</p>
                            <p><strong>Email:</strong> ${user.email}</p>
                            <p><strong>Role:</strong> ${user.role}</p>
                        `;

        const onlineTime = localStorage.getItem("online_" + user.email);
        if (onlineTime) {
          const time = new Date(parseInt(onlineTime));
          onlineStatusEl.innerHTML = `<p><strong>Terakhir Online:</strong> ${time.toLocaleString()}</p>`;
        } else {
          onlineStatusEl.innerHTML = `<p><strong>Status:</strong> Offline</p>`;
        }
      } else {
        userInfoEl.innerHTML = "<p>Tidak ada pengguna yang login</p>";
        onlineStatusEl.innerHTML = "";
      }
    }
  },
};

// Handler untuk DOM
document.addEventListener("DOMContentLoaded", function () {
  // Cek akses admin di halaman admin
  if (window.location.pathname.includes("/admin/")) {
    Auth.initAdmin();
  }

  // Tab navigation
  const tabs = document.querySelectorAll(".tab");
  const formContainers = document.querySelectorAll(".form-container");

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const tabName = this.getAttribute("data-tab");

      // Update active tab
      tabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");

      // Show active form
      formContainers.forEach((container) => {
        container.classList.remove("active");
        if (
          container.id === tabName + "FormContainer" ||
          container.id === tabName + "Container"
        ) {
          container.classList.add("active");
        }
      });
    });
  });

  // Register Handler
  const regForm = document.getElementById("registerForm");
  if (regForm) {
    regForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const btn = e.target.querySelector("#registerBtn");
      btn.classList.add("loading");
      btn.disabled = true;

      try {
        Auth.register({
          name: document.getElementById("regName").value.trim(),
          email: document.getElementById("regEmail").value.trim().toLowerCase(),
          password: document.getElementById("regPassword").value,
        });
      } catch (err) {
        alert(err.message);
        btn.classList.remove("loading");
        btn.disabled = false;
      }
    });
  }

  // Login Handler
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const btn = e.target.querySelector("#loginBtn");
      btn.classList.add("loading");
      btn.disabled = true;

      try {
        Auth.login({
          email: document
            .getElementById("loginEmail")
            .value.trim()
            .toLowerCase(),
          password: document.getElementById("loginPassword").value,
        });
      } catch (err) {
        alert(err.message);
        btn.classList.remove("loading");
        btn.disabled = false;
      }
    });
  }

  // Logout Handler
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      Auth.logout();
    });
  }

  // Check Admin Access
  const checkAdminBtn = document.getElementById("checkAdminBtn");
  if (checkAdminBtn) {
    checkAdminBtn.addEventListener("click", function () {
      try {
        const result = Auth.initAdmin();
        if (result) {
          alert("Anda adalah admin! Akses diizinkan.");
        }
      } catch (e) {
        alert(e.message);
      }
    });
  }

  const nama = document.querySelectorAll(".adminName");

  nama.forEach((e) => {
    e.textContent = Auth.getCurrentUser().name;
  });

  // Update user status on page load
  Auth.updateUserStatus();
});
