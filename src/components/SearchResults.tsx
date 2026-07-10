import React from "react";
import { ArrowLeft, Search, ThumbsUp, Calendar, ArrowRight, CornerDownRight } from "lucide-react";
import { Article } from "../types";
import { findHitKeyword } from "../data/keywordCategories";

interface SearchResultsProps {
  query: string;
  results: Article[];
  onSelectArticle: (id: string) => void;
  onClearSearch: () => void;
  onSearchKeyClick: (key: string) => void;
}

export default function SearchResults({
  query,
  results,
  onSelectArticle,
  onClearSearch,
  onSearchKeyClick,
}: SearchResultsProps) {
  const recommendations = ["solar", "fusion", "spy", "olympics", "esports", "gemini", "wellness"];
  const hitKeyword = findHitKeyword(query);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 font-sans text-left" id="search-results-viewport">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100 mb-6">
        <div>
          <button
            onClick={onClearSearch}
            className="inline-flex items-center space-x-1 text-xs font-bold text-[#6001d2] hover:underline mb-2 cursor-pointer"
            id="search-back-btn"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Clear Search & Back to Feed</span>
          </button>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-extrabold text-neutral-900 flex items-center space-x-2">
              <Search className="w-5 h-5 text-[#6001d2]" />
              <span>Search results for "{query}"</span>
            </h2>
            {hitKeyword && (
              <span className="text-[11px] bg-purple-100 text-[#6001d2] font-extrabold px-3 py-1 rounded-full border border-purple-200">
                Keyword Hit: #{hitKeyword}
              </span>
            )}
          </div>
        </div>
        <span className="text-xs text-neutral-400 font-mono">
          Found {results.length} matching stories
        </span>
      </div>

      {/* Results Stream */}
      {results.length === 0 ? (
        <div className="py-12 px-6 text-center bg-white rounded-3xl border border-neutral-200 shadow-sm" id="search-no-results">
          <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-4 text-[#6001d2]">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-neutral-800">
            No matching articles found
          </h3>
          <p className="text-xs text-neutral-500 mt-2 max-w-md mx-auto leading-relaxed">
            We couldn't find any articles that match your search query. Please double-check spelling or search for standard portal topics.
          </p>

          <div className="mt-6 pt-4 border-t border-neutral-100 max-w-md mx-auto">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-3">
              Recommended Search Keys
            </span>
            <div className="flex flex-wrap justify-center gap-1.5">
              {recommendations.map((rec) => (
                <button
                  key={rec}
                  onClick={() => onSearchKeyClick(rec)}
                  className="bg-neutral-50 hover:border-purple-300 hover:text-[#6001d2] text-neutral-600 text-xs px-3 py-1.5 rounded-xl border border-neutral-200 font-mono transition-all cursor-pointer"
                  id={`rec-search-${rec}`}
                >
                  #{rec}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4" id="search-items-list">
          {results.map((art) => (
            <div
              key={art.id}
              onClick={() => onSelectArticle(art.id)}
              className="bento-item p-4 flex flex-col sm:flex-row gap-4 items-start text-left group cursor-pointer"
              id={`search-card-${art.id}`}
            >
              <div className="w-full sm:w-1/4 aspect-[16/10] sm:aspect-square rounded-2xl bg-neutral-100 overflow-hidden flex-shrink-0">
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between h-full space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] font-extrabold text-[#6001d2] uppercase tracking-widest">
                      {art.category}
                    </span>
                    <span className="text-neutral-300">•</span>
                    <span className="text-xs text-neutral-550 font-semibold">{art.source}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-neutral-800 leading-snug group-hover:text-[#6001d2] transition-colors">
                    {art.title}
                  </h3>
                  <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                    {art.summary}
                  </p>
                </div>

                 {/* Keyword Highlights match */}
                <div className="flex items-center space-x-1 pt-1">
                  <CornerDownRight className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-[10px] text-neutral-400 font-semibold uppercase mr-1">Matches:</span>
                  <div className="flex flex-wrap gap-1">
                    {art.keys.map((k) => {
                      const lowerQuery = query.toLowerCase();
                      const lowerHit = hitKeyword ? hitKeyword.toLowerCase() : "";
                      const isMatch = 
                        k.toLowerCase().includes(lowerQuery) || 
                        art.title.toLowerCase().includes(lowerQuery) ||
                        (lowerHit && (k.toLowerCase().includes(lowerHit) || art.title.toLowerCase().includes(lowerHit)));
                      return (
                        <span
                          key={k}
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                            isMatch
                              ? "bg-purple-100 text-[#6001d2] font-bold border border-purple-200"
                              : "bg-neutral-50 text-neutral-400"
                          }`}
                        >
                          {k}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-2 border-t border-neutral-100 mt-1">
                  <span className="flex items-center space-x-1.5">
                    <Calendar className="w-3 h-3" />
                    <span>{art.date}</span>
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="flex items-center space-x-1">
                      <ThumbsUp className="w-3 h-3 text-[#6001d2]" />
                      <span>{art.likes}</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-[#6001d2] transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
