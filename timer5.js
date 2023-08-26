<!--

//  Usage:  Functions to calculate and format timing data for FFXI
//  Written by:  Pyogenes from www.pyogenes.com

///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//                                                               //
//    CODE IS FREE FOR USE AS LONG AS YOU GIVE CREDIT            //
//    1.  List my website as the source                          //
//    2.  Place a link on the page the code is used in           //
//                                                               //
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

// basis date is used to convert real time to game time.
// Use UTC functions to allow calculations to work for any timezone
basisDate = new Date();
basisDate.setUTCFullYear(2002, 5, 23); // Set date to 2003-06-23
basisDate.setUTCHours(15, 0, 0, 0);    // Set time to 15:00:00.0000

// moon date is used to determien the current hase of the moon.
// Use UTC functions to allow calculations to work for any timezone
Mndate = new Date();
Mndate.setUTCFullYear(2004, 0, 25); // Set date to 2004-01-25
Mndate.setUTCHours(2, 31, 12, 0);    // Set time to 02:31:12.0000

// basis date for RSE calculations
RSEdate = new Date();
RSEdate.setUTCFullYear(2004, 0, 28); // Set date to 2004-01-28
RSEdate.setUTCHours(9, 14, 24, 0);    // Set time to 09:14:24.0000

// basis date for day of week calculations
Daydate = new Date();
Daydate.setUTCFullYear(2004, 0, 28); // Set date to 2004-01-28
Daydate.setUTCHours(9, 14, 24, 0);    // Set time to 09:14:24.0000

EarthDay = new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
VanaDay = new Array("Firesday", "Earthsday", "Watersday", "Windsday", "Iceday", "Lightningday", "Lightsday", "Darksday");
DayColor = new Array("#DD000", "#AAAA00", "#0000DD", "#00AA22", "#7799FF", "#AA00AA", "#AAAAAA", "#333333"); 
weakMagic = new Array("Ice","Lightning","Fire","Earth","Wind","Water","Darkness","Light");
weakColor = new Array("#7799FF", "#AA00AA", "#DD000", "#AAAA00", "#00AA22", "#0000DD", "#333333", "#AAAAAA");
PhaseName = new Array("Full Moon","Waning Gibbous","Last Quarter","Waning Crescent","New Moon","Waxing Crescent","First Quarter","Waxing Gibbous");

sMonth = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
RSErace = new Array("M. Hume","F. Hume","M. Elvaan","F. Elvaan","M. TaruTaru","F. TaruTaru","Mithra","Galka");
RSEloc = new Array("Gusgen Mines","Shakrami Maze","Ordelle Caves");
BoatSched = new Array("08:00", "16:00", "00:00");
BoatSched2 = new Array("06:30", "14:30", "22:30");
BoatDayOffset = new Array(0,0,7);

msGameDay	= (24 * 60 * 60 * 1000 / 25); // milliseconds in a game day
msRealDay	= (24 * 60 * 60 * 1000); // milliseconds in a real day

balJug = new Array("","Entry ","Match ","Closing Ceremony ","","");
balPas = new Array("", "", "", "Entry ","Match ","Closing Ceremony ");
balMer = new Array("Match ","Closing Ceremony ", "", "", "", "Entry ");
balJugTeam = new Array("San D'oria vs Bastok", "Bastok vs Windurst", "San D'oria vs Windurst");
balPasTeam = new Array("Bastok vs Windurst", "San D'oria vs Windurst", "San D'oria vs Bastok");
balMerTeam = new Array("San D'oria vs Windurst", "San D'oria vs Bastok", "Bastok vs Windurst");


//**************
// Functions  **
//**************


function getVanadielTime()  {

   var now = new Date();
   vanaDate =  ((898 * 360 + 30) * msRealDay) + (now.getTime() - basisDate.getTime()) * 25;

   vYear = Math.floor(vanaDate / (360 * msRealDay));
   vMon  = Math.floor((vanaDate % (360 * msRealDay)) / (30 * msRealDay)) + 1;
   vDate = Math.floor((vanaDate % (30 * msRealDay)) / (msRealDay)) + 1;
   vHour = Math.floor((vanaDate % (msRealDay)) / (60 * 60 * 1000));
   vMin  = Math.floor((vanaDate % (60 * 60 * 1000)) / (60 * 1000));
   vSec  = Math.floor((vanaDate % (60 * 1000)) / 1000);
   vDay  = Math.floor((vanaDate % (8 * msRealDay)) / (msRealDay));

   if (vYear < 1000) { VanaYear = "0" + vYear; } else { VanaYear = vYear; }
   if (vMon  < 10)   { VanaMon  = "0" + vMon; }  else { VanaMon  = vMon; }
   if (vDate < 10)   { VanaDate = "0" + vDate; } else { VanaDate = vDate; }
   if (vHour < 10)   { VanaHour = "0" + vHour; } else { VanaHour = vHour; }
   if (vMin  < 10)   { VanaMin  = "0" + vMin; }  else { VanaMin  = vMin; }
   if (vSec  < 10)   { VanaSec  = "0" + vSec; }  else { VanaSec  = vSec; }

   VanaTime = "<DIV onmouseover='javascript:dayDetails(vDay)'><FONT COLOR=" + DayColor[vDay] + ">" + VanaDay[vDay] + "</FONT>:  " 
   VanaTime += VanaYear + "-" + VanaMon + "-" + VanaDate + "  " + VanaHour + ":" + VanaMin + ":" + VanaSec + "</DIV>";

   document.getElementById("vTime").innerHTML = VanaTime;
    
   getBallistaSummary(vDate, vMon);
}

function getBallistaSummary(vDate, vMon)  {
   out = "";
   for ( i = 0; i < 3; i++) {
      vDate = vDate + 1;
      if (vDate > 30) {
         vDate = 1;
         vMon = vMon + 1;
      }


      if (vDate <= 6)  {
         balLimit = "30";
      } else if (vDate <=12)  {
         balLimit = "40";
      } else if (vDate <=18)  {
         balLimit = "50";
      } else if (vDate <=24)  {
         balLimit = "60";
      } else if (vDate <=30)  {
         balLimit = "None";
      }

      balTeam = Math.floor((vMon - 1) / 4);
   
      balJugner = balJug[vDate % 6];
      if (balJugner != "") {
         balJugner = "Jugner Forest: " + balJugner + "for " + balJugTeam[balTeam] + " with a level cap of: " + balLimit + "<BR>";
      }
      balPashhow = balPas[vDate % 6];
         if (balPashhow != "") {
            balPashhow = "Pashhow Marshlands: " + balPashhow + "for " + balPasTeam[balTeam] + " with a level cap of: " + balLimit + "<BR>";
      }
      balMeriph = balMer[vDate % 6];
         if (balMeriph != "") {
            balMeriph = "Meriphataud Mountains: " + balMeriph + "for " + balMerTeam[balTeam] + " with a level cap of: " + balLimit + "<BR>";
      }
      
      out = out + balJugner + balPashhow + balMeriph + "<HR>";
   }

}

function dayDetails(firstDay)  {

   out = '<TABLE CLASS="blank" CELLPADDING="0" CELLSPACING="0">';
   out = out + '<TR><TH WIDTH=80 ALIGN="left">Day</TH><TH>Weak Element</TH></TR>';
   out = out + '<TR><TD VALIGN="TOP">';
   for ( i = 0; i < 8; i++) {
      if (i != 0) { out = out + '<BR>';}
      out = out + '<FONT COLOR=' + DayColor[(firstDay + i) % 8] + '>' + VanaDay[(firstDay + i) % 8] + '</FONT>';
   }
   
   out = out + '</TD><TD>';
   for ( i = 0; i < 8; i++) {
      if (i != 0) { out = out + '<BR>';}
      out = out + '<FONT COLOR=' + weakColor[(firstDay + i) % 8] + '>' + weakMagic[(firstDay + i) % 8] + '</FONT>';
   }
   
   out = out + '</TD></TR></TABLE>'
   document.getElementById("Details").innerHTML = out;

}

function clearDetails()  {

      document.getElementById("Details").innerHTML = '';

}

function getEarthTime()  {

   var now = new Date();
   earthTime = formatDate(now.getTime(), 1);
   document.getElementById("eTime").innerHTML = earthTime;

}

function getConquest()  {

   var now = new Date();
   var timeLeft = (7 * msRealDay) - ((now.getTime() - basisDate.getTime()) % (7 * msRealDay));
   vanaConq = Math.floor(timeLeft / (msGameDay)) + 1;

   conqDays = timeLeft / msRealDay;
   conqHours = (conqDays - Math.floor(conqDays)) * 24;
   conqMin = (conqHours - Math.floor(conqHours)) * 60;
   conqSec = Math.floor((conqMin - Math.floor(conqMin)) * 60);

   if (conqDays < 10) { conqDays = '0' + Math.floor(conqDays); } else { conqDays = Math.floor(conqDays); }
   if (conqHours < 10) { conqHours = '0' + Math.floor(conqHours ); } else { conqHours = Math.floor(conqHours ); }
   if (conqMin < 10) { conqMin = '0' + Math.floor(conqMin ); } else { conqMin = Math.floor(conqMin ); }
   if (conqSec < 10) { conqSec = '0' + Math.floor(conqSec ); } else { conqSec = Math.floor(conqSec ); }
   
   conqDate = formatDate(now.getTime() + timeLeft, 2);

   conq = vanaConq + ' Vana´diel Days <BR>' + conqDate + ' (' + formatCountdown(timeLeft) + ')';
   document.getElementById("conquest").innerHTML = conq;
}

function getRSE()  {
   var timenow = new Date();
   var localtime = timenow.getTime();
   var RSEtime = RSEdate.getTime();
   var repeatCal = document.Timer.RSE.value;
   var race = document.Timer.RSErace.value;

   if (race > 7) {
      RSECal = "<TABLE CLASS='blank' CELLPADDING='0' CELLSPACING='0'><TR><TH WIDTH='120' ALIGN='LEFT'>Date & Time</TH><TH WIDTH='90' ALIGN='LEFT'>Race</TH><TH WIDTH='90' ALIGN='LEFT'>Location</TH></TR>"
      for ( i = 0; i < repeatCal; i++) {
         elapsedWeeks = Math.floor( (localtime - RSEtime) / (8 * msGameDay) ) + i;
         RSEstart = RSEtime + (elapsedWeeks * 8 * msGameDay);
         RSECal = RSECal + "<TR><TD>" + formatDate(RSEstart,2) + '</TD><TD>' + RSErace[elapsedWeeks % 8] + '</TD><TD>';
         RSECal = RSECal + "<A HREF=#  onmousedown='javascript:getRSEDetails(" + (elapsedWeeks % 3) + ")'>";
         RSECal = RSECal + RSEloc[elapsedWeeks % 3]
         RSECal = RSECal + '</A></TD></TR>';
      }
     if (repeatCal < 1) { RSECal = ""; } else { RSECal = RSECal + '</TABLE>'; }
   } else {
      RSECal = "<TABLE CLASS='blank' CELLPADDING='0' CELLSPACING='0'><TR><TH WIDTH='120' ALIGN='LEFT'>Start</TH><TH WIDTH='120' ALIGN='LEFT'>End</TH><TH WIDTH='60' ALIGN='LEFT'>Location</TH></TR>"
      offsetTime = race * 8 * msGameDay;

      for ( i = 0; i < repeatCal; i++) {
         elapsedWeeks = Math.floor( (localtime - RSEtime) / (64 * msGameDay) ) + i;
         
         elapsedLocationWeeks = Math.floor( (localtime - RSEtime) / (8 * msGameDay) ) + (8 * i);
         raceOffset = race - (elapsedLocationWeeks % 8);
         elapsedLocationWeeks = elapsedLocationWeeks + raceOffset;

         RSEstart = RSEtime + (elapsedWeeks * 64 * msGameDay) + offsetTime ;
         RSEend = RSEstart + (8 * msGameDay);
         RSECal = RSECal + "<TR><TD>" + formatDate(RSEstart,2) + "</TD><TD>" + formatDate(RSEend,2) + "</TD><TD>";
         RSECal = RSECal + "<A HREF=#  onmousedown='javascript:getRSEDetails(" + (elapsedLocationWeeks % 3) + ")'>";
         RSECal = RSECal + RSEloc[(elapsedLocationWeeks) % 3] 
         RSECal = RSECal + "</A></TD></TR>";
      }
     if (repeatCal < 1) { RSECal = ""; } else { RSECal = RSECal + '</TABLE>'; }

   }

   document.getElementById("rCal").innerHTML = RSECal;


}

function getRSEDetails(varLocation)  {

   if (varLocation == 0)  {
      output = "<TABLE CLASS='blank'><TR><TH ALIGN='left'>Key Droppers</TH><TH></TH><TH></TH></TR>";
      output = output + "<TR><TD VALIGN = 'TOP' WIDTH='75'>Sad Fly<BR>Gallinipper<BR>Rancid Ooze<BR>";      
      output = output + "Banshee<BR>Mauthe Dog<BR>Myconid<BR>Wight</TD>";
      output = output + "<TD VALIGN = 'TOP' WIDTH='85'>Ghast<BR>Wendigo<BR>Spunkie<BR>";
      output = output + "Amphisbeana<BR>Thunder Elemental<BR>Greater Pugil</TD>";
      output = output + "</TR></TABLE>";

   } else if (varLocation == 1) {
      output = "<TABLE CLASS='blank'><TR><TH ALIGN='left'>Key Droppers</TH><TH></TH></TR>";
      output = output + "<TR><TD VALIGN = 'TOP'>Goblin Furrier<BR>Goblin Shaman<BR>";
      output = output + "Goblin Pathfinder<BR>Goblin Smithy<BR>Caterchipillar<BR>Wight<BR>";
      output = output + "<TD VALIGN = 'TOP' WIDTH='75'>Labyrinth Scorpion<BR>Abyss Worm<BR>Protozoan<BR>Air Elemental<BR>";
      output = output + "Ichorous Ire</TD></TR></TABLE>";

   } else if (varLocation == 2) {
      output = "<TABLE CLASS='blank'><TR><TH ALIGN='left'>Key Droppers</TH><TH></TH></TR>";
      output = output + "<TR><TD VALIGN = 'TOP' WIDTH='75'>Air Elemental<BR>Goblin Shaman<BR>Goblin Smithy<BR>";
      output = output + "Goblin Pathfinder<BR>Goliath Beetle<BR></TD>";
      output = output + "<TD VALIGN = 'TOP' WIDTH='90'>Napam<BR>Stroper<BR>";
      output = output + "Stroper Chyme<BR>Water Elemental</TD>";
      output = output + "</TR></TABLE>";

   }

   document.getElementById("Details").innerHTML = output;
}


function getMoonPhase()  {

   var timenow = new Date();
   var localTime = timenow.getTime();
   var moonDays = (Math.floor((localTime - Mndate.getTime()) / msGameDay))  % 84;

   var mnElapsedTime = (localTime - Mndate.getTime()) % msGameDay;

   // determine phase percentage
         moonpercent = - Math.round((42 - moonDays) / 42 * 100);
         if (moonpercent <= -94)  {
            mnPhase = 0;
            optPhase = 4;
            toNextPhase = (3 - moonDays) * msGameDay - mnElapsedTime;
            toOptimalPhase = (38 - moonDays) * msGameDay - mnElapsedTime;

         }  else if (moonpercent >= 90)  {
	    mnPhase = 0;
            optPhase = 4;
            toNextPhase = (87 - moonDays) * msGameDay - mnElapsedTime;
            toOptimalPhase = (38 + 84 - moonDays) * msGameDay - mnElapsedTime;

         }  else if (moonpercent >= -93 && moonpercent <= -62)  {
	      mnPhase = 1;
            optPhase = 4;
            toNextPhase = (17 - moonDays) * msGameDay - mnElapsedTime;
            toOptimalPhase = (38 - moonDays) * msGameDay - mnElapsedTime;

         }  else if (moonpercent >= -61 && moonpercent <= -41)  {
	      mnPhase = 2;
            optPhase = 4;
            toNextPhase = (25 - moonDays) * msGameDay - mnElapsedTime;
            toOptimalPhase = (38 - moonDays) * msGameDay - mnElapsedTime;

         }  else if (moonpercent >= -40 && moonpercent <= -11)  {
	      mnPhase = 3;
            optPhase = 4;
            toNextPhase = (38 - moonDays) * msGameDay - mnElapsedTime;
            toOptimalPhase = (38 - moonDays) * msGameDay - mnElapsedTime;

         }  else if (moonpercent >= -10 && moonpercent <= 6)  {
	      mnPhase = 4;
            optPhase = 0;
            toNextPhase = (45 - moonDays) * msGameDay - mnElapsedTime;
            toOptimalPhase = (80 - moonDays) * msGameDay - mnElapsedTime;

         }  else if (moonpercent >= 7 && moonpercent <= 36)  {
	      mnPhase = 5;
            optPhase = 0;
            toNextPhase = (58 - moonDays) * msGameDay - mnElapsedTime;
            toOptimalPhase = (80 - moonDays) * msGameDay - mnElapsedTime;

         }  else if (moonpercent >= 37 && moonpercent <= 56)  {
	      mnPhase = 6;
            optPhase = 0;
            toNextPhase = (66 - moonDays) * msGameDay - mnElapsedTime;
            toOptimalPhase = (80 - moonDays) * msGameDay - mnElapsedTime;

         }  else if (moonpercent >= 57 && moonpercent <= 89)  {
	      mnPhase = 7;
            optPhase = 0;
            toNextPhase = (60 - moonDays) * msGameDay - mnElapsedTime;
            toOptimalPhase = (80 - moonDays) * msGameDay - mnElapsedTime;
         }

         mnpercent = PhaseName[mnPhase] + " (" + Math.abs(moonpercent) + "%)";

         if (moonpercent <= 5 && moonpercent >= -10)  {
              mnpercent = "<FONT COLOR='#FF0000'>" + mnpercent+ "</FONT>";
         } else if (moonpercent >= 90 || moonpercent <= -95)  {
              mnpercent = "<FONT COLOR='#0000FF'>" + mnpercent+ "</FONT>";
         }

   nextPhase = "Next phase (" + PhaseName[(mnPhase + 1) % 8] + "): " + formatCountdown(toNextPhase);
   nextOptPhase = "Next " + PhaseName[optPhase] + ": " + formatCountdown(toOptimalPhase);

   mnpercent = "<DIV onmouseover='javascript:getMoonDetails()'>" + mnpercent + "</DIV>  ";
   
   document.getElementById("mPhase").innerHTML = mnpercent + nextPhase + "<BR>" + nextOptPhase;



   // new moon starts on day 38 (-10%)
   // full moon starts at 80 (90%)
   // Moon cycle lasts 84 game days.

   // Determine most recent full moon
   var fullMoonBasis = Mndate.getTime() + (3 * msGameDay);
   var repeatCal = document.Timer.Moon.value;

   moonCal = "<TABLE CLASS='blank' CELLSPACING='0' CELLPADDING='0'><TR><TH WIDTH='95' ALIGN='left'>New Moon Start</TH><TH WIDTH='105' ALIGN='left'>New Moon End</TH><TH WIDTH='95' ALIGN='left'>Full Moon Start</TH><TH WIDTH='78' ALIGN='left'>Full Moon End</TH></TR>";
   for ( i = 0; i < repeatCal; i++)  {
      elapsedCycles = Math.floor( (localTime - fullMoonBasis) / (84 * msGameDay) ) + i;
      FullEnd = fullMoonBasis + (elapsedCycles * 84 * msGameDay);
      //Full Moon starts 7 games days prior to end
      FullStart = FullEnd - 7 * msGameDay;
      //New Moon starts 49 games days prior to Full Moon end
      NewStart = FullEnd - 49 * msGameDay;
      //New Moon ends 42 games days prior to Full Moon end
      NewEnd = FullEnd - 42 * msGameDay;

      moonCal = moonCal + "<TR><TD>" + formatDate(NewStart, 2) + "</TD><TD>" + formatDate(NewEnd, 2) + "</TD><TD>" + formatDate(FullStart,2) + "</TD><TD>" + formatDate(FullEnd, 2) + "</TD></TR>";
   }
   if (repeatCal < 1) { moonCal = ""; } else { moonCal = moonCal + '</TABLE>'; }
   document.getElementById("mCalendar").innerHTML = moonCal;

}

function getMoonDetails()  {

   out = "Moon Information:";
   out = out + "<BR>Each lunar cycle takes exactly 84 game days (3 days, 8 hours, 38 minutes, 24 seconds)";
   
   document.getElementById("Details").innerHTML = out;


}

function getShipSched()  {

   // Boats depart at 00:00, 08:00, 16:00 from both Selbina and Mhuara
   // Boats arrive at 06:30, 14:30, 22:30 which is 216 seconds before they leave
   var now = new Date();
   var timeDiff = now.getTime() - basisDate.getTime();
   var hours = Math.floor((timeDiff / ( msGameDay / 3)) % 3);

   var timeLeft = (msGameDay / 3 ) - (timeDiff % (msGameDay / 3));

   var repeatFerry = document.Timer.FerryCount.value;

   bSched = "<TABLE CLASS='blank' CELLSPACING='0' CELLPADDING='0'><TR><TH WIDTH='80' ALIGN='left'>Arrives</TH>";
   bSched = bSched + "<TH WIDTH='45'></TH><TH ALIGN='left' WIDTH='80'>ETA</TH>";
   bSched = bSched + "<TH WIDTH='80' ALIGN='left'>Departs</TH><TH WIDTH='45'></TH>";
   bSched = bSched + "<TH ALIGN='left' WIDTH='45'>ETD</TH></TR>";

   vanaDate =  ((898 * 360 + 30) * msRealDay) + (timeDiff) * 25;
   vDay  = Math.floor((vanaDate % (8 * msRealDay)) / (msRealDay));

   for ( i = 0; i < repeatFerry; i++) {
      timeLeftLoop = timeLeft + ( i* msGameDay / 3);
      dPos = (vDay + Math.floor((hours + 1 + i)/3)) % 8;
      dPos2 = (dPos + BoatDayOffset[(hours + i) % 3]) % 8;
      arrivalTime = timeLeftLoop - 216000;
      if (arrivalTime <= 0)
         arrivalTime = 0;

      bSched = bSched + '<TR><TD><FONT COLOR="' + DayColor[dPos2] + '">' + VanaDay[dPos2] + '</FONT></TD><TD>' + BoatSched2[(hours + i) % 3] + '</TD><TD>' + formatCountdown(arrivalTime) + '</TD><TD><FONT COLOR="' + DayColor[dPos] + '">' + VanaDay[dPos] + '</FONT></TD><TD>' + BoatSched[(hours + i) % 3] + '</TD><TD ALIGN="left">' + formatCountdown(timeLeftLoop) + '</TD></TR>';
   }

   if (repeatFerry < 1) { out = ''; } else { out = bSched + "</TABLE>"; }
   document.getElementById("ferry").innerHTML = out;

}

function getAirSched() { 

   var timenow = new Date(); 
   var localTime = timenow.getTime(); 
   var elapsedTime = (localTime - basisDate.getTime()) % msGameDay; 
   var dayStart = localTime - elapsedTime; 
   vanaDate = ((898 * 360 + 30) * msRealDay) + (localTime - basisDate.getTime()) * 25; 
   vDay = Math.floor((vanaDate % (8 * msRealDay)) / (msRealDay)); 

   var offset1 = ((1 * 60) + 10) * 60 * 1000 / 25; // 1:10 offset used by B->J J->S 
   var offset2 = ((2 * 60) + 40) * 60 * 1000 / 25; // 2:40 offset used by J->W K-J 
   var offset3 = ((4 * 60) + 10) * 60 * 1000 / 25; // 4:10 offset used by J->B S->J 
   var offset4 = ((5 * 60) + 35) * 60 * 1000 / 25; // 5:35 offset used by J->K 
   var offset5 = ((5 * 60) + 45) * 60 * 1000 / 25; // 5:45 offset used by W->J 

   outAir = "";
   outAir += "<TABLE CLASS='blank' WIDTH='400' CELLSPACING='0' CELLPADDING='0'>"; 
   outAir += "<TR><TH ALIGN='LEFT'>Airship Route</TH>";
   outAir += "<TH ALIGN='LEFT'>Departure Day</TH>";
   outAir += "<TH ALIGN='LEFT'>Arrival</TH>";
   outAir += "<TH ALIGN='LEFT'>Departure</TH></TR>";
   
   outAir += AirHelper(elapsedTime, offset3, vDay, "Jeuno To Bastok"); 
   outAir += AirHelper(elapsedTime, offset4, vDay, "Jeuno To Kazham"); 
   outAir += AirHelper(elapsedTime, offset1, vDay, "Jeuno To San d'Oria"); 
   outAir += AirHelper(elapsedTime, offset2, vDay, "Jeuno To Windurst"); 
   outAir += AirHelper(elapsedTime, offset1, vDay, "Bastok To Jeuno"); 
   outAir += AirHelper(elapsedTime, offset2, vDay, "Kazham To Jeuno");
   outAir += AirHelper(elapsedTime, offset3, vDay, "San d'Oria To Jeuno"); 
   outAir += AirHelper(elapsedTime, offset5, vDay, "Windurst To Jeuno"); 
   
   outAir += "</TABLE>"; 
   
   document.getElementById("Airship").innerHTML = outAir; 
} 

function AirHelper(elapsed, offset, day, city) { 

   var newOffset = offset; 
   var count = 0; 
   while (newOffset < elapsed) { 
      count += 1; 
      newOffset += (msGameDay / 4); 
   } 
   if (count >= 4) { 
      day = (day + 1) % 8; 
   }
   
   
   output = "<TR><TD>" + city + "</TD>"; 
   output += "<TD><FONT COLOR=" + DayColor[day] + ">" + VanaDay[day] + "</FONT></TD>"; 
   arrivalTime = newOffset - elapsed - 144000;
   if (arrivalTime < 0)  {
      arrivalTime = 0;
   }
   output += "<TD>" + formatCountdown(arrivalTime,1) + "</TD>";
   output += "<TD>" + formatCountdown(newOffset - elapsed,1) + "</TD></TR>"; 
   
   return output; 
}



function getDaySched()  {


   var now = new Date();
   var timeDiff = now.getTime() - Mndate.getTime();
   var weekStart = now.getTime() - (timeDiff % (8 * msGameDay));

   var repeatCal = document.Timer.DayCount.value;
   var dayOffset = document.Timer.Day.value;   
   
   var out = "<TABLE CLASS='blank' CELLSPACING='0' CELLPADDING='0'><TR><TH WIDTH='75' ALIGN='left'>Day</TH><TH WIDTH='100' ALIGN='left'>Begins</TH><TH ALIGN='left' WIDTH='100'>Ends</TH><TH ALIGN='left' WIDTH='120'>Moon Phase</TH></TR>";
   if (dayOffset > 7) {
      for ( i = 0; i < repeatCal; i++) {
         startTime = weekStart + ((dayOffset - 14) * msGameDay) + (msGameDay * i);
         endTime = startTime + msGameDay;

         moonDays = (Math.floor((startTime - Mndate.getTime()) / msGameDay))  % 84;
         // determine phase percentage
         moonpercent = - Math.round((42 - moonDays) / 42 * 100);

         if (moonpercent <= -94)  {
              mnPhase = 0;

         }  else if (moonpercent >= 90)  {
	      mnPhase = 0;

         }  else if (moonpercent >= -93 && moonpercent <= -62)  {
	      mnPhase = 1;

         }  else if (moonpercent >= -61 && moonpercent <= -41)  {
	      mnPhase = 2;

         }  else if (moonpercent >= -40 && moonpercent <= -11)  {
	      mnPhase = 3;

         }  else if (moonpercent >= -10 && moonpercent <= 6)  {
	      mnPhase = 4;

         }  else if (moonpercent >= 7 && moonpercent <= 38)  {
	      mnPhase = 5;
	      
         }  else if (moonpercent >= 37 && moonpercent <= 56)  {
	      mnPhase = 6;

         }  else if (moonpercent >= 57 && moonpercent <= 89)  {
	      mnPhase = 7;
	      
         }
         
         mnpercent = PhaseName[mnPhase] + " (" + Math.abs(moonpercent) + "%)";

         if (moonpercent <= 5 && moonpercent >= -10)  {
              mnpercent = "<FONT COLOR='#FF0000'>" + mnpercent + "</FONT>";
         } else if (moonpercent >= 90 || moonpercent <= -95)  {
              mnpercent = "<FONT COLOR='#0000FF'>" + mnpercent + "</FONT>";
         }

         out = out + "<TR><TD><FONT COLOR='" + DayColor[(dayOffset + i) % 8] + "'>" + VanaDay[(dayOffset + i) % 8] + "</FONT></TD><TD>" + formatDate(startTime, 2) + "</TD><TD>" + formatDate(endTime, 2) + "</TD><TD>" + mnpercent + "</TD></TR>";
      }
   
   } else {
      for ( i = 0; i < repeatCal; i++) {
         startTime = weekStart + ((dayOffset - 6) * msGameDay) + (8 * msGameDay * i);
         endTime = startTime + msGameDay;

         moonDays = (Math.floor((startTime - Mndate.getTime()) / msGameDay))  % 84;
         // determine phase percentage
         moonpercent = - Math.round((42 - moonDays) / 42 * 100);
         if (moonpercent <= -94)  {
	    mnPhase = 0;
	 
	 } else if (moonpercent >= 90)  {
            mnPhase = 0;
	 
         }  else if (moonpercent >= -93 && moonpercent <= -62)  {
            mnPhase = 1;
	 
         }  else if (moonpercent >= -61 && moonpercent <= -41)  {
            mnPhase = 2;
	 
         }  else if (moonpercent >= -40 && moonpercent <= -11)  {
            mnPhase = 3;
	 
         }  else if (moonpercent >= -10 && moonpercent <= 6)  {
            mnPhase = 4;
	 
         }  else if (moonpercent >= 7 && moonpercent <= 38)  {
            mnPhase = 5;
	 	      
         }  else if (moonpercent >= 37 && moonpercent <= 56)  {
            mnPhase = 6;
	 
         }  else if (moonpercent >= 57 && moonpercent <= 89)  {
            mnPhase = 7;
	 	      
         }
         
         mnpercent = PhaseName[mnPhase] + " (" + Math.abs(moonpercent) + "%)";
         
         if (moonpercent <= 5 && moonpercent >= -10)  {
              mnpercent = "<FONT COLOR='#FF0000'>" + mnpercent + "</FONT>";
         } else if (moonpercent >= 90 || moonpercent <= -95)  {
              mnpercent = "<FONT COLOR='#0000FF'>" + mnpercent + "</FONT>";
         }

         out = out + "<TR><TD><FONT COLOR='" + DayColor[dayOffset] + "'>" + VanaDay[dayOffset] + "</FONT></TD><TD>" + formatDate(startTime, 2) + "</TD><TD>" + formatDate(endTime, 2) + "</TD><TD>" + mnpercent + "</TD></TR>";
      }
   }
   if (repeatCal < 1) { out = ''; } else { out = out + "</TABLE>"; }
   document.getElementById("days").innerHTML = out;
}

function getGuildHours()  {
    
   alchemy = guildHelper(8, 23, 6);
   blacksmith = guildHelper(8, 23, 2);
   bonework = guildHelper(8, 23, 3);
   goldsmith = guildHelper(8, 23, 4);
   cloth = guildHelper(6, 21, 0);
   wood = guildHelper(6, 21, 0);
   leather = guildHelper(3, 18, 4);
   fishing = guildHelper(3, 18, 5);
   cooking = guildHelper(5, 20, 7);


   guildOut = "<TABLE CLASS='blank' CELLSPACING='0' CELLPADDING='0'>";
   guildOut = guildOut + "<TR><TH ALIGN='left' WIDTH=85>Guild</TH>";
   guildOut = guildOut + "<TH WIDTH=55></TH><TH WIDTH=50></TH><TH ALIGN='left' WIDTH=140>Status</TH></TR>";
   guildOut = guildOut + "<TR><TD>" + "<A HREF=#  onmousedown='javascript:guildDetail(1)'>Alchemy</A>" 		+ "</TD>" + alchemy 	+ "</TR>";
   guildOut = guildOut + "<TR><TD>" + "<A HREF=#  onmousedown='javascript:guildDetail(2)'>Blacksmith</A>" 	+ "</TD>" + blacksmith 	+ "</TR>";
   guildOut = guildOut + "<TR><TD>" + "<A HREF=#  onmousedown='javascript:guildDetail(3)'>Boneworking</A>" 	+ "</TD>" + bonework 	+ "</TR>";
   guildOut = guildOut + "<TR><TD>" + "<A HREF=#  onmousedown='javascript:guildDetail(4)'>Goldsmith</A>" 	+ "</TD>" + goldsmith 	+ "</TR>";
   guildOut = guildOut + "<TR><TD>" + "<A HREF=#  onmousedown='javascript:guildDetail(5)'>Cloth</A>" 		+ "</TD>" + cloth 	+ "</TR>";
   guildOut = guildOut + "<TR><TD>" + "<A HREF=#  onmousedown='javascript:guildDetail(6)'>Woodworking</A>" 	+ "</TD>" + wood 	+ "</TR>";
   guildOut = guildOut + "<TR><TD>" + "<A HREF=#  onmousedown='javascript:guildDetail(7)'>Leather</A>" 		+ "</TD>" + leather 	+ "</TR>";
   guildOut = guildOut + "<TR><TD>" + "<A HREF=#  onmousedown='javascript:guildDetail(8)'>Fishing</A>" 		+ "</TD>" + fishing 	+ "</TR>";
   guildOut = guildOut + "<TR><TD>" + "<A HREF=#  onmousedown='javascript:guildDetail(9)'>Cooking</A>" 		+ "</TD>" + cooking 	+ "</TR>";
   guildOut = guildOut + "</TABLE>";
   
   document.getElementById("Guilds").innerHTML = guildOut;


}

function guildHelper(open, close, holiday)  {
   var timenow = new Date();
   var localTime = timenow.getTime();
   var elapsedTime = (localTime - basisDate.getTime()) % msGameDay;
   var dayStart = localTime - elapsedTime;

   // this conversion factor tells us time elapsed since the game day started in milliseconds
   var convFactor = 60 * 60 * 1000 / 25; 
   
   vanaDate =  ((898 * 360 + 30) * msRealDay) + (localTime - basisDate.getTime()) * 25;
   vDay  = Math.floor((vanaDate % (8 * msRealDay)) / (msRealDay));

   open = open * convFactor;
   close = close * convFactor;
   
   openTime = open + dayStart;
   closeTime = close + dayStart;
   outputTxt = "";
   guildCountdown = 0;
   
   if (openTime >= localTime) {
      guildCountdown = openTime - localTime;
      outputTxt2 = "</TD><TD><FONT COLOR='#DD0000'>Closed.</FONT> Open tomorrow.</TD>";
      outputTxt1 = "<TD>Opens in:</TD><TD>";
   } else if ((openTime < localTime) && (closeTime > localTime)) {
      guildCountdown = closeTime - localTime;
      outputTxt2 = "</TD><TD><FONT COLOR='#008822'>Open</FONT> for business</TD>";
      outputTxt1 = "<TD>Closes in:</TD><TD>";
   } else if (closeTime <= localTime)  {
      guildCountdown = (msGameDay - elapsedTime) + open;
      outputTxt2 = "</TD><TD><FONT COLOR='#DD0000'>Closed.</FONT> Open tomorrow.</TD>";
      outputTxt1 = "<TD>Opens in:</TD><TD>";      
   }
   
   // adjust for holiday
   if ((holiday == vDay) && (closeTime > localTime)) {
      guildCountdown = (msGameDay - elapsedTime) + open;
      outputTxt2 = "</TD><TD><FONT COLOR='#DD0000'>Closed</FONT> for Holiday</TD>";
      outputTxt1 = "<TD>Opens in:</TD><TD>";
   } else if (((vDay + 1) == holiday) && (closeTime <= localTime))  {
      guildCountdown = (msGameDay - elapsedTime) + open + msGameDay;
      outputTxt2 = "</TD><TD><FONT COLOR='#DD0000'>Closed.</FONT> Holiday tomorrow</TD>";
      outputTxt1 = "<TD>Opens in:</TD><TD>";
   }

   return outputTxt1 + formatCountdown(guildCountdown) + outputTxt2;
}

function guildDetail(guild)  {

   switch(guild)  {
      case 1:
         out = "Alchemist´s guild <BR>Location:  Bastok Mines<BR>Holiday:  Lightsday<BR>Hours:  8:00-23:00";
         break
      case 2:
         out = "Blacksmith´s guild <BR>Location:  Bastok Metalworks, Northern San d´Oria<BR>Holiday:  Watersday<BR>Hours:  8:00-23:00";
         break
      case 3:
         out = "Boneworker´s guild <BR>Location:  Windurst Woods<BR>Holiday:  Windsday<BR>Hours:  8:00-23:00";
         break
      case 4:
         out = "Goldsmith´s guild <BR>Location:  Bastok Market<BR>Holiday:  Iceday<BR>Hours:  8:00-23:00";
         break
      case 5:
         out = "Weaver´s guild <BR>Location:  Windurst Woods<BR>Holiday:  Firesday<BR>Hours:  6:00-21:00";
         break
      case 6:
         out = "Carpenter´s guild <BR>Location:   Northern San d´Oria<BR>Holiday:  Firesday<BR>Hours:  6:00-21:00";
         break
      case 7:
         out = "Leatherworker´s guild <BR>Location:   Southern San d´Oria<BR>Holiday:  Iceday<BR>Hours:  3:00-18:00";
         break
      case 8:
         out = "Fisherman´s guild <BR>Location:   Port Windurst<BR>Holiday:  Lightningday<BR>Hours:  3:00-18:00";
         break
      case 9:
         out = "Culinary guild <BR>Location:   Windurst Waters<BR>Holiday:  Darksday<BR>Hours:  5:00-20:00";
   }
   
   document.getElementById("Details").innerHTML = out;
}

function formatCountdown(varTime) {

   var dayLeft = varTime / msRealDay;
   var hourLeft = (dayLeft - Math.floor(dayLeft)) * 24;
   var minLeft = (hourLeft - Math.floor(hourLeft)) * 60;
   var secLeft = Math.floor((minLeft - Math.floor(minLeft)) * 60);
   var formattedTime = '';

   dayLeft = Math.floor(dayLeft);
   hourLeft = Math.floor(hourLeft);
   minLeft = Math.floor(minLeft);

   if (minLeft < 10) {minLeft = '0' + minLeft;}
   if (secLeft < 10) {secLeft = '0' + secLeft;}

   if (dayLeft > 0) {
      formattedTime = dayLeft + ':';
      if (hourLeft < 10) {
         formattedTime = formattedTime + '0' + hourLeft + ':';
      } else {
         formattedTime = formattedTime + hourLeft + ':';
      }         
   } else if (hourLeft > 0) {
      formattedTime = hourLeft + ':';
   }

   formattedTime = formattedTime + minLeft + ':' + secLeft;
   return formattedTime;
}

function formatDate(varTime, showDay) {

   var varDate = new Date(varTime);
   var yyyy = varDate.getYear();

   var mm = varDate.getMonth() + 1;
   if (mm < 10) { mm = "0" + mm; }

   var dd = varDate.getDate();
   if (dd < 10) { dd = "0" + dd; }

   var day = varDate.getDay();

   var hh = varDate.getHours();
   
   if (hh < 10) { hh = "0" + hh; }

   var min = varDate.getMinutes();
   if (min < 10) { min = "0" + min; }

   var ss = varDate.getSeconds();
   if (ss < 10) { ss = "0" + ss; }

   if (showDay == 1)  {
      dateString = EarthDay[day] + ", " + sMonth[mm-1] + ' ' + dd + ', ' + yyyy + " " + hh + ":" + min + ":" + ss;
   } else if (showDay == 2)  {
      dateString = sMonth[mm-1] + " " + dd + ",  " + hh + ":" + min + ":" + ss;
   }
   return dateString;
}

function printPage() {
   getVanadielTime();
   getEarthTime();
   getMoonPhase();
   getRSE();
   getConquest();
   getShipSched();
   getDaySched();
   getGuildHours();
   getAirSched();
   setTimeout("printPage()", 50);
}




// -->
