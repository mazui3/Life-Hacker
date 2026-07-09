import React, { useState } from "react";
import { ArrowLeft, Bookmark, Clock, User, ArrowRight } from "lucide-react";
import { Article } from "../types";

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
  relatedArticles: Article[];
  onSelectArticle: (id: string) => void;
}

export default function ArticleDetail({
  article,
  onBack,
  relatedArticles,
  onSelectArticle,
}: ArticleDetailProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 font-sans text-left" id={`article-detail-${article.id}`}>
      {/* Back button and quick actions */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#6001d2] hover:text-[#5001bd] transition-colors group cursor-pointer"
          id="detail-back-home-btn"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Home Feed</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-all cursor-pointer ${
              isBookmarked ? "bg-amber-50 text-amber-500 border-amber-200" : "text-neutral-400 bg-white"
            }`}
            title={isBookmarked ? "Saved" : "Save for later"}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>

      {/* Main Column */}
      <article className="space-y-6">
        {/* Category, Read Time & Source */}
        <div className="flex items-center space-x-2.5">
          <span className="bg-purple-100 text-[#6001d2] text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest font-sans">
            {article.category}
          </span>
          <span className="text-neutral-300 font-bold">•</span>
          <div className="flex items-center text-xs text-neutral-550 space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-mono">{article.readTime}</span>
          </div>
          <span className="text-neutral-300 font-bold">•</span>
          <span className="text-xs text-neutral-500 font-semibold">{article.source}</span>
        </div>

        {/* Big Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 leading-tight tracking-tight font-sans">
          {article.title}
        </h1>

        {/* Author details / Date row */}
        <div className="flex items-center space-x-3 py-4 border-y border-neutral-200">
          <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 shadow-inner">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-800">Written by {article.author}</p>
            <p className="text-xs text-neutral-550">Published {article.date} • Verified News Partner</p>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative overflow-hidden rounded-3xl bg-neutral-100 aspect-[16/9] shadow-md border border-neutral-200">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Article Body Content */}
        <div className="prose max-w-none text-neutral-850 space-y-5 leading-relaxed text-base md:text-lg font-normal">
          {article.content.map((para, idx) => (
            <p key={idx} className="indent-0" id={`para-${idx}`}>
              {para}
            </p>
          ))}
        </div>

        {/* Keywords / Tags list */}
        <div className="pt-4 flex flex-wrap gap-2" id="article-keywords-bar">
          <span className="text-xs font-bold text-neutral-400 uppercase flex items-center mr-1">
            Keywords:
          </span>
          {article.keys.map((key) => (
            <span
              key={key}
              className="bg-neutral-55 border border-neutral-200 text-neutral-600 text-xs px-2.5 py-1 rounded-xl font-mono cursor-pointer hover:border-purple-300 hover:text-[#6001d2] transition-colors"
              id={`keyword-tag-${key}`}
            >
              #{key}
            </span>
          ))}
        </div>
        {/* Related Articles Recommended */}
        {relatedArticles.length > 0 && (
          <div className="pt-8 border-t border-neutral-200 mt-8">
            <h3 className="text-lg font-extrabold text-neutral-900 mb-4">
              Recommended Stories for You
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="related-articles-grid">
              {relatedArticles.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectArticle(rel.id)}
                  className="bento-item flex flex-col h-full group cursor-pointer"
                  id={`related-card-${rel.id}`}
                >
                  <div className="aspect-[16/9] relative bg-neutral-100 overflow-hidden">
                    <img
                      src={rel.imageUrl}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-1 text-left space-y-2">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-[#6001d2] uppercase tracking-widest">{rel.category}</span>
                      <h4 className="text-sm font-bold text-neutral-800 leading-snug group-hover:text-[#6001d2] transition-colors line-clamp-2">
                        {rel.title}
                      </h4>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-neutral-400">
                      <span>{rel.source}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-[#6001d2] transition-colors" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
