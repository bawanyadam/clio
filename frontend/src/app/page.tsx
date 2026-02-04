"use client";

import { useState, useEffect } from "react";
import SearchInput from "@/components/SearchInput";
import ConversationCard from "@/components/ConversationCard";
import ConversationDetail from "@/components/ConversationDetail";

interface Message {
  uuid: string;
  text: string;
  sender: string;
  created_at: string;
}

interface Conversation {
  uuid: string;
  name: string;
  summary: string;
  created_at: string;
  chat_messages?: Message[];
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

  const handleSelectConversation = async (uuid: string) => {
    setIsFetchingDetail(true);
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
          <SearchInput value={query} onChange={setQuery} />
          
          <div className="flex gap-4 items-center justify-center text-sm">
            <div className="flex items-center gap-2">
              <label className="text-zinc-400">From</label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white border border-zinc-200 rounded-lg px-2 py-1 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-50 outline-none focus:border-zinc-400 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-zinc-400">To</label>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white border border-zinc-200 rounded-lg px-2 py-1 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-50 outline-none focus:border-zinc-400 transition-colors"
              />
            </div>
            {(startDate || endDate || query) && (
              <button 
                onClick={() => { setQuery(""); setStartDate(""); setEndDate(""); }}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 ml-2 font-medium"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="w-full flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {isLoading && (
            <div className="text-center py-10 text-zinc-400 animate-pulse">
              Searching...
            </div>
          )}
          {!isLoading && results.length === 0 && (
            <div className="text-center py-10 text-zinc-400 animate-in fade-in duration-700">
              No results found.
            </div>
          )}
          {!isLoading && results.map((result, index) => (
            <div key={result.uuid} className="animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${index * 50}ms` }}>
              <ConversationCard 
                {...result}
                onClick={() => handleSelectConversation(result.uuid)}
              />
            </div>
          ))}
        </div>
      </main>

      {/* Detail View Overlay */}
      {selectedConversation && (
        <ConversationDetail 
          conversation={selectedConversation as any} 
          onClose={() => setSelectedConversation(null)} 
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