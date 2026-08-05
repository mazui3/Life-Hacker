import { MonthlyWeatherDay } from "../types";

// Helper to map integer weatherCondition to label, icon, and colors
// WeatherCondition Enum:
// 0 = sunny, 1 = rainy, 2 = windy, 3 = cloudy, 4 = overcast, 5 = snowy, 6 = blizzard, 7 = stormy, 8 = heatwave, 9 = typhoon
export function getWeatherConditionInfo(code: number) {
  switch (code) {
    case 0:
      return {
        code: 0,
        label: "Sunny",
        labelZh: "晴朗",
        icon: "☀️",
        isSevere: false,
        bgClass: "bg-amber-50/70 border-amber-100 text-amber-900",
      };
    case 1:
      return {
        code: 1,
        label: "Rainy",
        labelZh: "阴雨",
        icon: "🌧️",
        isSevere: false,
        bgClass: "bg-sky-50/70 border-sky-100 text-sky-900",
      };
    case 2:
      return {
        code: 2,
        label: "Windy",
        labelZh: "刮风",
        icon: "🌬️",
        isSevere: false,
        bgClass: "bg-teal-50/70 border-teal-100 text-teal-900",
      };
    case 3:
      return {
        code: 3,
        label: "Cloudy",
        labelZh: "多云",
        icon: "🌤️",
        isSevere: false,
        bgClass: "bg-slate-50/70 border-slate-100 text-slate-900",
      };
    case 4:
      return {
        code: 4,
        label: "Overcast",
        labelZh: "阴天",
        icon: "☁️",
        isSevere: false,
        bgClass: "bg-neutral-100/70 border-neutral-200 text-neutral-800",
      };
    case 5:
      return {
        code: 5,
        label: "Snowy",
        labelZh: "下雪",
        icon: "❄️",
        isSevere: false,
        bgClass: "bg-cyan-50/70 border-cyan-100 text-cyan-900",
      };
    case 6:
      return {
        code: 6,
        label: "Blizzard",
        labelZh: "暴雪",
        icon: "🌨️",
        isSevere: true,
        bgClass: "bg-sky-100/90 border-sky-300 text-sky-950",
      };
    case 7:
      return {
        code: 7,
        label: "Stormy",
        labelZh: "雷暴",
        icon: "⛈️",
        isSevere: true,
        bgClass: "bg-neutral-200/90 border-neutral-300 text-neutral-900",
      };
    case 8:
      return {
        code: 8,
        label: "Heatwave",
        labelZh: "酷热",
        icon: "🌡️",
        isSevere: true,
        bgClass: "bg-rose-100/90 border-rose-300 text-rose-950",
      };
    case 9:
      return {
        code: 9,
        label: "Typhoon",
        labelZh: "台风",
        icon: "🌀",
        isSevere: true,
        bgClass: "bg-neutral-200/90 border-neutral-300 text-neutral-900",
      };
    default:
      return {
        code: code,
        label: "Sunny",
        labelZh: "晴朗",
        icon: "☀️",
        isSevere: false,
        bgClass: "bg-amber-50/70 border-amber-100 text-amber-900",
      };
  }
}

// Default 31-day monthly weather data (Jan 2025 starting at Unix epoch 1735660800 = 2025-01-01)
export const DEFAULT_MONTHLY_WEATHER: MonthlyWeatherDay[] = [
  { id: 0, date: 1735660800, DayofWeek: 3, isDayOff: true, ifIsHoliday: "New Year's Day", weatherCondition: 6, lowestTemputure: -21, highestTemputure: -8 },
  { id: 1, date: 1735747200, DayofWeek: 4, isDayOff: false, ifIsHoliday: "", weatherCondition: 3, lowestTemputure: -3, highestTemputure: -2 },
  { id: 2, date: 1735833600, DayofWeek: 5, isDayOff: false, ifIsHoliday: "", weatherCondition: 5, lowestTemputure: -12, highestTemputure: -5 },
  { id: 3, date: 1735920000, DayofWeek: 6, isDayOff: true, ifIsHoliday: "", weatherCondition: 6, lowestTemputure: -18, highestTemputure: -9 },
  { id: 4, date: 1736006400, DayofWeek: 0, isDayOff: true, ifIsHoliday: "", weatherCondition: 1, lowestTemputure: -10, highestTemputure: -1 },
  { id: 5, date: 1736092800, DayofWeek: 1, isDayOff: false, ifIsHoliday: "Epiphany Eve", weatherCondition: 2, lowestTemputure: -8, highestTemputure: 0 },
  { id: 6, date: 1736179200, DayofWeek: 2, isDayOff: false, ifIsHoliday: "Epiphany", weatherCondition: 0, lowestTemputure: -5, highestTemputure: 3 },
  { id: 7, date: 1736265600, DayofWeek: 3, isDayOff: false, ifIsHoliday: "", weatherCondition: 1, lowestTemputure: -4, highestTemputure: 2 },
  { id: 8, date: 1736352000, DayofWeek: 4, isDayOff: false, ifIsHoliday: "", weatherCondition: 3, lowestTemputure: -2, highestTemputure: 4 },
  { id: 9, date: 1736438400, DayofWeek: 5, isDayOff: false, ifIsHoliday: "", weatherCondition: 5, lowestTemputure: -9, highestTemputure: -3 },
  { id: 10, date: 1736524800, DayofWeek: 6, isDayOff: true, ifIsHoliday: "", weatherCondition: 6, lowestTemputure: -15, highestTemputure: -7 },
  { id: 11, date: 1736611200, DayofWeek: 0, isDayOff: true, ifIsHoliday: "", weatherCondition: 0, lowestTemputure: -11, highestTemputure: -2 },
  { id: 12, date: 1736697600, DayofWeek: 1, isDayOff: false, ifIsHoliday: "", weatherCondition: 1, lowestTemputure: -7, highestTemputure: 1 },
  { id: 13, date: 1736784000, DayofWeek: 2, isDayOff: false, ifIsHoliday: "", weatherCondition: 2, lowestTemputure: -6, highestTemputure: 2 },
  { id: 14, date: 1736870400, DayofWeek: 3, isDayOff: false, ifIsHoliday: "", weatherCondition: 3, lowestTemputure: -1, highestTemputure: 5 },
  { id: 15, date: 1736956800, DayofWeek: 4, isDayOff: false, ifIsHoliday: "", weatherCondition: 4, lowestTemputure: 0, highestTemputure: 6 },
  { id: 16, date: 1737043200, DayofWeek: 5, isDayOff: false, ifIsHoliday: "", weatherCondition: 2, lowestTemputure: -3, highestTemputure: 3 },
  { id: 17, date: 1737129600, DayofWeek: 6, isDayOff: true, ifIsHoliday: "", weatherCondition: 1, lowestTemputure: -5, highestTemputure: 1 },
  { id: 18, date: 1737216000, DayofWeek: 0, isDayOff: true, ifIsHoliday: "", weatherCondition: 0, lowestTemputure: -8, highestTemputure: -1 },
  { id: 19, date: 1737302400, DayofWeek: 1, isDayOff: true, ifIsHoliday: "MLK Day", weatherCondition: 1, lowestTemputure: -6, highestTemputure: 2 },
  { id: 20, date: 1737388800, DayofWeek: 2, isDayOff: false, ifIsHoliday: "", weatherCondition: 5, lowestTemputure: -10, highestTemputure: -4 },
  { id: 21, date: 1737475200, DayofWeek: 3, isDayOff: false, ifIsHoliday: "", weatherCondition: 6, lowestTemputure: -16, highestTemputure: -8 },
  { id: 22, date: 1737561600, DayofWeek: 4, isDayOff: false, ifIsHoliday: "", weatherCondition: 5, lowestTemputure: -13, highestTemputure: -6 },
  { id: 23, date: 1737648000, DayofWeek: 5, isDayOff: false, ifIsHoliday: "", weatherCondition: 2, lowestTemputure: -8, highestTemputure: -1 },
  { id: 24, date: 1737734400, DayofWeek: 6, isDayOff: true, ifIsHoliday: "", weatherCondition: 1, lowestTemputure: -5, highestTemputure: 2 },
  { id: 25, date: 1737820800, DayofWeek: 0, isDayOff: true, ifIsHoliday: "", weatherCondition: 0, lowestTemputure: -4, highestTemputure: 4 },
  { id: 26, date: 1737907200, DayofWeek: 1, isDayOff: false, ifIsHoliday: "", weatherCondition: 3, lowestTemputure: -1, highestTemputure: 5 },
  { id: 27, date: 1737993600, DayofWeek: 2, isDayOff: false, ifIsHoliday: "Lunar New Year Eve", weatherCondition: 2, lowestTemputure: -3, highestTemputure: 3 },
  { id: 28, date: 1738080000, DayofWeek: 3, isDayOff: true, ifIsHoliday: "Lunar New Year", weatherCondition: 0, lowestTemputure: -2, highestTemputure: 6 },
  { id: 29, date: 1738166400, DayofWeek: 4, isDayOff: false, ifIsHoliday: "", weatherCondition: 1, lowestTemputure: -4, highestTemputure: 4 },
  { id: 30, date: 1738252800, DayofWeek: 5, isDayOff: false, ifIsHoliday: "", weatherCondition: 5, lowestTemputure: -7, highestTemputure: -1 }
];

// Parse PlayFab Weather Data string or object safely
export function parsePlayFabWeatherData(raw: any): MonthlyWeatherDay[] {
  if (!raw) return DEFAULT_MONTHLY_WEATHER;
  try {
    let parsed = raw;
    if (typeof raw === "string") {
      parsed = JSON.parse(raw);
    }
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item, idx) => ({
        id: typeof item.id === "number" ? item.id : idx,
        date: Number(item.date) || (1735660800 + idx * 86400),
        DayofWeek: typeof item.DayofWeek === "number" ? item.DayofWeek : (3 + idx) % 7,
        isDayOff: Boolean(item.isDayOff),
        ifIsHoliday: item.ifIsHoliday || item.if_is_holiday || item.holiday || "",
        weatherCondition: typeof item.weatherCondition === "number" ? item.weatherCondition : (typeof item.weather_condition === "number" ? item.weather_condition : 1),
        lowestTemputure: typeof item.lowestTemputure === "number" ? item.lowestTemputure : (typeof item.lowestTemperature === "number" ? item.lowestTemperature : -10),
        highestTemputure: typeof item.highestTemputure === "number" ? item.highestTemputure : (typeof item.highestTemperature === "number" ? item.highestTemperature : 0)
      }));
    }
  } catch (err) {
    console.warn("Failed to parse PlayFab weather data, using default forecast:", err);
  }
  return DEFAULT_MONTHLY_WEATHER;
}
