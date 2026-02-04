"use client";

interface ConversationCardProps {
  name: string;
  summary: string;
  created_at: string;
  onClick: () => void;
}

export default function ConversationCard({ name, summary, created_at, onClick }: ConversationCardProps) {
  const formattedDate = new Date(created_at).toLocaleDateString();

  return (
    <div 
      onClick={onClick}
      className="w-full p-5 bg-white border border-zinc-200 rounded-xl hover:border-zinc-400 hover:shadow-md transition-all cursor-pointer dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{name || "Unnamed Conversation"}</h3>
        <span className="text-xs text-zinc-400 font-mono">{formattedDate}</span>
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
        {summary || "No summary available."}
      </p>
    </div>
  );
}
