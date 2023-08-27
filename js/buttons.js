const darklighttoggle = document.getElementById("darklighttoggle")

darklighttoggle.addEventListener("change", () => {
  document.body.classList.toggle("dark", darklighttoggle.checked);
})

function hideGuild() {
  var x = document.getElementById("guildTable");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}