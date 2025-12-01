document.addEventListener("DOMContentLoaded", function () {
  const currentUser = localStorage.getItem("currentUser");
  const user = JSON.parse(currentUser);
  if (currentUser) {
    const userName = document.querySelector(".greeting-text h3");
    userName.textContent = user.name;
  } else {
    window.location.href = "../../../index.html";
  }
});
