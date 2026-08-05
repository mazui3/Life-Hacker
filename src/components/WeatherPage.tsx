import React from "react";
import { MapPin, Calendar } from "lucide-react";
import { MonthlyWeatherDay } from "../types";
import { DEFAULT_MONTHLY_WEATHER, getWeatherConditionInfo } from "../data/mockWeather";

interface WeatherPageProps {
  monthlyWeather?: MonthlyWeatherDay[];
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function WeatherPage({ monthlyWeather = DEFAULT_MONTHLY_WEATHER }: WeatherPageProps) {
  const weatherList = monthlyWeather.length > 0 ? monthlyWeather : DEFAULT_MONTHLY_WEATHER;
  const firstDay = weatherList[0];

  // Derive month and year title from first date
  let monthTitle = "Monthly Forecast";
  if (firstDay && firstDay.date) {
    const d = new Date(firstDay.date * 1000);
    if (!isNaN(d.getTime())) {
      monthTitle = d.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
    }
  }

  // First day of week offset (0 = Sun, 1 = Mon, ..., 6 = Sat)
  const startDayOfWeek = firstDay ? (firstDay.DayofWeek % 7) : 0;
  const emptySlots = Array.from({ length: startDayOfWeek });

  // Format day date string (e.g. "1/1", "1/2")
  const formatDateStr = (dayObj: MonthlyWeatherDay) => {
    if (dayObj.date) {
      const d = new Date(dayObj.date * 1000);
      if (!isNaN(d.getTime())) {
        const month = d.getUTCMonth() + 1;
        const dateNum = d.getUTCDate();
        return `${month}/${dateNum}`;
      }
    }
    return `Day ${dayObj.id + 1}`;
  };

  const getDayOfWeekName = (dow: number) => {
    const idx = dow % 7;
    return DAY_NAMES[idx] || "Day";
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-left">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="bg-purple-500/30 text-purple-200 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-purple-400/30 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-purple-300" />
              <span>Sandbox City Weather Service</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white font-sans">
            {monthTitle} Weather Forecast
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl leading-relaxed">
            Real-time daily condition prognosis and temperature ranges synced directly from Sandbox PlayFab Player Data.
          </p>
        </div>
      </div>

      {/* Monthly Weather Forecast Calendar Grid */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4 overflow-x-auto">
        <div className="flex flex-wrap items-center justify-between border-b border-neutral-100 pb-3 gap-2">
          <h2 className="text-base font-extrabold text-neutral-900 flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-[#6001d2]" />
            <span>{monthTitle} Calendar</span>
          </h2>
        </div>

        <div className="min-w-[650px]">
          {/* CALENDAR WEEKDAY HEADERS (Sun - Sat) */}
          <div className="grid grid-cols-7 gap-2 sm:gap-3 text-center text-xs font-bold text-neutral-500 border-b border-neutral-100 pb-2 mb-3">
            {DAY_NAMES.map((dayName) => (
              <div key={dayName} className="uppercase tracking-wider font-mono text-[11px] sm:text-xs">
                {dayName}
              </div>
            ))}
          </div>

          {/* CALENDAR GRID */}
          <div className="grid grid-cols-7 gap-2 sm:gap-3" id="weather-calendar-grid">
            {/* Empty slots for month starting offset */}
            {emptySlots.map((_, i) => (
              <div
                key={`empty-slot-${i}`}
                className="p-3 rounded-2xl border border-dashed border-neutral-100 bg-neutral-50/40 h-28 sm:h-36 opacity-50"
              />
            ))}

            {/* Weather days */}
            {weatherList.map((day) => {
              const info = getWeatherConditionInfo(day.weatherCondition);
              // Weather severe background colors:
              // Blizzard (6) = 浅蓝
              // Heatwave (8) = 浅红
              // Stormy (7) / Typhoon (9) = 浅灰
              let cardBgClass = "bg-white border-neutral-100 hover:border-purple-200 hover:shadow-xs text-neutral-900";
              if (day.weatherCondition === 6) {
                cardBgClass = "bg-sky-100/90 border-sky-300 text-sky-950 shadow-xs hover:border-sky-400";
              } else if (day.weatherCondition === 8) {
                cardBgClass = "bg-rose-100/90 border-rose-300 text-rose-950 shadow-xs hover:border-rose-400";
              } else if (day.weatherCondition === 7 || day.weatherCondition === 9) {
                cardBgClass = "bg-neutral-200/90 border-neutral-300 text-neutral-900 shadow-xs hover:border-neutral-400";
              }

              return (
                <div
                  key={day.id}
                  className={`p-2.5 sm:p-3.5 rounded-2xl border transition-all relative flex flex-col justify-between h-28 sm:h-36 ${cardBgClass}`}
                >
                  {/* Day Header */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs sm:text-sm font-black">
                      {formatDateStr(day)}
                    </span>
                    <span className="text-[10px] font-bold opacity-60 uppercase">
                      {getDayOfWeekName(day.DayofWeek)}
                    </span>
                  </div>

                  {/* Weather Icon & Label */}
                  <div className="my-1 text-center">
                    <span className="text-xl sm:text-2xl block mb-0.5">{info.icon}</span>
                    <span className="text-[10px] sm:text-[11px] font-bold line-clamp-1">
                      {info.label}
                    </span>
                  </div>

                  {/* Temperature Footer */}
                  <div className="border-t border-black/10 pt-1 text-center font-mono text-[10px] sm:text-[11px]">
                    <span className="opacity-60">{day.lowestTemputure}°</span>
                    <span className="opacity-40 mx-1">~</span>
                    <span className="font-extrabold">{day.highestTemputure}°C</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
