import React from "react";
import { MapPin, ChevronRight, Sun } from "lucide-react";
import { MonthlyWeatherDay } from "../types";
import { DEFAULT_MONTHLY_WEATHER, getWeatherConditionInfo, parseDateToRead } from "../data/mockWeather";

interface WeatherWidgetProps {
  monthlyWeather?: MonthlyWeatherDay[];
  onOpenWeatherTab?: () => void;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function WeatherWidget({
  monthlyWeather = DEFAULT_MONTHLY_WEATHER,
  onOpenWeatherTab,
}: WeatherWidgetProps) {
  const weatherList = monthlyWeather.length > 0 ? monthlyWeather : DEFAULT_MONTHLY_WEATHER;
  const todayWeather = weatherList[0];
  const prognosis5Days = weatherList.slice(0, 5);

  const formatDateStr = (dayObj: MonthlyWeatherDay) => {
    if (dayObj.dateToRead) {
      const { monthDayStr } = parseDateToRead(dayObj.dateToRead);
      return monthDayStr;
    }
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
    <div
      onClick={onOpenWeatherTab}
      className="bento-item p-5 text-left bg-white rounded-2xl border border-neutral-100 shadow-sm hover:border-purple-200 cursor-pointer transition-all group"
      id="weather-sidebar-widget"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-extrabold text-neutral-900 tracking-tight uppercase flex items-center space-x-1.5 group-hover:text-[#6001d2] transition-colors">
          <MapPin className="w-4 h-4 text-[#6001d2]" />
          <span>Sandbox City Weather</span>
        </h4>
        <span className="text-[10px] text-neutral-400 font-mono flex items-center space-x-0.5">
          <span>Weather Tab</span>
          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>

      {/* Today Focus Card */}
      <div
        className="bg-gradient-to-br from-purple-50 via-indigo-50/60 to-amber-50/40 text-neutral-900 p-4 rounded-xl mb-4 relative overflow-hidden border border-purple-100/80 shadow-xs"
        id="weather-now-panel"
      >
        <div className="flex items-start justify-between relative z-10">
          <div>
            <div className="flex items-center space-x-1.5 mb-1">
              <span className="text-[10px] font-extrabold bg-purple-600 text-white px-2 py-0.5 rounded-md font-mono">
                TODAY • {formatDateStr(todayWeather)}
              </span>
            </div>

            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-3xl font-black tracking-tight font-sans text-neutral-900">
                {todayWeather.highestTemputure}°
              </span>
              <span className="text-xs text-neutral-500 font-mono">
                / {todayWeather.lowestTemputure}°C
              </span>
            </div>

            <span className="text-xs text-neutral-700 font-semibold block mt-1 flex items-center space-x-1">
              <span>{getWeatherConditionInfo(todayWeather.weatherCondition).icon}</span>
              <span>{getWeatherConditionInfo(todayWeather.weatherCondition).label}</span>
            </span>
          </div>

          <div className="text-3xl p-2.5 bg-white/80 rounded-2xl border border-purple-100 shadow-xs">
            {getWeatherConditionInfo(todayWeather.weatherCondition).icon}
          </div>
        </div>
      </div>

      {/* 5-Day Compact Preview */}
      <div className="space-y-2" id="weather-forecast-days">
        <div className="flex items-center justify-between text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
          <span>5-Day Preview</span>
          <span>Temp (Low / High)</span>
        </div>

        {prognosis5Days.map((fc) => {
          const info = getWeatherConditionInfo(fc.weatherCondition);
          return (
            <div
              key={fc.id}
              className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-neutral-50 transition-colors text-xs border border-transparent"
            >
              <div className="flex items-center space-x-2 min-w-[90px]">
                <span className="font-mono text-neutral-400 text-[11px] w-8">
                  {formatDateStr(fc)}
                </span>
                <span className="font-semibold text-neutral-700 text-[11px]">
                  {getDayOfWeekName(fc.DayofWeek)}
                </span>
              </div>

              <div className="flex items-center space-x-1.5">
                <span className="text-sm">{info.icon}</span>
              </div>

              <div className="font-mono text-[11px] text-right min-w-[65px]">
                <span className="text-neutral-400">{fc.lowestTemputure}°</span>
                <span className="text-neutral-300 mx-1">/</span>
                <span className="font-bold text-neutral-800">{fc.highestTemputure}°C</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
