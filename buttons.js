const checkbox = document.getElementById("darklighttoggle")
checkbox.addEventListener("change", () => {
  document.body.classList.toggle("dark")
})