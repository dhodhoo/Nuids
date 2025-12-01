// --- DATABASE DUMMY DOKTER (Diperlukan untuk mengisi Modal) ---
// Gunakan data ini untuk mengisi detail di modal
const DOCTORS_DATA = {
  1: {
    id: 1,
    name: "Dr. Ujang Nurhadi, Sp.Gz",
    specialty: "Spesialis Gizi Anak",
    practice: "RS Anak Sehat",
    rating: 4.5,
    reviews: 120,
    status: "busy",
    cost: "Rp 65.000,-",
    description:
      "Dr. Ujang berpengalaman lebih dari 8 tahun dalam menangani kasus kurang gizi, alergi makanan pada anak, dan perencanaan menu tumbuh kembang optimal. Lulusan Universitas Gadjah Mada.",
    img: "https://i.pravatar.cc/150?img=50",
  },
  2: {
    id: 2,
    name: "Dr. Siti Aisyah, Sp.A",
    specialty: "Spesialis Anak",
    practice: "Klinik Tumbuh Kembang",
    rating: 4.9,
    reviews: 350,
    status: "available",
    cost: "Rp 70.000,-",
    description:
      "Dr. Siti ahli dalam pencegahan stunting dan monitoring perkembangan motorik anak. Memiliki pendekatan yang ramah dan mudah dipahami oleh orang tua. Lulusan terbaik Universitas Indonesia.",
    img: "https://i.pravatar.cc/150?img=47",
  },
  3: {
    id: 3,
    name: "Dr. Udin Supriadi, Sp.Gz",
    specialty: "Spesialis Gizi Klinis",
    practice: "Puskesmas Maju",
    rating: 4.8,
    reviews: 88,
    status: "available",
    cost: "Rp 55.000,-",
    description:
      "Dr. Udin fokus pada edukasi gizi seimbang untuk keluarga. Beliau juga aktif dalam program sosialisasi kesehatan masyarakat. Praktik sore hari.",
    img: "https://i.pravatar.cc/150?img=51",
  },
  4: {
    id: 4,
    name: "Dr. Naira S., S.Gz",
    specialty: "Ahli Gizi",
    practice: "Homecare & Online",
    rating: 4.6,
    reviews: 55,
    status: "busy",
    cost: "Rp 45.000,-",
    description:
      "Naira adalah Ahli Gizi terdaftar yang menyediakan konsultasi gizi via online, fokus pada diet khusus dan pola makan vegetarian/vegan untuk anak.",
    img: "https://i.pravatar.cc/150?img=44",
  },
  5: {
    id: 5,
    name: "Dr. Asep Marasep, S.T",
    specialty: "Spesialis Gizi Anak",
    practice: "RS Anak Sehat",
    rating: 4.5,
    reviews: 120,
    status: "available",
    cost: "Rp 65.000,-",
    description:
      "Dr. Asep berpengalaman lebih dari 8 tahun dalam menangani kasus kurang gizi, alergi makanan pada anak, dan perencanaan menu tumbuh kembang optimal. Lulusan Universitas Gadjah Mada.",
    img: "https://i.pravatar.cc/150?img=52",
  },
  6: {
    id: 6,
    name: "Dr. Siti Jannahh, S.Kom",
    specialty: "Spesialis Anak",
    practice: "Klinik Tumbuh Kembang",
    rating: 4.9,
    reviews: 350,
    status: "busy",
    cost: "Rp 70.000,-",
    description:
      "Dr. Jannah ahli dalam pencegahan stunting dan monitoring perkembangan motorik anak. Memiliki pendekatan yang ramah dan mudah dipahami oleh orang tua. Lulusan terbaik Universitas Indonesia.",
    img: "https://i.pravatar.cc/150?img=45",
  },
  7: {
    id: 7,
    name: "Dr. Jauheri Daud, Sp.Gz",
    specialty: "Spesialis Gizi Klinis",
    practice: "Puskesmas Maju",
    rating: 4.8,
    reviews: 88,
    status: "available",
    cost: "Rp 55.000,-",
    description:
      "Dr. Daud fokus pada edukasi gizi seimbang untuk keluarga. Beliau juga aktif dalam program sosialisasi kesehatan masyarakat. Praktik sore hari.",
    img: "https://i.pravatar.cc/150?img=59",
  },
  8: {
    id: 8,
    name: "Dr. Habibie S., S.Gz",
    specialty: "Ahli Gizi",
    practice: "Homecare & Online",
    rating: 4.6,
    reviews: 55,
    status: "available",
    cost: "Rp 45.000,-",
    description:
      "Habibie adalah Ahli Gizi terdaftar yang menyediakan konsultasi gizi via online, fokus pada diet khusus dan pola makan vegetarian/vegan untuk anak.",
    img: "https://i.pravatar.cc/150?img=33",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("doctorModal");
  const closeBtn = document.querySelector(".close-btn");
  const modalBody = document.getElementById("modal-body");
  const doctorCards = document.querySelectorAll(".doctor-card");
  const doctorsLength = Object.keys(DOCTORS_DATA).length;
  for (let i = 1; i <= doctorsLength; i++) {
    checkStatus(i);
  }

  function checkStatus(id) {
    const status = DOCTORS_DATA[id].status;
    if (status === "busy") {
      doctorCards[id - 1].style.filter = "saturate(0)";
    }
  }

  // 1. Fungsi untuk mengisi dan menampilkan Modal
  function openModal(doctorId) {
    const data = DOCTORS_DATA[doctorId];
    if (!data) return;

    // Tentukan tombol Chat statusnya
    const chatButtonHtml =
      data.status === "available"
        ? `<button class="btn-chat">Chat Sekarang</button>`
        : `<button class="btn-chat disabled" disabled>Tidak Tersedia</button>`;

    // Buat konten HTML untuk Modal
    modalBody.innerHTML = `
            <div class="doctor-profile">
                <img src="${data.img}" alt="Foto Dokter ${
      data.name
    }" class="profile-img">
                <h3 class="doctor-name">${data.name}</h3>
                <p class="specialty">${data.specialty}</p>
                <div class="rating"><i class="fa-solid fa-star"></i> ${
                  data.rating
                } (${data.reviews} Review)</div>
            </div>

            <p class="description">${data.description}</p>
            
            <div class="details-grid">
                <div class="detail-item">
                    <strong>Tempat Praktik</strong>
                    <span>${data.practice}</span>
                </div>
                <div class="detail-item">
                    <strong>Status Ketersediaan</strong>
                    <span class="status ${data.status}">${
      data.status === "available" ? "Tersedia" : "Sedang Sibuk"
    }</span>
                </div>
                <div class="detail-item">
                    <strong>Biaya Konsultasi</strong>
                    <span style="color: #f29fa0; font-weight: 700;">${
                      data.cost
                    }</span>
                </div>
                <div class="detail-item">
                    <strong>Jadwal</strong>
                    <span>Lihat Kalender</span>
                </div>
            </div>

            <div class="action-buttons">
                ${chatButtonHtml}
                <button class="btn-booking">Booking Jadwal</button>
            </div>
        `;

    modal.style.display = "block";
  }

  // 2. Event Listener pada setiap Card Dokter
  doctorCards.forEach((card) => {
    card.addEventListener("click", () => {
      const doctorId = card.getAttribute("data-doctor-id");
      openModal(doctorId);
    });
  });

  // 3. Kontrol Tombol Tutup Modal
  closeBtn.onclick = function () {
    modal.style.display = "none";
  };

  // Tutup modal jika user mengklik area di luar modal
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
});
