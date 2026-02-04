"use client";

import { useState } from "react";
import SearchInput from "@/components/SearchInput";
import ConversationCard from "@/components/ConversationCard";

// Mock data for initial UI development
const MOCK_RESULTS = [
  {
    uuid: "1",
    name: "Higher dimensions in Three-Body Problem",
    summary: "Discussion about sophons and higher-dimensional weapons in Cixin Liu's series.",
    created_at: "2026-02-02T23:42:03Z",
  },
  {
    uuid: "2",
    name: "Delaware C Corp tax filing",
    summary: "Guidance on tax requirements for startups with no revenue.",
    created_at: "2026-01-31T19:30:00Z",
  }
];

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

        <div className="w-full flex flex-col gap-4">
          {MOCK_RESULTS.map((result) => (
            <ConversationCard 
              key={result.uuid}
              {...result}
              onClick={() => console.log("Clicked:", result.uuid)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}