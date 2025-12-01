document.addEventListener("DOMContentLoaded", () => {
  const dropArea = document.getElementById("drop-area");
  const foodPict = document.getElementById("food-picture");
  const imgView = document.getElementById("img-view");
  const btnSubmit = document.getElementById("submit-food");
  const inputNama = document.getElementById("nama-makanan");

  const foodDatabase = {
    "nasi goreng": {
      kalori: 250,
      protein: 20,
      karbo: 30,
      lemak: 10,
    },
    "ayam goreng": {
      kalori: 300,
      protein: 25,
      karbo: 5,
      lemak: 15,
    },
    seblak: {
      kalori: 500,
      protein: 5,
      karbo: 60,
      lemak: 20,
    },
  };

  function outputImage(file) {
    if (file) {
      const imgURL = URL.createObjectURL(file);

      imgView.innerHTML = "";

      imgView.style.backgroundImage = `url(${imgURL})`;
      imgView.style.backgroundPosition = "center";
      imgView.style.backgroundSize = "cover";
      imgView.style.backgroundRepeat = "no-repeat";
      imgView.style.border = "none";
    }
  }

  foodPict.addEventListener("change", function () {
    outputImage(this.files[0]);
  });

  dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.style.transform = "scale(0.98)";
  });

  dropArea.addEventListener("dragleave", () => {
    dropArea.style.transform = "scale(1)";
  });

  dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dropArea.style.transform = "scale(1)";
    foodPict.files = e.dataTransfer.files;
    outputImage(e.dataTransfer.files[0]);
  });

  btnSubmit.addEventListener("click", () => {
    const foodName = inputNama.value.toLowerCase().trim();

    if (foodDatabase[foodName]) {
      const data = foodDatabase[foodName];
      updateNutritionUI(data);
    } else {
      alert(
        `Maaf, data untuk "${inputNama.value}" tidak ditemukan. Coba: Nasi Goreng, Ayam Goreng, atau Seblak.`
      );
    }
  });

  function updateNutritionUI(data) {
    document.getElementById("kalori").innerHTML = `${data.kalori} kcal`;
    document.getElementById("protein").innerText = `${data.protein}g`;
    document.getElementById("karbo").innerText = `${data.karbo}g`;
    document.getElementById("lemak").innerText = `${data.lemak}g`;

    updateBar("protein", data.protein, 50);
    updateBar("karbo", data.karbo, 100);
    updateBar("lemak", data.lemak, 50);
  }

  function updateBar(id, value, max) {
    const valueElement = document.getElementById(id);
    const parentItem = valueElement.parentElement;
    const barElement = parentItem.querySelector(".bar");

    if (barElement) {
      let percentage = (value / max) * 100;
      if (percentage > 100) percentage = 100;

      barElement.style.setProperty("--w", `${percentage}%`);
    }
  }
});
