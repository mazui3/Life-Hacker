export const keywordCategoryMap: Record<string, string> = {
  // news
  "solar": "news",
  "fusion": "news",
  "energy": "news",
  "clean tech": "news",
  "2030": "news",
  "helios": "news",
  "grid": "news",
  "climate": "news",
  "treaty": "news",
  "geneva": "news",
  "canada": "news",
  "rail": "news",
  "toronto": "news",
  "montreal": "news",
  "transit": "news",
  "speed": "news",
  "train": "news",
  "maglev": "news",
  "infrastructure": "news",
  "Solar Fusion 2030 Treaty": "news",

  // entertainment
  "star city": "entertainment",
  "spy": "entertainment",
  "thriller": "entertainment",
  "movie": "entertainment",
  "behind the scenes": "entertainment",
  "clara rossi": "entertainment",
  "liam vance": "entertainment",
  "cinema": "entertainment",
  "music": "entertainment",
  "concert": "entertainment",
  "tour": "entertainment",
  "records": "entertainment",
  "pop": "entertainment",
  "luna rose": "entertainment",
  "acoustic": "entertainment",
  "singapore": "entertainment",
  "Best spy shows 2026": "entertainment",
  "Prague spy filming spots": "entertainment",

  // finance
  "finance": "finance",
  "bonds": "finance",
  "green": "finance",
  "market": "finance",
  "investing": "finance",
  "eco": "finance",
  "esg": "finance",
  "money": "finance",
  "stocks": "finance",
  "wall street": "finance",
  "crypto": "finance",
  "bitcoin": "finance",

  // sports
  "esports": "sports",
  "gaming": "sports",
  "olympics": "sports",
  "sports": "sports",
  "demonstration": "sports",
  "sato": "sports",
  "tokyo": "sports",
  "competition": "sports",
  "soccer": "sports",
  "football": "sports",
  "basketball": "sports",
  "E-sports in summer games": "sports",

  // tech
  "gemini": "tech",
  "compiler": "tech",
  "ai": "tech",
  "coding": "tech",
  "edge": "tech",
  "browser": "tech",
  "tech": "tech",
  "webassembly": "tech",
  "google": "tech",
  "silicon valley": "tech",
  "quantum": "tech",
  "robotics": "tech",
  "space": "tech",
  "telescope": "tech",
  "water": "tech",
  "planet": "tech",
  "science": "tech",
  "kepler": "tech",
  "nasa": "tech",
  "astronomy": "tech",
  "Gemini Local WebAssembly compiler": "tech",

  // lifestyle
  "lifestyle": "lifestyle",
  "detox": "lifestyle",
  "walk": "lifestyle",
  "coffee": "lifestyle",
  "health": "lifestyle",
  "habits": "lifestyle",
  "mindfulness": "lifestyle",
  "wellness": "lifestyle",
  "weather": "lifestyle",
  "travel": "lifestyle",
  "recipe": "lifestyle",
  "cooking": "lifestyle",
  "fitness": "lifestyle",
  "horoscope": "lifestyle",
  "Montreal real-feel temperatures": "lifestyle"
};

export function getKeywordCategory(keyword: string): string {
  const normalized = keyword.trim().toLowerCase();
  
  // 1. Direct match
  if (keywordCategoryMap[normalized]) {
    return keywordCategoryMap[normalized];
  }
  
  // 2. Substring match
  for (const [key, cat] of Object.entries(keywordCategoryMap)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return cat;
    }
  }
  
  // Default fallback
  return "news";
}

export function findHitKeyword(query: string): string | null {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return null;

  // Sort keywords by length descending so we match the most specific/longest keywords first
  const sortedKeywords = Object.keys(keywordCategoryMap).sort((a, b) => b.length - a.length);

  for (const keyword of sortedKeywords) {
    if (normalizedQuery.includes(keyword.toLowerCase())) {
      return keyword;
    }
  }

  return null;
}

// Client helper to parse stats
export function parseStats(statsStr: string): Record<string, number> {
  const result: Record<string, number> = {};
  if (!statsStr) return result;
  const parts = statsStr.split("|");
  for (const part of parts) {
    const colonIndex = part.lastIndexOf(":");
    if (colonIndex !== -1) {
      const key = part.slice(0, colonIndex).toLowerCase().trim();
      const val = parseInt(part.slice(colonIndex + 1), 10);
      if (key && !isNaN(val)) {
        result[key] = val;
      }
    }
  }
  return result;
}
