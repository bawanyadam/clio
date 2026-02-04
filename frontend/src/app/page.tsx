"use client";

import { useState, useEffect } from "react";
import SearchInput from "@/components/SearchInput";
import ConversationCard from "@/components/ConversationCard";
import ConversationDetail from "@/components/ConversationDetail";
import FilterPopover from "@/components/FilterPopover";

const RESULTS_PER_PAGE = 25;

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

interface ArchiveStats {
  total_count: number;
  start_date: string;
  end_date: string;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  
  const [results, setResults] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAppending, setIsFetchingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const [stats, setStats] = useState<ArchiveStats | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isFetchingDetail, setIsFetchingDetail] = useState(false);
  const [targetMessageUuid, setTargetMessageUuid] = useState<string | null>(null);

  // Fetch stats on mount
  useEffect(() => {
    fetch("http://localhost:8000/archive/stats")
      .then(res => res.json())
      .then(setStats)
      .catch(err => console.error("Error fetching stats:", err));
  }, []);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setOffset(0); // Reset pagination on new search
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Fetch logic
  useEffect(() => {
    const fetchResults = async (currentOffset: number, append: boolean = false) => {
      if (append) setIsFetchingMore(true);
      else setIsLoading(true);

      try {
        const url = new URL("http://localhost:8000/search");
        if (debouncedQuery) url.searchParams.append("query", debouncedQuery);
        if (startDate) url.searchParams.append("start", startDate);
        if (endDate) url.searchParams.append("end", endDate);
        url.searchParams.append("limit", RESULTS_PER_PAGE.toString());
        url.searchParams.append("offset", currentOffset.toString());
        
        const response = await fetch(url.toString());
        if (!response.ok) throw new Error("Search failed");
        
        const data = await response.json();
        
        if (append) {
          setResults(prev => [...prev, ...data]);
        } else {
          setResults(data);
        }
        
        setHasMore(data.length === RESULTS_PER_PAGE);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setIsLoading(false);
        setIsFetchingMore(false);
      }
    };

    fetchResults(offset, offset > 0);
  }, [debouncedQuery, startDate, endDate, offset]);

  const loadMore = () => {
    if (!isLoading && !isAppending && hasMore) {
      setOffset(prev => prev + RESULTS_PER_PAGE);
    }
  };

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
    setOffset(0);
  };

  const isFiltered = query || startDate || endDate;

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <main className="flex w-full max-w-2xl flex-col items-center gap-8 py-20 px-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            ClaudeJSON Search
          </h1>
          {stats && (
            <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest mt-2">
              {stats.total_count} Conversations • {new Date(stats.start_date).getFullYear()} - {new Date(stats.end_date).getFullYear()}
            </p>
          )}
        </div>
        
        <div className="w-full space-y-4">
          <div className="flex gap-2 items-center">
            <SearchInput value={query} onChange={setQuery} />
            <FilterPopover 
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={(v) => { setStartDate(v); setOffset(0); }}
              onEndDateChange={(v) => { setEndDate(v); setOffset(0); }}
              onClear={() => { setStartDate(""); setEndDate(""); setOffset(0); }}
            />
          </div>
          
          {isFiltered && (
            <div className="flex justify-center">
              <button 
                onClick={clearAllFilters}
                className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors flex items-center gap-1 font-medium"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear filters and show all
              </button>
            </div>
          )}
        </div>

        <div className="w-full flex flex-col gap-4">
          <div className="flex justify-between items-end px-1">
            <h2 className="text-xs font-bold uppercase tracking-tighter text-zinc-400">
              {isFiltered ? "Filtered Results" : "All Conversations"}
            </h2>
            {isFiltered && !isLoading && (
              <span className="text-[10px] text-zinc-400 font-medium">
                {results.length} found
              </span>
            )}
          </div>

          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {isLoading && offset === 0 && (
              <div className="text-center py-10 text-zinc-400 animate-pulse">
                Loading archive...
              </div>
            )}
            
            {!isLoading && results.length === 0 && isFiltered && (
              <div className="text-center py-10 text-zinc-400 animate-in fade-in duration-700">
                No results found matching your criteria.
              </div>
            )}

            {results.map((result, index) => (
              <div key={result.uuid} className="animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${(index % RESULTS_PER_PAGE) * 30}ms` }}>
                <ConversationCard 
                  {...result}
                  onClick={() => handleSelectConversation(result.uuid)}
                  onMatchClick={(msgUuid) => handleSelectConversation(result.uuid, msgUuid)}
                />
              </div>
            ))}

            {hasMore && (
              <div className="py-8 flex justify-center">
                <button 
                  onClick={loadMore}
                  disabled={isAppending}
                  className="px-6 py-2 text-xs font-bold uppercase tracking-widest text-zinc-400 border border-zinc-200 rounded-full hover:bg-zinc-100 hover:text-zinc-600 dark:border-zinc-800 dark:hover:bg-zinc-900 transition-all disabled:opacity-50"
                >
                  {isAppending ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </div>
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
