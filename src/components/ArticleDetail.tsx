import React, { useState } from "react";
import { ArrowLeft, Bookmark, Clock, User, ArrowRight, MessageSquare, Send } from "lucide-react";
import { Article, Comment } from "../types";

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
  const [commentsList, setCommentsList] = useState<Comment[]>(article.comments || []);
  const [newCommentText, setNewCommentText] = useState("");

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    // Ensure comment timestamp is >= article.date
    const now = new Date();
    const nowIsoDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const nowHoursMins = now.toTimeString().slice(0, 5); // HH:mm
    
    let commentDate = `${nowIsoDate} ${nowHoursMins}`;
    if (article.date && nowIsoDate < article.date) {
      // If the article is set in a future date (e.g., 2050), match or exceed article date
      commentDate = `${article.date} ${nowHoursMins}`;
    }

    const newCommentObj: Comment = {
      id: `c_${Date.now()}`,
      user: "Sandbox Reader",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
      text: newCommentText.trim(),
      time: commentDate,
    };

    setCommentsList([newCommentObj, ...commentsList]);
    setNewCommentText("");
  };

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

        {/* Comments Section */}
        <div className="pt-8 border-t border-neutral-200 mt-8 space-y-6" id="article-comments-section">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-neutral-900 flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-[#6001d2]" />
              <span>Reader Comments ({commentsList.length})</span>
            </h3>
            <span className="text-xs text-neutral-400 font-mono">
              Article Date: {article.date}
            </span>
          </div>

          {/* Comment Form */}
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              placeholder="Share your thoughts on this story..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-neutral-900 focus:outline-hidden focus:border-[#6001d2] focus:ring-1 focus:ring-[#6001d2] transition-all"
            />
            <button
              type="submit"
              disabled={!newCommentText.trim()}
              className="bg-[#6001d2] hover:bg-[#5001bd] disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs"
            >
              <span>Post</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-3">
            {commentsList.length === 0 ? (
              <p className="text-xs text-neutral-400 italic py-2">No comments yet. Be the first to comment!</p>
            ) : (
              commentsList.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 bg-neutral-50/70 rounded-2xl border border-neutral-100 space-y-1.5 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img
                        src={comment.avatar}
                        alt={comment.user}
                        className="w-6 h-6 rounded-full object-cover border border-neutral-200"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-xs font-bold text-neutral-800">{comment.user}</span>
                    </div>
                    <span className="text-[11px] font-mono text-neutral-400">
                      {comment.time}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-700 leading-relaxed pl-8">
                    {comment.text}
                  </p>
                </div>
              ))
            )}
          </div>
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
