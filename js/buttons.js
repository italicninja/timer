// Wait for the DOM content to load before working with elements
document.addEventListener("DOMContentLoaded", function() {
  const darklighttoggle = document.getElementById("darklighttoggle");

  darklighttoggle.addEventListener("change", () => {
    // Use the checked property to determine the toggle state
    if (darklighttoggle.checked) {
      document.body.classList.add("dark");
      document.box.classList.add("dark");
      document.blank.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
      document.box.classList.remove("dark");
      document.blank.classList.remove("dark");
    }
  });
});

/* function hideGuild() {
  var x = document.getElementById("guildTable");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
} */