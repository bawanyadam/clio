"use client";

import { useState } from "react";
import SearchInput from "@/components/SearchInput";

export default function Home() {
  const [query, setQuery] = useState("");

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
        
        <SearchInput value={query} onChange={setQuery} />

        {/* Results Container Placeholder */}
        <div className="w-full flex flex-col gap-4">
          {/* We'll add result cards here in the next task */}
        </div>
      </main>
    </div>
  );
}
