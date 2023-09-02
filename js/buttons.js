// Wait for the DOM content to load before working with elements
document.addEventListener("DOMContentLoaded", function() {
  const darklighttoggle = document.getElementById("darklighttoggle");

  darklighttoggle.addEventListener("change", () => {
    // Use the checked property to determine the toggle state
    if (darklighttoggle.checked) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  });
});
