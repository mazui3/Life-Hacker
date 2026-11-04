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

  // Fictional town memories, loosely inspired by the Sandbox articles.
  const historyFacts = [
    {
      year: "2021",
      title: "The Tuesday That Needed a Queue",
      description: "GreenLeaf's first neighborhood discount day drew a line all the way to the shopping carts. Three residents joined it without knowing what was on sale.",
      fact: "The unofficial queue captain was paid in a slightly bruised pear. Local bargain hunters still describe this as a leadership opportunity."
    },
    {
      year: "2022",
      title: "The Hive Labels Its First Fridge",
      description: "Sandbox's capsule co-living pioneers introduced a shared-fridge labeling system after six identical lunch boxes caused a very polite investigation.",
      fact: "The first label simply read 'mine.' By dinner, all six boxes had the same label. A residents' committee was formed immediately."
    },
    {
      year: "2023",
      title: "Exit 4 Gets a Carrot Lane",
      description: "Valley farmers tested a roadside produce stall at Highway Exit 4. Commuters discovered they could pick up dinner ingredients without leaving their cars.",
      fact: "One customer asked whether the carrots came with loyalty points. The farmer added an extra carrot and called the matter settled."
    },
    {
      year: "2024",
      title: "A Hug Holds Up the Square",
      description: "An early Free Hugs gathering in Downtown Square briefly blocked the path to a coffee stand. Nobody filed a complaint until the coffee went cold.",
      fact: "Organizers moved two steps to the left. Town records describe this as a successful pedestrian improvement project."
    },
    {
      year: "2024",
      title: "Umami House's First Unofficial Guest",
      description: "Before Umami House opened, a resident mistook a staff noodle tasting for the lunch queue and waited outside for forty minutes.",
      fact: "The staff offered a bowl anyway. The resident's review praised the noodles and suggested the opening hours were 'more of a feeling.'"
    }
  ];

  // Rotate town memories daily; these are anecdotes, not date-matched anniversaries.
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
                <span className="text-xs text-emerald-600 font-bold tracking-widest uppercase block">Sandbox Town Archives</span>
                <span className="text-sm font-mono font-semibold text-neutral-400">Sandbox / Year {currentFact.year}</span>
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
