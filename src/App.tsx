import React, { useState, useMemo, useEffect } from "react";
import { Sparkles, MessageSquare, HelpCircle, Landmark, Compass, Gamepad2, Heart, Award } from "lucide-react";
import { Article, WeatherData } from "./types";
import { articlesData, weatherProfiles } from "./data/mockData";
import { getKeywordCategory, parseStats } from "./data/keywordCategories";

// Components
import Header from "./components/Header";
import WidgetsRow from "./components/WidgetsRow";
import NewsFeed from "./components/NewsFeed";
import ArticleDetail from "./components/ArticleDetail";
import HoroscopeWidget from "./components/HoroscopeWidget";
import SearchResults from "./components/SearchResults";

export default function App() {
  // Authentication State
  const [playerId, setPlayerId] = useState<string | null>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
  });

  const [sessionTicket, setSessionTicket] = useState<string | null>(null);
  const [searchStats, setSearchStats] = useState<Record<string, number>>({});
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // PlayFab Login and fetch stats effect
  // 用一个 Ref 防止组件重复挂载时重复请求
  const hasFetchedRef = React.useRef(false);

  useEffect(() => {
    // 如果没有 URL 传进来的 playerId (即 Unity 的 PlayFabId)，或者已经查过了，就返回
    if (!playerId || hasFetchedRef.current) return;

    async function fetchUnityPlayerStats() {
      hasFetchedRef.current = true;
      setIsLoginLoading(true); // 这里可以理解为“正在加载玩家数据”

      try {
        console.log(`正在通过 Netlify 后端查询 Unity 玩家 [${playerId}] 的数据...`);
        const response = await fetch("/.netlify/functions/playfab", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "get_stats",
            playFabId: playerId // 👈 直接把 Unity ID 传给后端
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          const parsed = parseStats(data.stats);
          setSearchStats(parsed);
          console.log("成功同步 Unity 玩家的 PlayFab 统计数据:", parsed);
        } else {
          console.error("无法获取该 Unity 玩家数据，请检查后台是否存在该 ID:", data.error || data);
        }
      } catch (err) {
        console.error("网络请求失败:", err);
      } finally {
        setIsLoginLoading(false);
      }
    }

    fetchUnityPlayerStats();
  }, [playerId]);

  const [showSignInRequired, setShowSignInRequired] = useState(false);
  const [showSignInInput, setShowSignInInput] = useState(false);
  const [showPlayerId, setShowPlayerId] = useState(false);
  const [inputPlayerId, setInputPlayerId] = useState("");

  // Search and Category State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  // Live Modifiable Datasets (to enable liking)
  const [articles, setArticles] = useState<Article[]>(articlesData);
  const [weather, setWeather] = useState<WeatherData>(weatherProfiles.montreal);
  const [activeHoroscopeSign, setActiveHoroscopeSign] = useState("cancer");

  const handleSelectArticle = (id: string | null) => {
    if (id === null) {
      setSelectedArticleId(null);
      return;
    }
    if (!playerId) {
      setShowSignInRequired(true);
      return;
    }
    setSelectedArticleId(id);
  };

  const recordSearchInPlayFab = async (query: string) => {
    if (!query.trim() || !playerId) return;

    const category = getKeywordCategory(query);
    const normalizedQuery = query.trim().toLowerCase();

    // Optimistic local update
    setSearchStats((prev) => {
      const copy = { ...prev };
      copy[category] = (copy[category] || 0) + 1;
      copy[normalizedQuery] = (copy[normalizedQuery] || 0) + 1;
      return copy;
    });

    try {
      const response = await fetch("/.netlify/functions/playfab", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": sessionTicket,
        },
        body: JSON.stringify({
          action: "update_stats",
          playFabId: playerId,
          keyword: normalizedQuery,
          category: category,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSearchStats(parseStats(data.stats));
      }
    } catch (err) {
      console.error("Failed to sync search stats to PlayFab:", err);
    }
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setSearchQuery("");
      return;
    }
    if (!playerId) {
      setShowSignInRequired(true);
      return;
    }
    setSearchQuery(query);
    recordSearchInPlayFab(query);
  };

  // Article Liking callback (animates and increments count)
  const handleLikeArticle = (articleId: string) => {
    setArticles((prev) =>
      prev.map((art) => {
        if (art.id === articleId) {
          return { ...art, likes: art.likes + 1 };
        }
        return art;
      })
    );
  };

  // Interactive widget row handlers
  const handleTickerWeatherClick = () => {
    // Scrolls to the weather card or signals the right sidebar on desktop
    const element = document.getElementById("weather-sidebar-widget");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      element.classList.add("ring-2", "ring-purple-600");
      setTimeout(() => {
        element.classList.remove("ring-2", "ring-purple-600");
      }, 1500);
    }
  };

  const handleTickerHoroscopeClick = () => {
    setActiveCategory("horoscope");
    setSelectedArticleId(null);
    setSearchQuery("");
  };

  const handleTickerWatchClick = () => {
    // Opens the spy thriller article details
    handleSelectArticle("star-city-thriller");
  };

  // Search Matching Algorithm
  const filteredSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();

    return articles.filter((art) => {
      // Check title
      const titleMatch = art.title.toLowerCase().includes(query);
      // Check summary
      const summaryMatch = art.summary.toLowerCase().includes(query);
      // Check category
      const categoryMatch = art.category.toLowerCase().includes(query);
      // Check keywords array
      const keywordMatch = art.keys.some((key) => key.toLowerCase().includes(query));
      // Check body paragraphs
      const bodyMatch = art.content.some((p) => p.toLowerCase().includes(query));

      return titleMatch || summaryMatch || categoryMatch || keywordMatch || bodyMatch;
    });
  }, [searchQuery, articles]);

  // Secondary search selector (for keywords clicks)
  const handleKeywordSelect = (term: string) => {
    handleSearch(term);
  };

  // Category news filtering
  const categoryArticles = useMemo(() => {
    if (activeCategory === "all") return articles;
    return articles.filter((art) => art.category === activeCategory);
  }, [activeCategory, articles]);

  // Selected active article detail object
  const activeArticleObj = useMemo(() => {
    if (!selectedArticleId) return null;
    return articles.find((a) => a.id === selectedArticleId) || null;
  }, [selectedArticleId, articles]);

  // Related articles suggestion (excluding current article, prioritizing matching category)
  const relatedArticles = useMemo(() => {
    if (!activeArticleObj) return [];
    return articles
      .filter((a) => a.id !== activeArticleObj.id && a.category === activeArticleObj.category)
      .slice(0, 2);
  }, [activeArticleObj, articles]);

  const handleCategorySelect = (catId: string) => {
    setActiveCategory(catId);
    setSelectedArticleId(null);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-neutral-900 font-sans antialiased pb-12 transition-colors duration-300">

      {/* Header component */}
      <Header
        onSearch={handleSearch}
        searchQuery={searchQuery}
        onCategorySelect={handleCategorySelect}
        activeCategory={activeCategory}
        playerId={playerId}
        onOpenSignIn={() => {
          setInputPlayerId("");
          setShowSignInInput(true);
        }}
        onShowPlayerId={() => setShowPlayerId(true)}
        isSearchDisabled={!!selectedArticleId}
      />

      <main className="max-w-7xl mx-auto px-4 mt-2">
        {/* Top Ticker row is always shown except inside reading mode for clean layout */}
        {!selectedArticleId && (
          <WidgetsRow
            weather={weather}
            activeHoroscopeSign={activeHoroscopeSign}
            onWeatherClick={handleTickerWeatherClick}
            onHoroscopeClick={handleTickerHoroscopeClick}
            onWatchClick={handleTickerWatchClick}
          />
        )}

        {/* View Router */}
        <div className="mt-4">
          {/* Article Reading View */}
          {selectedArticleId && activeArticleObj ? (
            <ArticleDetail
              article={activeArticleObj}
              onBack={() => handleSelectArticle(null)}
              relatedArticles={relatedArticles}
              onSelectArticle={handleSelectArticle}
            />
          ) : searchQuery ? (
            /* Search Results View */
            <SearchResults
              query={searchQuery}
              results={filteredSearchResults}
              onSelectArticle={(id) => {
                // If it's a known keyword, set search query; otherwise select article
                const isKeyword = articles.some((a) => a.keys.includes(id));
                if (isKeyword) {
                  handleSearch(id);
                } else {
                  handleSelectArticle(id);
                }
              }}
              onClearSearch={() => setSearchQuery("")}
              onSearchKeyClick={handleKeywordSelect}
            />
          ) : activeCategory === "horoscope" ? (
            /* Horoscope Dashboard */
            <HoroscopeWidget
              activeSign={activeHoroscopeSign}
              onSignChange={setActiveHoroscopeSign}
            />
          ) : (
            /* Default LifeHacker Portal Feed */
            <NewsFeed
              articles={categoryArticles}
              onSelectArticle={handleSelectArticle}
              onLike={handleLikeArticle}
              weather={weather}
              onWeatherCityChange={setWeather}
              onHoroscopeClick={handleTickerHoroscopeClick}
              onKeywordClick={handleKeywordSelect}
              searchStats={searchStats}
            />
          )}
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-neutral-200 text-center text-xs text-neutral-500 space-y-2">
        <p>© 2026 Life Hacker Client Corporation. All rights reserved. Simulated for demo representation.</p>
      </footer>

      {/* Custom authentication modals */}
      {showSignInInput && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-neutral-200 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-150">
            <h3 className="text-lg font-extrabold text-neutral-900 tracking-tight">
              LifeHacker! Client Sign In
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed font-medium">
              Please enter your Player ID to enable interactive mock layouts and premium feeds.
            </p>
            <div>
              <input
                type="text"
                placeholder="e.g. 12345"
                value={inputPlayerId}
                onChange={(e) => setInputPlayerId(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && inputPlayerId.trim()) {
                    window.location.search = `?id=${encodeURIComponent(inputPlayerId.trim())}`;
                  }
                }}
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6001d2] text-neutral-800 text-center font-bold tracking-wider"
                autoFocus
              />
            </div>
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setShowSignInInput(false)}
                className="flex-1 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={!inputPlayerId.trim()}
                onClick={() => {
                  if (inputPlayerId.trim()) {
                    window.location.search = `?id=${encodeURIComponent(inputPlayerId.trim())}`;
                  }
                }}
                className="flex-1 py-2 bg-[#6001d2] hover:bg-[#5001bd] disabled:bg-neutral-300 disabled:text-neutral-500 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}

      {showPlayerId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-neutral-200 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 bg-purple-50 text-[#6001d2] rounded-full flex items-center justify-center mx-auto text-xl font-black">
              ID
            </div>
            <h3 className="text-lg font-extrabold text-neutral-900 tracking-tight">
              Player Authentication Info
            </h3>
            <p className="text-xs text-neutral-500">
              You are currently authenticated with the following Player ID:
            </p>
            <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-150 select-all">
              <span className="font-mono font-bold text-sm text-[#6001d2] tracking-wider">
                {playerId}
              </span>
            </div>
            <div className="pt-2">
              <button
                onClick={() => setShowPlayerId(false)}
                className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {showSignInRequired && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-neutral-200 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <h3 className="text-lg font-extrabold text-neutral-900 tracking-tight">
              Please sign in for more content
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              To browse customized layouts, view full news stories, or perform searches, please register or authenticate with your Player ID.
            </p>
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setShowSignInRequired(false)}
                className="flex-1 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowSignInRequired(false);
                  setInputPlayerId("");
                  setShowSignInInput(true);
                }}
                className="flex-1 py-2 bg-[#6001d2] hover:bg-[#5001bd] text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
              >
                Sign In Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
