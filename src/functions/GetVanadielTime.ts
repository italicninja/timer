/**
 * Calculates and displays the current time in the Vanadiel time system.
 */
// basis date is used to convert real time to game time.
// Use UTC functions to allow calculations to work for any timezone
const basisDate = new Date();
basisDate.setUTCFullYear(2002, 5, 23); // Set date to 2003-06-23
basisDate.setUTCHours(15, 0, 0, 0);    // Set time to 15:00:00.0000

const DayColor = new Array("#DD000", "#AAAA00", "#0000DD", "#00AA22", "#7799FF", "#AA00AA", "#AAAAAA", "#333333");
const VanaDay = new Array("Firesday", "Earthsday", "Watersday", "Windsday", "Iceday", "Lightningday", "Lightsday", "Darksday");

interface LabeledValue {
    label: string;
  }

function getVanadielTime() {
    // Get the current date and time
    const now = new Date();
 
    // Constants
    const msRealDay = 24 * 60 * 60 * 1000;  // Milliseconds in a real-world day
 
    // Calculate Vanadiel date based on the current time
    const vanaDate = ((898 * 360 + 30) * msRealDay) + (now.getTime() - basisDate.getTime()) * 25;
 
    // Calculate Vanadiel components
    const vYear = Math.floor(vanaDate / (360 * msRealDay));
    const vMon = Math.floor((vanaDate % (360 * msRealDay)) / (30 * msRealDay)) + 1;
    const vDate = Math.floor((vanaDate % (30 * msRealDay)) / msRealDay) + 1;
    const vHour = Math.floor((vanaDate % msRealDay) / (60 * 60 * 1000));
    const vMin = Math.floor((vanaDate % (60 * 60 * 1000)) / (60 * 1000));
    const vSec = Math.floor((vanaDate % (60 * 1000)) / 1000);
    const vDay = Math.floor((vanaDate % (8 * msRealDay)) / msRealDay);
 
    return new Date(vYear, vMon, vDate, vHour, vMin, vSec)
 }


     // Format the Vanadiel components with leading zeros if needed
     const VanaYear = (vYear < 1000) ? "0" + vYear : vYear.toString();
     const VanaMon = (vMon < 10) ? "0" + vMon : vMon.toString();
     const VanaDate = (vDate < 10) ? "0" + vDate : vDate.toString();
     const VanaHour = (vHour < 10) ? "0" + vHour : vHour.toString();
     const VanaMin = (vMin < 10) ? "0" + vMin : vMin.toString();
     const VanaSec = (vSec < 10) ? "0" + vSec : vSec.toString();

     // Construct the formatted Vanadiel time string
     const VanaTime = `<DIV onmouseover='javascript:dayDetails(vDay)'><FONT COLOR=${DayColor[vDay]}>${VanaDay[vDay]}</FONT>:  ` +
                     `${VanaYear}-${VanaMon}-${VanaDate}  ${VanaHour}:${VanaMin}:${VanaSec}</DIV>`;

     // Display the formatted Vanadiel time string on the webpage
     const vTimeElement = document.getElementById("vTime");
     if (vTimeElement) {
         vTimeElement.innerHTML = VanaTime;
     }