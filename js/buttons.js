const checkbox = document.getElementById("darklighttoggle")
checkbox.addEventListener("change", () => {
  document.body.classList.toggle("dark")
})

function hideGuild() {
  var x = document.getElementById("guildTable");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}