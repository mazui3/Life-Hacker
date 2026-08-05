import React, { useState } from "react";
import { motion } from "motion/react";
import { Menu, Search, User, LogOut, ChevronDown } from "lucide-react";

interface HeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
  onCategorySelect: (category: string) => void;
  activeCategory: string;
  playerId: string | null;
  onOpenSignIn: () => void;
  onShowPlayerId: () => void;
  isSearchDisabled?: boolean;
}

export default function Header({
  onSearch,
  searchQuery,
  onCategorySelect,
  activeCategory,
  playerId,
  onOpenSignIn,
  onShowPlayerId,
  isSearchDisabled = false,
}: HeaderProps) {
  const [searchInput, setSearchInput] = useState(searchQuery);

  const categories = [
    { id: "all", name: "Home" },
    { id: "news", name: "News" },
    { id: "finance", name: "Finance" },
    { id: "sports", name: "Sports" },
    { id: "entertainment", name: "Entertainment" },
    { id: "tech", name: "Tech" },
    { id: "lifestyle", name: "Lifestyle" },
    { id: "horoscope", name: "Horoscope" },
    { id: "weather", name: "Weather" }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSearchDisabled) {
      onSearch(searchInput);
    }
  };

  const handleClearSearch = () => {
    if (isSearchDisabled) return;
    setSearchInput("");
    onSearch("");
  };

  const handleCategoryClick = (catId: string) => {
    onCategorySelect(catId);
    // Clearing search when category is clicked to keep filters tidy
    setSearchInput("");
    onSearch("");
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-neutral-200 shadow-xs font-sans">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Left Side: Hamburg Menu & Logo */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <button className="text-neutral-500 hover:text-neutral-850 p-1 rounded-lg hover:bg-neutral-50 md:hidden">
            <Menu className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => handleCategoryClick("all")}
            className="flex items-baseline space-x-0.5 cursor-pointer select-none group"
            id="lifehacker-header-logo-btn"
          >
            <span className="text-3xl font-black tracking-tighter text-[#6001d2] font-sans transition-transform active:scale-95">
              LifeHacker
            </span>
            <span className="text-2xl font-black text-[#6001d2] rotate-12 inline-block transform origin-bottom-left group-hover:animate-bounce">
              !
            </span>
          </button>
        </div>

        {/* Middle Side: Dynamic Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-2xl relative"
          id="lifehacker-search-form"
        >
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder={isSearchDisabled ? "Please sign in to search custom articles..." : "Search custom articles by keywords (e.g. fusion, spy, esports)..."}
              value={isSearchDisabled ? "" : searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              disabled={isSearchDisabled}
              className={`w-full pl-4 pr-24 py-2.5 bg-neutral-100/70 border border-neutral-200 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6001d2] focus:bg-white text-neutral-800 transition-all shadow-inner ${
                isSearchDisabled ? "opacity-50 cursor-not-allowed bg-neutral-100" : ""
              }`}
              id="search-input-field"
            />
            {searchInput && !isSearchDisabled && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-16 text-xs font-semibold text-neutral-400 hover:text-neutral-600 cursor-pointer"
                id="search-clear-btn"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              disabled={isSearchDisabled}
              className={`absolute right-0 h-full px-5 bg-[#6001d2] hover:bg-[#5001bd] text-white rounded-r-full flex items-center justify-center transition-all shadow-md ${
                isSearchDisabled ? "opacity-50 cursor-not-allowed bg-neutral-400" : "cursor-pointer active:bg-purple-900"
              }`}
              id="search-submit-btn"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Right Side: User Info / Sign In */}
        <div className="flex items-center space-x-3 flex-shrink-0 relative">
          {playerId ? (
            <button
              onClick={onShowPlayerId}
              className="px-4 py-1.5 bg-[#200049] hover:bg-black text-white rounded-full text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shadow-sm hover:shadow-md"
              id="header-welcome-back-btn"
            >
              <User className="w-3.5 h-3.5 text-purple-200" />
              <span>Welcome Back</span>
            </button>
          ) : (
            <button
              onClick={onOpenSignIn}
              className="px-4 py-1.5 border border-[#6001d2] text-[#6001d2] rounded-full text-xs font-bold hover:bg-purple-50 transition-all cursor-pointer flex items-center space-x-1.5"
              id="header-signin-btn"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Ribbon */}
      <div className="border-t border-neutral-200 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-none">
          <nav className="flex space-x-6 h-11 items-center text-xs font-semibold whitespace-nowrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`relative py-3 cursor-pointer text-[12px] font-bold transition-all ${
                  activeCategory === cat.id
                    ? "text-[#6001d2]"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
                id={`nav-link-${cat.id}`}
              >
                <span>{cat.name}</span>
                {activeCategory === cat.id && (
                  <motion.div
                    layoutId="activeCategoryUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6001d2]"
                  />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
