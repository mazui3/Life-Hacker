import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, ChevronLeft, ChevronRight, ThumbsUp, MessageSquare, ExternalLink, ArrowRight, Star, Heart } from "lucide-react";
import { Article, WeatherData, MonthlyWeatherDay } from "../types";
import WeatherWidget from "./WeatherWidget";
import { mockGames, trendingSearches } from "../data/mockData";
import { keywordCategoryMap } from "../data/keywordCategories";

interface NewsFeedProps {
  articles: Article[];
  onSelectArticle: (id: string) => void;
  onLike: (id: string) => void;
  weather: WeatherData;
  onWeatherCityChange: (data: WeatherData) => void;
  onHoroscopeClick: () => void;
  onKeywordClick?: (term: string) => void;
  searchStats?: Record<string, number>;
  searchCate?: Record<string, number>;
  monthlyWeather?: MonthlyWeatherDay[];
  onOpenWeatherTab?: () => void;
}

export default function NewsFeed({
  articles,
  onSelectArticle,
  onLike,
  weather,
  onWeatherCityChange,
  onHoroscopeClick,
  onKeywordClick,
  searchStats = {},
  searchCate = {},
  monthlyWeather,
  onOpenWeatherTab,
}: NewsFeedProps) {
  // Helper to get category count from PlayFab stats
  const getCategoryCount = (category: string) => {
    return searchCate[category.toLowerCase().trim()] || 0;
  };

  // Helper to get keyword count from PlayFab stats
  const getKeywordCount = (keyword: string) => {
    return searchStats[keyword.toLowerCase().trim()] || 0;
  };

  // Selection logic for 5 Carousel articles and 2 Fixed Bottom articles
  const { carouselArticles, fixedBottomArticles } = useMemo(() => {
    // 1. Determine categories ranked by search count
    const catCounts: Record<string, number> = {};
    articles.forEach((a) => {
      const cat = a.category.toLowerCase().trim();
      catCounts[cat] = searchCate[cat] || 0;
    });

    const sortedCategories = Object.keys(catCounts).sort((a, b) => catCounts[b] - catCounts[a]);

    const cat1 = sortedCategories[0] || "news";
    const cat2 = sortedCategories[1] || (sortedCategories[0] ? sortedCategories[0] : "tech");

    const usedIds = new Set<string>();

    const sortByDateDesc = (list: Article[]) => {
      return [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    };

    // Helper to get up to N trending (or newest) articles from a specific category
    const getArticlesForCategory = (category: string, count: number): Article[] => {
      const catArticles = articles.filter(
        (a) => a.category.toLowerCase().trim() === category.toLowerCase().trim() && !usedIds.has(a.id)
      );
      const trending = sortByDateDesc(catArticles.filter((a) => a.trending));
      const nonTrending = sortByDateDesc(catArticles.filter((a) => !a.trending));

      const selected: Article[] = [];
      for (const item of trending) {
        if (selected.length < count) {
          selected.push(item);
          usedIds.add(item.id);
        }
      }
      for (const item of nonTrending) {
        if (selected.length < count) {
          selected.push(item);
          usedIds.add(item.id);
        }
      }
      return selected;
    };

    // Category #1: 3 articles (2 for carousel, 1 for fixed bottom)
    const cat1Articles = getArticlesForCategory(cat1, 3);
    // Category #2: 3 articles (2 for carousel, 1 for fixed bottom)
    const cat2Articles = getArticlesForCategory(cat2, 3);

    // Other categories: 1 article (for carousel)
    const otherArticlesPool = articles.filter(
      (a) =>
        a.category.toLowerCase().trim() !== cat1.toLowerCase().trim() &&
        a.category.toLowerCase().trim() !== cat2.toLowerCase().trim() &&
        !usedIds.has(a.id)
    );
    const otherTrending = sortByDateDesc(otherArticlesPool.filter((a) => a.trending));
    const otherNonTrending = sortByDateDesc(otherArticlesPool.filter((a) => !a.trending));

    const otherSelected: Article[] = [];
    if (otherTrending.length > 0) {
      otherSelected.push(otherTrending[0]);
      usedIds.add(otherTrending[0].id);
    } else if (otherNonTrending.length > 0) {
      otherSelected.push(otherNonTrending[0]);
      usedIds.add(otherNonTrending[0].id);
    }

    // Build carousel array (up to 5 articles)
    const carousel: Article[] = [];
    if (cat1Articles[0]) carousel.push(cat1Articles[0]);
    if (cat1Articles[1]) carousel.push(cat1Articles[1]);
    if (cat2Articles[0]) carousel.push(cat2Articles[0]);
    if (cat2Articles[1]) carousel.push(cat2Articles[1]);
    if (otherSelected[0]) carousel.push(otherSelected[0]);

    // Pad carousel if needed
    if (carousel.length < 5) {
      const remaining = sortByDateDesc(articles.filter((a) => !usedIds.has(a.id)));
      for (const item of remaining) {
        if (carousel.length < 5) {
          carousel.push(item);
          usedIds.add(item.id);
        }
      }
    }

    // Build fixed bottom array (2 articles)
    const fixedBottom: Article[] = [];
    if (cat1Articles[2]) fixedBottom.push(cat1Articles[2]);
    if (cat2Articles[2]) fixedBottom.push(cat2Articles[2]);

    // Pad fixed bottom if needed
    if (fixedBottom.length < 2) {
      const remaining = sortByDateDesc(articles.filter((a) => !usedIds.has(a.id)));
      for (const item of remaining) {
        if (fixedBottom.length < 2) {
          fixedBottom.push(item);
          usedIds.add(item.id);
        }
      }
    }

    return { carouselArticles: carousel, fixedBottomArticles: fixedBottom };
  }, [articles, searchCate]);

  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play effect
  useEffect(() => {
    if (!isAutoPlaying || carouselArticles.length <= 1) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselArticles.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, carouselArticles.length]);

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCarouselIndex((prev) => (prev - 1 + carouselArticles.length) % carouselArticles.length);
  };

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCarouselIndex((prev) => (prev + 1) % carouselArticles.length);
  };

  const currentHero = carouselArticles[carouselIndex] || articles[0];

  // Most Popular Sidebar items - sorted primarily by category search counts, secondary by likes
  const popularArticles = [...articles]
    .sort((a, b) => {
      const countA = getCategoryCount(a.category);
      const countB = getCategoryCount(b.category);
      if (countB !== countA) {
        return countB - countA;
      }
      return b.likes - a.likes;
    })
    .slice(0, 5);

  // Sorted Trending Searches based on user's hit history from PlayFab
  const excludedCategories = ["news", "entertainment", "finance", "sports", "tech", "lifestyle"];
  
  const historyKeywords = Object.entries(searchStats)
    .filter(([key, count]) => !excludedCategories.includes(key.toLowerCase().trim()) && count > 0)
    .map(([key, count]) => {
      // Find proper capitalization for the keyword
      let properName = key;
      const originalMapKey = Object.keys(keywordCategoryMap).find(
        (k) => k.toLowerCase() === key.toLowerCase().trim()
      );
      if (originalMapKey) {
        properName = originalMapKey;
      } else {
        const originalTrendingKey = trendingSearches.find(
          (k) => k.toLowerCase() === key.toLowerCase().trim()
        );
        if (originalTrendingKey) {
          properName = originalTrendingKey;
        } else {
          properName = key.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        }
      }
      return { name: properName, count };
    })
    .sort((a, b) => b.count - a.count);

  const sortedTrendingSearches = historyKeywords.length > 0
    ? historyKeywords.slice(0, 7).map((item) => item.name)
    : [...trendingSearches].sort((a, b) => {
        const countA = getKeywordCount(a);
        const countB = getKeywordCount(b);
        if (countB !== countA) {
          return countB - countA;
        }
        return 0;
      });

  // Top header featured articles IDs
  const topFeaturedIds = new Set([
    ...carouselArticles.map((a) => a.id),
    ...fixedBottomArticles.map((a) => a.id),
  ]);

  // Standard stream stories (excluding carousel and fixed bottom top hero articles)
  const streamStories = articles.filter((a) => !topFeaturedIds.has(a.id));

  // Ad banner close state
  const [showAd, setShowAd] = useState(true);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 font-sans" id="news-feed-container">
      {/* 3-Column LifeHacker Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Most Popular list (Desktop-only/Responsive Span) */}
        <div className="lg:col-span-3 space-y-6 text-left order-2 lg:order-1">

          {/* Most Popular Section */}
          <div className="bento-item p-5" id="most-popular-sidebar">
            <h3 className="text-sm font-extrabold text-neutral-900 tracking-tight uppercase border-b border-neutral-100 pb-3 mb-4">
              Most Popular
            </h3>
            <div className="space-y-4">
              {popularArticles.map((art, idx) => (
                <div
                  key={art.id}
                  onClick={() => onSelectArticle(art.id)}
                  className="flex items-start space-x-3 cursor-pointer group"
                  id={`popular-item-${idx}`}
                >
                  <span className="text-2xl font-black text-purple-200 group-hover:text-[#6001d2] transition-colors w-6 flex-shrink-0 text-center">
                    {idx + 1}
                  </span>
                  <div className="space-y-1 flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-neutral-800 leading-snug group-hover:text-[#6001d2] transition-colors line-clamp-2">
                      {art.title}
                    </h4>
                    <span className="text-[10px] text-neutral-400 block">{art.source}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending searches box */}
          <div className="bento-item p-5">
            <h3 className="text-sm font-extrabold text-neutral-900 tracking-tight uppercase pb-3 mb-2">
              Trending Searches
            </h3>
            <div className="flex flex-wrap gap-1.5" id="trending-searches-list">
              {sortedTrendingSearches.map((term, i) => (
                <span
                  key={i}
                  onClick={() => onKeywordClick?.(term)}
                  className="bg-neutral-50 text-neutral-600 text-[11px] font-medium px-2.5 py-1 rounded-xl cursor-pointer hover:bg-purple-50 hover:text-[#6001d2] transition-all border border-neutral-100"
                >
                  {term}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Carousel & Primary stories stream */}
        <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
          
          {/* Main Hero Carousel */}
          {currentHero && (
            <div
              onClick={() => onSelectArticle(currentHero.id)}
              className="relative overflow-hidden rounded-3xl bg-neutral-900 aspect-[16/9] shadow-md border border-neutral-200 group cursor-pointer transition-all duration-300 hover:shadow-lg"
              id="hero-news-carousel"
            >
              <img
                src={currentHero.imageUrl}
                alt={currentHero.title}
                className="w-full h-full object-cover opacity-90 group-hover:scale-101 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

              {/* Badges/Indicator top right */}
              <div className="absolute top-4 right-4 flex items-center space-x-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] text-white font-bold tracking-wider z-10">
                <span className="font-mono">{carouselIndex + 1} of {carouselArticles.length}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAutoPlaying(!isAutoPlaying);
                  }}
                  className="hover:text-purple-300 transition-colors cursor-pointer"
                  title={isAutoPlaying ? "Pause autoplay" : "Play autoplay"}
                  id="carousel-playpause-btn"
                >
                  {isAutoPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                </button>
              </div>

              {/* Caption details overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 text-left space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="bg-red-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider font-sans">
                    Trending
                  </span>
                  <span className="text-[11px] font-bold text-purple-200 font-sans tracking-wide">
                    {currentHero.source}
                  </span>
                </div>
                <h2 className="text-lg sm:text-2xl font-black text-white leading-tight tracking-tight group-hover:underline">
                  {currentHero.title}
                </h2>
                <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                  {currentHero.summary}
                </p>
              </div>

              {/* Left & Right arrow handles */}
              <button
                onClick={handlePrevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-[#6001d2]/80 hover:scale-110 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10 cursor-pointer"
                id="carousel-prev-btn"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-[#6001d2]/80 hover:scale-110 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10 cursor-pointer"
                id="carousel-next-btn"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Sub-Bento stories list (Row grid below Carousel - 2 fixed articles) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="bento-stories-grid">
            {fixedBottomArticles.map((story) => (
              <div
                key={story.id}
                onClick={() => onSelectArticle(story.id)}
                className="bento-item flex flex-col h-full group text-left cursor-pointer"
                id={`bento-card-${story.id}`}
              >
                <div className="aspect-[16/10] relative bg-neutral-100 overflow-hidden">
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-3 left-3 bg-white/95 text-neutral-800 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                    {story.category}
                  </span>
                </div>
                <div className="p-4 flex flex-col justify-between flex-1 space-y-2">
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 font-semibold">{story.source}</span>
                    <h3 className="text-sm font-extrabold text-neutral-850 leading-snug group-hover:text-[#6001d2] transition-colors line-clamp-2">
                      {story.title}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 border-t border-neutral-100 pt-2">
                    <span className="font-mono">{story.readTime}</span>
                    <span className="flex items-center space-x-1">
                      <ThumbsUp className="w-3 h-3 text-[#6001d2]" />
                      <span>{story.likes}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>



        </div>

        {/* RIGHT COLUMN: Weather & Games */}
        <div className="lg:col-span-3 space-y-6 order-3">
          {/* Weather Card container */}
          <WeatherWidget
            monthlyWeather={monthlyWeather}
            onOpenWeatherTab={onOpenWeatherTab}
          />
        </div>

      </div>
    </div>
  );
}
