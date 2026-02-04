"use client";

import { useState, useEffect, MouseEvent } from "react";

interface Match {
  message_uuid: string;
  text: string;
  context: string;
  created_at: string;
}

interface ConversationCardProps {
  uuid: string;
  name: string;
  summary: string;
  created_at: string;
  matches?: Match[];
  defaultExpanded?: boolean;
  onClick: () => void;
  onMatchClick?: (messageUuid: string) => void;
}

export default function ConversationCard({ 
  uuid, 
  name, 
  summary, 
  created_at, 
  matches = [], 
  defaultExpanded = false,
  onClick,
  onMatchClick
}: ConversationCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const formattedDate = new Date(created_at).toLocaleDateString();

  useEffect(() => {
    setIsExpanded(defaultExpanded);
  }, [defaultExpanded]);

  const handleCopy = (e: MouseEvent, text: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
  };

  const handleToggleExpand = (e: MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleMatchClick = (e: MouseEvent, messageUuid: string) => {
    e.stopPropagation();
    if (onMatchClick) onMatchClick(messageUuid);
  };

  return (
    <div 
      onClick={onClick}
      className="group w-full bg-white border border-zinc-200 rounded-xl hover:border-zinc-400 hover:shadow-md transition-all cursor-pointer dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700 overflow-hidden"
    >
      <div className="p-5">
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
        
        <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed pr-8 mb-3">
          {summary || "No summary available."}
        </p>

        {matches.length > 0 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-50 dark:border-zinc-800">
            <button 
              onClick={handleToggleExpand}
              className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors flex items-center gap-1.5"
            >
              <svg className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
              </svg>
              {matches.length} {matches.length === 1 ? 'Match' : 'Matches'}
            </button>
            
            <span className="text-[10px] text-zinc-300 dark:text-zinc-700 font-medium italic">
              Click card to view full chat
            </span>
          </div>
        )}
      </div>

      {isExpanded && matches.length > 0 && (
        <div className="bg-zinc-50 dark:bg-zinc-950/50 border-t border-zinc-100 dark:border-zinc-800 px-5 py-3 space-y-2 animate-in slide-in-from-top-2 duration-200">
          {matches.map((match, idx) => (
            <div 
              key={`${match.message_uuid}-${idx}`}
              onClick={(e) => handleMatchClick(e, match.message_uuid)}
              className="p-3 bg-white border border-zinc-100 rounded-lg hover:border-zinc-300 hover:shadow-sm transition-all dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700"
            >
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-mono">
                {match.context}
              </p>
              <div className="mt-2 flex justify-end">
                <span className="text-[9px] text-zinc-400 uppercase tracking-tighter font-bold">Jump to message →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}