"use client";

import { useState, useEffect } from "react";
import SearchInput from "@/components/SearchInput";
import ConversationCard from "@/components/ConversationCard";
import ConversationDetail from "@/components/ConversationDetail";
import FilterPopover from "@/components/FilterPopover";

interface Message {
  uuid: string;
  text: string;
  sender: string;
  created_at: string;
}

interface Match {
  message_uuid: string;
  text: string;
  context: string;
  created_at: string;
}

interface Conversation {
  uuid: string;
  name: string;
  summary: string;
  created_at: string;
  chat_messages?: Message[];
  matches?: Match[];
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isFetchingDetail, setIsFetchingDetail] = useState(false);
  const [targetMessageUuid, setTargetMessageUuid] = useState<string | null>(null);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Fetch logic for search
  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery && !startDate && !endDate) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const url = new URL("http://localhost:8000/search");
        if (debouncedQuery) url.searchParams.append("query", debouncedQuery);
        if (startDate) url.searchParams.append("start", startDate);
        if (endDate) url.searchParams.append("end", endDate);
        
        const response = await fetch(url.toString());
        if (!response.ok) throw new Error("Search failed");
        
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery, startDate, endDate]);

  const handleSelectConversation = async (uuid: string, messageUuid: string | null = null) => {
    setIsFetchingDetail(true);
    setTargetMessageUuid(messageUuid);
    try {
      const response = await fetch(`http://localhost:8000/conversations/${uuid}`);
      if (!response.ok) throw new Error("Failed to fetch conversation details");
      
      const data = await response.json();
      setSelectedConversation(data);
    } catch (error) {
      console.error("Error fetching conversation details:", error);
    } finally {
      setIsFetchingDetail(false);
    }
  };

  const clearAllFilters = () => {
    setQuery("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 dark:bg-zinc-950">
      <main className="flex w-full max-w-2xl flex-col items-center gap-8 py-20 px-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            ClaudeJSON Search
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            A minimalist interface for your conversation archive.
          </p>
        </div>
        
        <div className="w-full space-y-4">
          <div className="flex gap-2 items-center">
            <SearchInput value={query} onChange={setQuery} />
            <FilterPopover 
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onClear={() => { setStartDate(""); setEndDate(""); }}
            />
          </div>
          
          {(query || startDate || endDate) && (
            <div className="flex justify-center">
              <button 
                onClick={clearAllFilters}
                className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear all active searches
              </button>
            </div>
          )}
        </div>

        <div className="w-full flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {isLoading && (
            <div className="text-center py-10 text-zinc-400 animate-pulse">
              Searching...
            </div>
          )}
          
          {!isLoading && results.length === 0 && (query || startDate || endDate) && (
            <div className="text-center py-10 text-zinc-400 animate-in fade-in duration-700">
              No results found.
            </div>
          )}

          {!isLoading && !query && !startDate && !endDate && (
            <div className="text-center py-20 text-zinc-300 dark:text-zinc-700 italic border-2 border-dashed border-zinc-100 dark:border-zinc-900 rounded-3xl">
              Type to begin searching your archive
            </div>
          )}

          {!isLoading && results.map((result, index) => (
            <div key={result.uuid} className="animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${index * 50}ms` }}>
              <ConversationCard 
                {...result}
                onClick={() => handleSelectConversation(result.uuid)}
                onMatchClick={(msgUuid) => handleSelectConversation(result.uuid, msgUuid)}
              />
            </div>
          ))}
        </div>
      </main>

      {/* Detail View Overlay */}
      {selectedConversation && (
        <ConversationDetail 
          conversation={selectedConversation as any} 
          targetMessageUuid={targetMessageUuid}
          onClose={() => {
            setSelectedConversation(null);
            setTargetMessageUuid(null);
          }} 
        />
      )}

      {/* Global Loading for details */}
      {isFetchingDetail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/50 backdrop-blur-[1px] dark:bg-black/50">
          <div className="w-10 h-10 border-2 border-zinc-200 border-t-zinc-800 rounded-full animate-spin dark:border-zinc-800 dark:border-t-zinc-200" />
        </div>
      )}
    </div>
  );
}