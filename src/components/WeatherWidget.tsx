import React from "react";
import { MapPin, Cloud, Sun, CloudRain, CloudLightning } from "lucide-react";
import { WeatherData } from "../types";
import { weatherProfiles } from "../data/mockData";

interface WeatherWidgetProps {
  currentWeather: WeatherData;
  onCityChange: (data: WeatherData) => void;
}

export default function WeatherWidget({ currentWeather, onCityChange }: WeatherWidgetProps) {
  const getWeatherIcon = (cond: string | undefined) => {
    switch (cond) {
      case "sunny":
        return <Sun className="w-5 h-5 text-amber-500" />;
      case "rainy":
        return <CloudRain className="w-5 h-5 text-indigo-400" />;
      case "stormy":
        return <CloudLightning className="w-5 h-5 text-purple-500" />;
      case "cloudy":
      default:
        return <Cloud className="w-5 h-5 text-neutral-400" />;
    }
  };

  return (
    <div className="bento-item p-5 text-left" id="weather-sidebar-widget">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-extrabold text-neutral-900 tracking-tight uppercase flex items-center space-x-1.5">
          <MapPin className="w-4 h-4 text-[#6001d2]" />
          <span>Weather Forecast</span>
        </h4>
        <span className="text-[10px] text-neutral-400 font-mono">RealFeel® {currentWeather.realFeel}°</span>
      </div>

      {/* Current Weather Display */}
      <div className="flex items-center justify-between mb-5" id="weather-now-panel">
        <div>
          <span className="text-3xl font-extrabold text-neutral-900 leading-none font-sans">
            {currentWeather.temp}°C
          </span>
          <span className="text-xs text-neutral-600 block mt-1 font-semibold">
            {currentWeather.city}
          </span>
          <span className="text-[11px] text-neutral-400 block">
            {currentWeather.condition}
          </span>
        </div>
        <div className="bg-gradient-to-tr from-amber-50 to-orange-100 p-4 rounded-2xl">
          <Sun className="w-10 h-10 text-amber-500 animate-[spin_20s_linear_infinite]" />
        </div>
      </div>

      {/* 4-Day Forecast Grid */}
      <div className="space-y-3" id="weather-forecast-days">
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">4-Day Prognosis</span>
        {currentWeather.forecast.map((fc, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between py-1.5 border-b border-neutral-100 last:border-0 text-xs"
            id={`weather-day-row-${idx}`}
          >
            <span className="font-semibold text-neutral-500 min-w-[50px]">{fc.day}</span>
            <div className="flex items-center space-x-1">
              {getWeatherIcon(fc.condition)}
            </div>
            <span className="font-mono text-neutral-700 font-medium">{fc.temp}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-neutral-100 text-center">
        <span className="text-[10px] text-neutral-400">
          Powered by LifeHacker Weather Engine API
        </span>
      </div>
    </div>
  );
}
