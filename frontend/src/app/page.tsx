export default function Home() {
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
        
        {/* Placeholder for Search Input */}
        <div className="w-full">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full p-4 pl-10 text-sm text-zinc-900 border border-zinc-200 rounded-xl bg-white focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-50 dark:focus:ring-zinc-800"
              placeholder="Search conversations..."
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-zinc-400 bg-zinc-100 border border-zinc-200 rounded dark:bg-zinc-800 dark:border-zinc-700">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Results Container Placeholder */}
        <div className="w-full flex flex-col gap-4">
          {/* We'll add result cards here in the next task */}
        </div>
      </main>
    </div>
  );
}