"use client";

import { useState, useEffect } from "react";
import SearchInput from "@/components/SearchInput";
import ConversationCard from "@/components/ConversationCard";
import ConversationDetail from "@/components/ConversationDetail";
import FilterPopover from "@/components/FilterPopover";

const RESULTS_PER_PAGE = 25;
const THEME_STORAGE_KEY = "clio-theme-mode";

type ThemeMode = "light" | "dark" | "system";

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

function isThemeMode(value: string): value is ThemeMode {
  return value === "light" || value === "dark" || value === "system";
}

function applyThemeToDocument(mode: ThemeMode) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const shouldUseDark = mode === "dark" || (mode === "system" && prefersDark);
  document.documentElement.classList.toggle("dark", shouldUseDark);
  document.documentElement.style.colorScheme = shouldUseDark ? "dark" : "light";
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
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");

  // Fetch stats on mount
  useEffect(() => {
    fetch("http://localhost:8000/archive/stats")
      .then(res => res.json())
      .then(setStats)
      .catch(err => console.error("Error fetching stats:", err));
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme && isThemeMode(storedTheme)) {
      setThemeMode(storedTheme);
      applyThemeToDocument(storedTheme);
      return;
    }
    applyThemeToDocument("system");
  }, []);

  useEffect(() => {
    applyThemeToDocument(themeMode);
    localStorage.setItem(THEME_STORAGE_KEY, themeMode);
  }, [themeMode]);

  useEffect(() => {
    if (themeMode !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyThemeToDocument("system");

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [themeMode]);

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
  const themeButtonClass = (mode: ThemeMode) =>
    `flex h-8 w-8 items-center justify-center rounded-lg border transition-all ${
      themeMode === mode
        ? "bg-zinc-100 border-zinc-300 text-zinc-900 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-50"
        : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700"
    }`;

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <main className="flex w-full max-w-2xl flex-col items-center gap-8 py-20 px-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            clio
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
          <div className="flex justify-between items-center px-1 mb-2">
            <div className="flex items-baseline gap-2">
              <h2 className="text-xs font-bold uppercase tracking-tighter text-zinc-400">
                {isFiltered ? "Filtered Results" : "All Conversations"}
              </h2>
              {isFiltered && !isLoading && (
                <span className="text-[10px] text-zinc-400 font-medium">
                  {results.length} found
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setThemeMode("light")}
                className={themeButtonClass("light")}
                aria-label="Use light theme"
                title="Light"
                type="button"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364 6.364l-1.414-1.414M7.05 7.05 5.636 5.636m12.728 0L16.95 7.05M7.05 16.95l-1.414 1.414M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
                </svg>
              </button>
              <button
                onClick={() => setThemeMode("dark")}
                className={themeButtonClass("dark")}
                aria-label="Use dark theme"
                title="Dark"
                type="button"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12.79A9 9 0 1 1 11.21 3c-.19.6-.29 1.24-.29 1.9A7.9 7.9 0 0 0 18.1 13c.66 0 1.3-.1 1.9-.29Z" />
                </svg>
              </button>
              <button
                onClick={() => setThemeMode("system")}
                className={themeButtonClass("system")}
                aria-label="Use system theme"
                title="System"
                type="button"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v8A2.5 2.5 0 0 1 18.5 16h-5v2h2.5a1 1 0 1 1 0 2h-8a1 1 0 1 1 0-2h2.5v-2h-5A2.5 2.5 0 0 1 3 13.5v-8Z" />
                </svg>
              </button>
              <FilterPopover 
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={(v) => { setStartDate(v); setOffset(0); }}
                onEndDateChange={(v) => { setEndDate(v); setOffset(0); }}
                onClear={() => { setStartDate(""); setEndDate(""); setOffset(0); }}
              />
            </div>
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
                  defaultExpanded={!!query}
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

      <footer className="w-full pt-0 pb-4 text-center text-[10px] lowercase tracking-[0.2em] text-zinc-400">
        {"\u00A9"} {new Date().getFullYear()} adam goehrig-bawany
      </footer>

      {/* Detail View Overlay */}
      {selectedConversation && (
        <ConversationDetail 
          conversation={selectedConversation as any} 
          targetMessageUuid={targetMessageUuid}
          query={query}
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
