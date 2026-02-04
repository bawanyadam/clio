"use client";

import { MouseEvent } from "react";

interface ConversationCardProps {
  uuid: string;
  name: string;
  summary: string;
  created_at: string;
  onClick: () => void;
}

export default function ConversationCard({ uuid, name, summary, created_at, onClick }: ConversationCardProps) {
  const formattedDate = new Date(created_at).toLocaleDateString();

  const handleCopy = (e: MouseEvent, text: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    // Simple visual feedback could be added here
  };

  return (
    <div 
      onClick={onClick}
      className="group w-full p-5 bg-white border border-zinc-200 rounded-xl hover:border-zinc-400 hover:shadow-md transition-all cursor-pointer dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700 relative"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{name || "Unnamed Conversation"}</h3>
        <div className="flex items-center gap-3">
          <button 
            onClick={(e) => handleCopy(e, uuid)}
            title="Copy UUID"
            className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
          </button>
          <span className="text-xs text-zinc-400 font-mono">{formattedDate}</span>
        </div>
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed pr-8">
        {summary || "No summary available."}
      </p>
    </div>
  );
}