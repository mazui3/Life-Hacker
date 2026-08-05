export interface Comment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: string;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string[]; // split by paragraphs for beautiful rendering
  category: "news" | "finance" | "sports" | "entertainment" | "tech" | "lifestyle" | "horoscope";
  source: string;
  sourceLogo?: string;
  author: string;
  date: string;
  imageUrl: string;
  keys: string[]; // keywords for searching
  likes: number;
  comments: Comment[];
  readTime: string;
  trending?: boolean;
  requiredCategorySearches?: number;
}

export interface MonthlyWeatherDay {
  id: number;
  date: number; // Unix timestamp in seconds
  dateToRead?: number; // Integer YYYYMMDD format e.g. 20250101
  DayofWeek: number; // Day of week (e.g. 0-6 or 1-7)
  isDayOff: boolean; // Is weekend / rest day
  ifIsHoliday: string; // Holiday label e.g. "New Year's Day" or ""
  weatherCondition: number; // Weather condition code (e.g. 0-6)
  lowestTemputure: number; // Lowest temperature
  highestTemputure: number; // Highest temperature
}

export interface WeatherData {
  city: string;
  temp: number;
  high: number;
  low: number;
  condition: string;
  realFeel: number;
  forecast: {
    day: string;
    temp: string;
    condition: "sunny" | "cloudy" | "rainy" | "stormy";
  }[];
}

export interface MailMessage {
  id: string;
  from: string;
  subject: string;
  preview: string;
  time: string;
  read: boolean;
}
