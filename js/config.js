/**
 * Configuration constants for the timer application
 */
export const TIME_CONFIG = {
  // Basis dates
  BASIS_DATE: new Date(Date.UTC(2002, 5, 23, 15, 0, 0, 0)),
  MOON_DATE: new Date(Date.UTC(2004, 0, 25, 2, 31, 12, 0)),
  RSE_DATE: new Date(Date.UTC(2004, 0, 28, 9, 14, 24, 0)),
  DAY_DATE: new Date(Date.UTC(2004, 0, 28, 9, 14, 24, 0)),

  // Time constants
  MS_GAME_DAY: (24 * 60 * 60 * 1000) / 25,
  MS_REAL_DAY: 24 * 60 * 60 * 1000,

  // Update interval in milliseconds
  UPDATE_INTERVAL: 50
};

export const CALENDAR = {
  EARTH_DAYS: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  VANA_DAYS: ["Firesday", "Earthsday", "Watersday", "Windsday", "Iceday", "Lightningday", "Lightsday", "Darksday"],
  DAY_COLORS: ["#DD0000", "#AAAA00", "#0000DD", "#00AA22", "#7799FF", "#AA00AA", "#AAAAAA", "#333333"],
  WEAK_MAGIC: ["Ice", "Lightning", "Fire", "Earth", "Wind", "Water", "Darkness", "Light"],
  WEAK_COLORS: ["#7799FF", "#AA00AA", "#DD0000", "#AAAA00", "#00AA22", "#0000DD", "#333333", "#AAAAAA"],
  PHASE_NAMES: ["Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent", "New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous"],
  SHORT_MONTHS: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
};

export const TRANSPORT = {
  BOAT_SCHEDULES: {
    DEPARTURE: ["08:00", "16:00", "00:00"],
    ARRIVAL: ["06:30", "14:30", "22:30"],
    DAY_OFFSET: [0, 0, 7]
  },
  
  AIRSHIP_OFFSETS: {
    BASTOK_JEUNO: (1 * 60 + 10) * 60 * 1000 / 25,
    JEUNO_WINDURST: (2 * 60 + 40) * 60 * 1000 / 25,
    JEUNO_BASTOK: (4 * 60 + 10) * 60 * 1000 / 25,
    JEUNO_KAZHAM: (5 * 60 + 35) * 60 * 1000 / 25,
    WINDURST_JEUNO: (5 * 60 + 45) * 60 * 1000 / 25
  }
};

export const GUILD_CONFIG = {
  ALCHEMY: { open: 8, close: 23, holiday: 6, location: "Bastok Mines" },
  BLACKSMITH: { open: 8, close: 23, holiday: 2, location: "Bastok Metalworks, Northern San d'Oria" },
  BONEWORK: { open: 8, close: 23, holiday: 3, location: "Windurst Woods" },
  GOLDSMITH: { open: 8, close: 23, holiday: 4, location: "Bastok Market" },
  CLOTH: { open: 6, close: 21, holiday: 0, location: "Windurst Woods" },
  WOOD: { open: 6, close: 21, holiday: 0, location: "Northern San d'Oria" },
  LEATHER: { open: 3, close: 18, holiday: 4, location: "Southern San d'Oria" },
  FISHING: { open: 3, close: 18, holiday: 5, location: "Port Windurst" },
  COOKING: { open: 5, close: 20, holiday: 7, location: "Windurst Waters" }
};