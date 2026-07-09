import React, { useState } from "react";
import { CloudSun, Sparkles, Tv, History, Thermometer, X, Landmark } from "lucide-react";
import { WeatherData } from "../types";

interface WidgetsRowProps {
  weather: WeatherData;
  activeHoroscopeSign: string;
  onWeatherClick: () => void;
  onHoroscopeClick: () => void;
  onWatchClick: () => void;
}

export default function WidgetsRow({
  weather,
  activeHoroscopeSign,
  onWeatherClick,
  onHoroscopeClick,
  onWatchClick,
}: WidgetsRowProps) {
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const historyFacts = [
    {
      year: "1608",
      title: "Quebec City is Founded",
      description: "French explorer Samuel de Champlain founded Quebec City on the site of a former St. Lawrence Iroquoian settlement called Stadacona.",
      fact: "Champlain constructed three wooden main buildings, surrounded by a moat and a wooden stockade, establishing what would become the historic heart of French North America."
    },
    {
      year: "1947",
      title: "First Roswell Reports",
      description: "Debris is recovered from a ranch near Roswell, New Mexico, sparking decades of global UFO lore.",
      fact: "The military initially announced the recovery of a 'flying disc', but quickly recanted, stating it was a standard weather balloon. Declassified files later revealed it was a top-secret acoustics spy balloon."
    },
    {
      year: "1937",
      title: "Amelia Earhart's Last Recorded Signal",
      description: "Aviation pioneer Amelia Earhart and navigator Fred Noonan vanish over the Pacific Ocean during their round-the-world flight attempt.",
      fact: "Despite a massive multi-million dollar search by the US Coast Guard and Navy, no trace was ever found, cementing one of history's greatest mysteries."
    }
  ];

  // Pick a random fact or current fact based on day
  const currentFactIndex = new Date().getDate() % historyFacts.length;
  const currentFact = historyFacts[currentFactIndex];

  return (
    <>
      <div
        className="flex overflow-x-auto gap-4 py-3 px-1 scrollbar-none snap-x"
        id="portal-widgets-ticker"
      >
        {/* Weather Ticker Card */}
        <button
          onClick={onWeatherClick}
          className="bento-item flex-shrink-0 flex items-center justify-between w-64 p-3 text-left snap-start group cursor-pointer"
          id="ticker-weather-card"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Local Weather</span>
            <span className="text-sm font-bold text-neutral-800 group-hover:text-[#6001d2] transition-colors">
              {weather.city}: {weather.temp}°C
            </span>
            <span className="text-xs text-neutral-500 block">{weather.condition}</span>
          </div>
          <div className="bg-amber-50 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
            <CloudSun className="w-6 h-6 text-amber-500 animate-pulse" />
          </div>
        </button>

        {/* Horoscope Ticker Card */}
        <button
          onClick={onHoroscopeClick}
          className="bento-item flex-shrink-0 flex items-center justify-between w-64 p-3 text-left snap-start group cursor-pointer"
          id="ticker-horoscope-card"
        >
          <div className="space-y-1 max-w-[70%]">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Daily Horoscope</span>
            <span className="text-sm font-bold text-neutral-800 group-hover:text-[#6001d2] transition-colors capitalize">
              {activeHoroscopeSign}
            </span>
            <span className="text-xs text-neutral-500 block truncate">
              Clear important work today...
            </span>
          </div>
          <div className="bg-purple-50 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5 text-purple-600" />
          </div>
        </button>

        {/* What to Watch Card */}
        <button
          onClick={onWatchClick}
          className="bento-item flex-shrink-0 flex items-center justify-between w-64 p-3 text-left snap-start group cursor-pointer"
          id="ticker-watch-card"
        >
          <div className="space-y-1 max-w-[70%]">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">What to Watch</span>
            <span className="text-sm font-bold text-neutral-800 group-hover:text-[#6001d2] transition-colors block truncate">
              Star City (2026)
            </span>
            <span className="text-xs text-neutral-500 block">Spy Geopolitical Thriller</span>
          </div>
          <div className="bg-indigo-50 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
            <Tv className="w-5 h-5 text-indigo-600" />
          </div>
        </button>

        {/* Today in History Card */}
        <button
          onClick={() => setShowHistoryModal(true)}
          className="bento-item flex-shrink-0 flex items-center justify-between w-64 p-3 text-left snap-start group cursor-pointer"
          id="ticker-history-card"
        >
          <div className="space-y-1 max-w-[70%]">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Today in History</span>
            <span className="text-sm font-bold text-neutral-800 group-hover:text-[#6001d2] transition-colors block truncate">
              {currentFact.title}
            </span>
            <span className="text-xs text-neutral-500 block font-mono text-[11px]">Year {currentFact.year}</span>
          </div>
          <div className="bg-emerald-50 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
            <History className="w-5 h-5 text-emerald-600" />
          </div>
        </button>
      </div>

      {/* History Details Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="history-modal-container">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowHistoryModal(false)} />

          {/* Modal Container */}
          <div className="relative w-full max-w-md bg-white border border-neutral-200 rounded-3xl p-6 shadow-2xl z-50 text-neutral-850 font-sans animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowHistoryModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 p-1 rounded-full hover:bg-neutral-100"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-2xl">
                <Landmark className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-emerald-600 font-bold tracking-widest uppercase block">Historical Fact</span>
                <span className="text-sm font-mono font-semibold text-neutral-400">Day: July 7th • Year {currentFact.year}</span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-neutral-900 mb-2 leading-snug">
              {currentFact.title}
            </h3>

            <p className="text-sm text-neutral-600 leading-relaxed mb-4">
              {currentFact.description}
            </p>

            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
              <span className="text-xs font-bold text-neutral-400 uppercase block mb-1">Fascinating Detail</span>
              <p className="text-xs text-neutral-500 leading-relaxed italic">
                "{currentFact.fact}"
              </p>
            </div>

            <button
              onClick={() => setShowHistoryModal(false)}
              className="w-full mt-5 py-2.5 bg-neutral-800 hover:bg-neutral-900 text-white font-semibold text-xs rounded-xl transition-all"
            >
              Fascinating, Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
