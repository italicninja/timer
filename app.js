"use strict";
// Favicon
const favicon = document.createElement("link");
favicon.rel = "shortcut icon";
favicon.href = "https://italicninja.github.io/timer/img/favicon.png";
document.head.appendChild(favicon);
// Title
document.title = 'FFXI - Timer';
// Create the header element
const header = document.createElement("header");
header.classList.add("header");
// Create the div with class "top-header"
const topHeader = document.createElement("div");
topHeader.classList.add("top-header");
// Create the h1 element with text content
const h1 = document.createElement("h1");
h1.textContent = "FFXI Time Information";
//// <-- DARK MODE TOGGLE -->
const checkboxInput = document.createElement("input");
checkboxInput.setAttribute("type", "checkbox");
checkboxInput.classList.add("checkbox");
checkboxInput.id = "darklighttoggle";
// Create the label element with a "for" attribute
const label = document.createElement("label");
label.setAttribute("for", "darklighttoggle");
label.classList.add("checkbox-label");
// Create the moon icon element
const moonIcon = document.createElement("i");
moonIcon.classList.add("fas", "fa-moon");
// Create the sun icon element
const sunIcon = document.createElement("i");
sunIcon.classList.add("fas", "fa-sun");
// Create the ball span element
const ballSpan = document.createElement("span");
ballSpan.classList.add("ball");
// Append the moon and sun icons, and the ball span to the label
label.appendChild(moonIcon);
label.appendChild(sunIcon);
label.appendChild(ballSpan);
// Get references to the checkbox input and the label elements
//const checkboxInput = document.getElementById("darklighttoggle");
//const label = document.querySelector(".checkbox-label");
// Apply CSS styles using TypeScript
if (checkboxInput && label) {
    // Apply styles to the checkbox input
    checkboxInput.style.opacity = "0";
    checkboxInput.style.position = "absolute";
    checkboxInput.style.top = "5px"; // Adjust as needed
    checkboxInput.style.right = "5px"; // Adjust as needed
    // Apply styles to the label element
    label.style.backgroundColor = "#111";
    label.style.width = "40px";
    label.style.height = "16px";
    label.style.borderRadius = "50px";
    label.style.position = "relative";
    label.style.padding = "5px";
    label.style.cursor = "pointer";
    label.style.display = "flex";
    label.style.justifyContent = "space-between";
    label.style.alignItems = "center";
}
// Apply styles to the moon icon
//const moonIcon = document.querySelector(".fa-moon");
if (moonIcon) {
    moonIcon.style.color = "#f1c40f";
}
// Apply styles to the sun icon
//const sunIcon = document.querySelector(".fa-sun");
if (sunIcon) {
    sunIcon.style.color = "#f39c12";
}
// Apply styles to the ball element
//const ball = document.querySelector(".ball");
if (ballSpan) {
    ballSpan.style.backgroundColor = "#fff";
    ballSpan.style.width = "22px";
    ballSpan.style.height = "22px";
    ballSpan.style.position = "absolute";
    ballSpan.style.left = "2px";
    ballSpan.style.top = "2px";
    ballSpan.style.borderRadius = "50%";
    ballSpan.style.transition = "transform 0.2s linear";
}
// Add an event listener to the checkbox to handle changes in its state (checked or unchecked)
if (checkboxInput) {
    checkboxInput.addEventListener("change", () => {
        const checked = checkboxInput.checked;
        //const ball = document.querySelector(".ball");
        if (ballSpan) {
            if (checked) {
                ballSpan.style.transform = "translateX(22px)";
                body.style.backgroundColor = '#292c35';
                header.style.color = '#fff';
            }
            else {
                ballSpan.style.transform = "translateX(0)";
                body.style.backgroundColor = '#fff';
                header.style.color = '#000';
            }
        }
    });
}
//// <-- END TOGGLE -->
// Create the first <p> element with links
const firstParagraph = document.createElement("p");
firstParagraph.innerHTML = `Updated for fun by <a href="https://github.com/italicninja">Itallicninja</a>
    (<a href="https://horizonxi.com/players/Kitiara">Kitiara</a> on <a href="https://horizonxi.com">HorizonXI</a>)`;
// Create the second <p> element with text
const secondParagraph = document.createElement("p");
secondParagraph.textContent = "Original by Pyogenes";
// Append all the elements to build the header structure
topHeader.appendChild(h1);
topHeader.appendChild(checkboxInput);
topHeader.appendChild(label);
header.appendChild(topHeader);
header.appendChild(firstParagraph);
header.appendChild(secondParagraph);
const headerCSS = document.getElementById("header");
// Apply CSS styles using TypeScript
if (headerCSS) {
    headerCSS.style.color = "blue";
    headerCSS.style.fontSize = "18px";
    headerCSS.style.backgroundColor = "white";
    headerCSS.style.position = "relative";
    headerCSS.style.border = "0px";
    headerCSS.style.padding = "20px";
}
// Append the header to the body of the HTML document
document.body.appendChild(header);
// Get a reference to the body element
const body = document.body;
if (body) {
    body.style.fontFamily = '"Montserrat", sans-serif';
    body.style.backgroundColor = '#fff';
    body.style.transition = 'background 0.2s linear';
}
// Select anchor elements that match the specified selectors
const anchors = document.querySelectorAll("a, a.more, a.hdline");
// Apply CSS styles using TypeScript
anchors.forEach(anchor => {
    anchor.style.color = "#11a0a0";
    anchor.style.textDecoration = "none";
});
// Create the form element
const timerForm = document.createElement('form');
// Set the name attribute to 'Timer'
timerForm.name = 'Timer';
// Add the class 'Controls' to the form
timerForm.className = 'Controls';
// Append the form to the document body or any other container element
document.body.appendChild(timerForm);
// Create the outer table with class 'blank' and other attributes
const outerTable = document.createElement('table');
// Create the first row
const row1 = outerTable.insertRow();
// Create the first cell in the first row
const cell1 = row1.insertCell();
// Create the inner table inside the first cell
const innerTable1 = document.createElement('table');
innerTable1.className = 'box';
// Create the first row in the inner table
const innerRow1 = innerTable1.insertRow();
// Create the first cell in the inner table's first row
const innerCell1 = innerRow1.insertCell();
// Add content to the first cell in the inner table
innerCell1.innerHTML = `
  <b class="box-header">General Info</b>
  <br><b>Vana'diel Time:</b>
  <br>
  <div id="vTime"> &nbsp; </div>
  <b>Earth Time:</b>
  <br>
  <div id="eTime"> &nbsp; </div>
  <b>Current Moon Phase:</b>
  <br>
  <div id="mPhase"> &nbsp; </div>
  <b>Conquest - Next Tally:</b>
  <br>
  <div id="conquest"> &nbsp; </div>
`;
// Append the inner table to the first cell in the outer table
cell1.appendChild(innerTable1);
// Create the second cell in the first row of the outer table
const cell2 = row1.insertCell();
// Create the inner table inside the second cell
const innerTable2 = document.createElement('table');
innerTable2.className = 'box';
// Create the first row in the inner table
const innerRow2 = innerTable2.insertRow();
// Create the first cell in the inner table's first row
const innerCell2 = innerRow2.insertCell();
// Add content to the second cell in the inner table
innerCell2.innerHTML = `
  <b class="box-header">Crafting Guild Info</b>
  <div id="Guilds"> &nbsp; </div>
`;
// Append the inner table to the second cell in the outer table
cell2.appendChild(innerTable2);
// Create the third cell in the first row of the outer table
const cell3 = row1.insertCell();
// Create the inner table inside the third cell
const innerTable3 = document.createElement('table');
innerTable3.className = 'box';
// Create the first row in the inner table
const innerRow3 = innerTable3.insertRow();
// Create the first cell in the inner table's first row
const innerCell3 = innerRow3.insertCell();
// Add content to the third cell in the inner table
innerCell3.innerHTML = `
  <b><a href="#" onmousedown='javascript:clearDetails()'>
    <b class="box-header">Details</b>
  </a></b>
  <div id="Details"> &nbsp; </div>
`;
// Append the inner table to the third cell in the outer table
cell3.appendChild(innerTable3);
// Append the outer table to the document body or any other container element
document.body.appendChild(outerTable); // You can replace document.body with the desired container element
