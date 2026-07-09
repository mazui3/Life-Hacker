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
  isHero?: boolean;
  readTime: string;
  trending?: boolean;
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
