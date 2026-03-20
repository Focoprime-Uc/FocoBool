const menuItems = document.querySelectorAll(".menu-item");
const pages = document.querySelectorAll(".page");

menuItems.forEach(item => {
  item.addEventListener("click", () => {

    // remover ativo
    menuItems.forEach(i => i.classList.remove("active"));
    pages.forEach(p => p.classList.remove("active"));

    // ativar atual
    item.classList.add("active");

    const pageId = item.getAttribute("data-page");
    document.getElementById(pageId).classList.add("active");

  });
});

// THEME
const lightBtn = document.getElementById("lightMode");
const darkBtn = document.getElementById("darkMode");

lightBtn.addEventListener("click", () => {
  document.body.classList.remove("dark");
  lightBtn.classList.add("active");
  darkBtn.classList.remove("active");

  localStorage.setItem("theme", "light");
});

darkBtn.addEventListener("click", () => {
  document.body.classList.add("dark");
  darkBtn.classList.add("active");
  lightBtn.classList.remove("active");

  localStorage.setItem("theme", "dark");
});

/* salvar preferência */
window.addEventListener("load", () => {
  const theme = localStorage.getItem("theme");

  if (theme === "dark") {
    document.body.classList.add("dark");
    darkBtn.classList.add("active");
  } else {
    lightBtn.classList.add("active");
  }
});

function voltarHome() {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById("home").classList.add("active");
}
