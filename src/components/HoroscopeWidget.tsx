import React, { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Heart, Briefcase, Star, RefreshCw } from "lucide-react";
import { horoscopeData } from "../data/mockData";

interface HoroscopeWidgetProps {
  activeSign: string;
  onSignChange: (sign: string) => void;
}

export default function HoroscopeWidget({ activeSign, onSignChange }: HoroscopeWidgetProps) {
  const zodiacs = [
    { id: "aries", name: "Aries", emoji: "♈" },
    { id: "taurus", name: "Taurus", emoji: "♉" },
    { id: "gemini", name: "Gemini", emoji: "♊" },
    { id: "cancer", name: "Cancer", emoji: "♋" },
    { id: "leo", name: "Leo", emoji: "♌" },
    { id: "virgo", name: "Virgo", emoji: "♍" },
    { id: "libra", name: "Libra", emoji: "♎" },
    { id: "scorpio", name: "Scorpio", emoji: "♏" },
    { id: "sagittarius", name: "Sagittarius", emoji: "♐" },
    { id: "capricorn", name: "Capricorn", emoji: "♑" },
    { id: "aquarius", name: "Aquarius", emoji: "♒" },
    { id: "pisces", name: "Pisces", emoji: "♓" }
  ];

  const activePrediction = horoscopeData[activeSign] || horoscopeData["cancer"];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-amber-400 fill-amber-400" : "text-neutral-200 dark:text-neutral-700"
        }`}
      />
    ));
  };

  return (
    <div className="bento-item p-6 text-left max-w-4xl mx-auto space-y-6" id="horoscope-calculator-view">
      {/* Title */}
      <div className="flex items-center space-x-2 pb-4 border-b border-neutral-100">
        <div className="p-2.5 bg-purple-50 text-[#6001d2] rounded-xl">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-neutral-900 leading-none">
            LifeHacker Daily Astrology
          </h2>
          <span className="text-xs text-neutral-400 block mt-1">
            Choose your zodiac sign for standard predictions
          </span>
        </div>
      </div>

      {/* Grid of Signs */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3" id="zodiacs-grid">
        {zodiacs.map((z) => {
          const isActive = activeSign === z.id;
          return (
            <button
              key={z.id}
              onClick={() => onSignChange(z.id)}
              className={`p-3 rounded-2xl flex flex-col items-center justify-center border transition-all cursor-pointer ${
                isActive
                  ? "bg-[#6001d2] border-[#6001d2] text-white shadow-md shadow-purple-500/10 scale-105"
                  : "bg-neutral-50 border-neutral-100 hover:bg-neutral-100 text-neutral-750"
              }`}
              id={`zodiac-btn-${z.id}`}
            >
              <span className="text-2xl mb-1.5">{z.emoji}</span>
              <span className="text-xs font-bold leading-none">{z.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active prediction card */}
      <motion.div
        key={activeSign}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-2xl bg-gradient-to-tr from-purple-50 to-indigo-50/60 border border-purple-100 flex flex-col md:flex-row gap-5 justify-between items-start md:items-center"
        id="horoscope-prediction-card"
      >
        {/* Texts */}
        <div className="space-y-2 flex-1">
          <span className="text-[10px] font-extrabold text-[#6001d2] tracking-wider uppercase block">
            TODAY'S FORECAST
          </span>
          <h3 className="text-lg font-black text-neutral-900">
            {activePrediction.sign}
          </h3>
          <p className="text-sm text-neutral-600 leading-relaxed max-w-xl">
            "{activePrediction.prediction}"
          </p>
        </div>

        {/* Ratings block */}
        <div className="w-full md:w-auto p-4 bg-white rounded-xl border border-neutral-100 space-y-3 min-w-[200px]">
          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block border-b border-neutral-50 pb-1">
            ZODIAC METRICS
          </span>
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-500 flex items-center space-x-1.5 font-semibold">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
              <span>Love Rating</span>
            </span>
            <div className="flex space-x-0.5">{renderStars(activePrediction.love)}</div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-500 flex items-center space-x-1.5 font-semibold">
              <Briefcase className="w-3.5 h-3.5 text-indigo-500 fill-current" />
              <span>Career / Luck</span>
            </span>
            <div className="flex space-x-0.5">{renderStars(activePrediction.career)}</div>
          </div>
        </div>
      </motion.div>

      {/* Advisory block */}
      <div className="text-[11px] text-neutral-400 text-center italic">
        Astro predictions are simulated daily. Have a gorgeous, mindful, and balanced day!
      </div>
    </div>
  );
}
