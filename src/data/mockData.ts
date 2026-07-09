import { WeatherData, MailMessage, Article } from "../types";
import articlesRaw from "./articles.json";

// Typed articles export
export const articlesData: Article[] = articlesRaw as Article[];

// Multi-city weather profiles
export const weatherProfiles: Record<string, WeatherData> = {
  montreal: {
    city: "Montreal",
    temp: 29,
    high: 32,
    low: 21,
    condition: "Mostly Cloudy",
    realFeel: 29,
    forecast: [
      { day: "TODAY", temp: "32° / 21°", condition: "cloudy" },
      { day: "SUN", temp: "28° / 18°", condition: "rainy" },
      { day: "MON", temp: "28° / 19°", condition: "sunny" },
      { day: "TUE", temp: "25° / 18°", condition: "sunny" }
    ]
  },
  vancouver: {
    city: "Vancouver",
    temp: 22,
    high: 24,
    low: 15,
    condition: "Sunny & Mild",
    realFeel: 22,
    forecast: [
      { day: "TODAY", temp: "24° / 15°", condition: "sunny" },
      { day: "SUN", temp: "23° / 14°", condition: "sunny" },
      { day: "MON", temp: "21° / 13°", condition: "cloudy" },
      { day: "TUE", temp: "19° / 12°", condition: "rainy" }
    ]
  },
  toronto: {
    city: "Toronto",
    temp: 28,
    high: 30,
    low: 20,
    condition: "Scattered Showers",
    realFeel: 31,
    forecast: [
      { day: "TODAY", temp: "30° / 20°", condition: "rainy" },
      { day: "SUN", temp: "29° / 19°", condition: "stormy" },
      { day: "MON", temp: "26° / 17°", condition: "sunny" },
      { day: "TUE", temp: "27° / 18°", condition: "sunny" }
    ]
  },
  newyork: {
    city: "New York",
    temp: 31,
    high: 34,
    low: 24,
    condition: "Humid & Sunny",
    realFeel: 36,
    forecast: [
      { day: "TODAY", temp: "34° / 24°", condition: "sunny" },
      { day: "SUN", temp: "31° / 22°", condition: "cloudy" },
      { day: "MON", temp: "32° / 23°", condition: "stormy" },
      { day: "TUE", temp: "30° / 21°", condition: "sunny" }
    ]
  },
  london: {
    city: "London",
    temp: 18,
    high: 20,
    low: 11,
    condition: "Light Drizzle",
    realFeel: 17,
    forecast: [
      { day: "TODAY", temp: "20° / 11°", condition: "rainy" },
      { day: "SUN", temp: "21° / 12°", condition: "cloudy" },
      { day: "MON", temp: "19° / 10°", condition: "rainy" },
      { day: "TUE", temp: "22° / 13°", condition: "sunny" }
    ]
  },
  tokyo: {
    city: "Tokyo",
    temp: 27,
    high: 30,
    low: 22,
    condition: "Clear Sky",
    realFeel: 29,
    forecast: [
      { day: "TODAY", temp: "30° / 22°", condition: "sunny" },
      { day: "SUN", temp: "31° / 23°", condition: "sunny" },
      { day: "MON", temp: "29° / 21°", condition: "cloudy" },
      { day: "TUE", temp: "28° / 20°", condition: "rainy" }
    ]
  }
};

// Zodiac horoscopes
export const horoscopeData: Record<string, { sign: string; prediction: string; love: number; career: number }> = {
  aries: {
    sign: "Aries (March 21 - April 19)",
    prediction: "Today brings dynamic energy. Don't let petty disagreements distract you from high-level vision.",
    love: 4,
    career: 5
  },
  taurus: {
    sign: "Taurus (April 20 - May 20)",
    prediction: "Focus on stable foundations. A sudden financial insight could open doors to a long-term compound asset.",
    love: 5,
    career: 4
  },
  gemini: {
    sign: "Gemini (May 21 - June 20)",
    prediction: "Your communication is razor-sharp. Write down your ideas—the universe is listening to your intellectual frequencies.",
    love: 3,
    career: 5
  },
  cancer: {
    sign: "Cancer (June 21 - July 22)",
    prediction: "See if you can clear important work out of the way early today so you can retreat into comfortable spaces.",
    love: 5,
    career: 3
  },
  leo: {
    sign: "Leo (July 23 - August 22)",
    prediction: "Your leadership is magnetic today. An unexpected project proposal will allow you to shine brightly.",
    love: 4,
    career: 5
  },
  virgo: {
    sign: "Virgo (August 23 - September 22)",
    prediction: "Pristine organization pays off. Review your details closely; a tiny typo in plans can be avoided easily.",
    love: 4,
    career: 4
  },
  libra: {
    sign: "Libra (September 23 - October 22)",
    prediction: "Balance is your superpower. Take extra time to weigh your options before committing to social obligations.",
    love: 5,
    career: 4
  },
  scorpio: {
    sign: "Scorpio (October 23 - November 21)",
    prediction: "Your intuition is highly potent. Trust your gut instincts regarding a new acquaintance or collaboration.",
    love: 4,
    career: 5
  },
  sagittarius: {
    sign: "Sagittarius (November 22 - December 21)",
    prediction: "Adventure calls. It's an excellent day to break free from standard routines and learn a brand-new skill.",
    love: 5,
    career: 3
  },
  capricorn: {
    sign: "Capricorn (December 22 - January 19)",
    prediction: "Your discipline is unparalleled today. Tackle your hardest spreadsheet or research project with confidence.",
    love: 3,
    career: 5
  },
  aquarius: {
    sign: "Aquarius (January 20 - February 18)",
    prediction: "Think outside the box. A quirky or unconventional solution will resolve a long-standing workflow block.",
    love: 5,
    career: 4
  },
  pisces: {
    sign: "Pisces (February 19 - March 20)",
    prediction: "Your creative currents are flowing smoothly. Immerse yourself in music, art, or deep-focus coding.",
    love: 5,
    career: 3
  }
};

// LifeHacker Mail Messages
export const mockEmails: MailMessage[] = [
  {
    id: "m1",
    from: "Flickr Team",
    subject: "Your Weekly Photography Digest is Ready!",
    preview: "See the top captures from around the world. Your photo 'Rainy Prague Subways' was featured in our curated urban collection...",
    time: "10:14 AM",
    read: false
  },
  {
    id: "m2",
    from: "Fantasy Football League",
    subject: "URGENT: Roster lock in 2 hours",
    preview: "Hi Manager, your current lineup has 1 injured player on the bench. Swap them before the Thursday night game kicks off!",
    time: "08:30 AM",
    read: false
  },
  {
    id: "m3",
    from: "LifeHacker Security Alert",
    subject: "New sign-in from Chrome on Linux",
    preview: "We detected a successful sign-in to your LifeHacker account f6cf692e from an unrecognized device in Montreal, Canada...",
    time: "Yesterday",
    read: true
  },
  {
    id: "m4",
    from: "Groupon Local Deals",
    subject: "50% Off Spa Days & Kayak Rentals near Montreal",
    preview: "Get ready for summer! We have unlocked limited-time vouchers for Nordic thermotherapy pools and Saint Lawrence kayaking tours...",
    time: "Yesterday",
    read: true
  },
  {
    id: "m5",
    from: "TechCrunch Newsletter",
    subject: "The Rise of Local WebAssembly Compilers",
    preview: "How edge runtimes are transforming modern application development. In this issue: Google's new client compiler, WebGPU performance, and more...",
    time: "2 days ago",
    read: true
  }
];

// LifeHacker Games
export const mockGames = [
  {
    id: "g1",
    name: "LifeHacker Solitaire Roadtrip",
    tag: "New game",
    plays: "48.7K playing",
    image: "https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "g2",
    name: "Solitaire Classic",
    tag: "Most Popular",
    plays: "31.2K playing",
    image: "https://images.unsplash.com/photo-1543599538-a534db4701ab?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "g3",
    name: "LifeHacker Crossword",
    tag: "Daily Challenge",
    plays: "22.6K playing",
    image: "https://images.unsplash.com/photo-1585241938090-67d5e8ed4954?w=300&auto=format&fit=crop&q=80"
  }
];

// Trending Searches on LifeHacker
export const trendingSearches = [
  "Taylor Swift Wedding Schedule",
  "Solar Fusion 2030 Treaty",
  "Best spy shows 2026",
  "Montreal real-feel temperatures",
  "E-sports in summer games",
  "Gemini Local WebAssembly compiler",
  "Prague spy filming spots"
];
