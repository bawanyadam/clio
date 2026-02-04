"use client";

import { useRef, useEffect } from "react";

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
  chat_messages: Message[];
}

interface ConversationDetailProps {

  conversation: Conversation;

  targetMessageUuid?: string | null;

  query?: string;

  onClose: () => void;

}



export default function ConversationDetail({ conversation, targetMessageUuid, query, onClose }: ConversationDetailProps) {

  const messageRefs = useRef<Record<string, HTMLDivElement | null>>({});



  useEffect(() => {

    if (targetMessageUuid && messageRefs.current[targetMessageUuid]) {

      // Add a small delay to ensure the modal animation has started

      const timer = setTimeout(() => {

        messageRefs.current[targetMessageUuid]?.scrollIntoView({

          behavior: "smooth",

          block: "center",

        });

      }, 100);

      return () => clearTimeout(timer);

    }

  }, [targetMessageUuid, conversation]);



  const highlightText = (text: string, highlight: string) => {

    if (!highlight.trim()) return text;

    

    const parts = text.split(new RegExp(`(${highlight})`, "gi"));

    return (

      <>

        {parts.map((part, i) => 

          part.toLowerCase() === highlight.toLowerCase() ? (

            <mark key={i} className="bg-yellow-200 dark:bg-yellow-500/30 text-inherit px-0.5 rounded-sm">

              {part}

            </mark>

          ) : (

            part

          )

        )}

      </>

    );

  };



  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/20 backdrop-blur-sm dark:bg-black/40 animate-in fade-in duration-300">

      <div className="w-full max-w-3xl max-h-[80vh] flex flex-col bg-white border border-zinc-200 rounded-2xl shadow-2xl overflow-hidden dark:bg-zinc-900 dark:border-zinc-800 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">

        <div className="flex justify-between items-center p-6 border-b border-zinc-100 dark:border-zinc-800">

          <div>

            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{conversation.name || "Unnamed"}</h2>

            <p className="text-xs text-zinc-400 font-mono mt-1">{new Date(conversation.created_at).toLocaleString()}</p>

          </div>

          <button 

            onClick={onClose}

            className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full transition-all dark:hover:bg-zinc-800"

          >

            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">

              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />

            </svg>

          </button>

        </div>

        

        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100 dark:bg-zinc-950/50 dark:border-zinc-800 relative group">

            <div className="flex justify-between items-start mb-2">

              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Summary</h3>

              <button 

                onClick={() => navigator.clipboard.writeText(conversation.summary)}

                title="Copy Summary"

                className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-all"

              >

                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />

                </svg>

              </button>

            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">

              {query ? highlightText(conversation.summary, query) : conversation.summary}

            </p>

          </div>



          <div className="space-y-4">

            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Messages</h3>

            {conversation.chat_messages?.map((msg) => (

              <div 

                key={msg.uuid} 

                ref={(el) => { messageRefs.current[msg.uuid] = el; }}

                className={`flex flex-col ${msg.sender === 'human' ? 'items-end' : 'items-start'}`}

              >

                <div className={`max-w-[85%] p-4 rounded-2xl text-sm transition-all duration-1000 ${

                  msg.sender === 'human' 

                    ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950' 

                    : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200'

                } ${targetMessageUuid === msg.uuid ? 'ring-2 ring-zinc-400/20 dark:ring-zinc-500/20' : ''}`}>

                  <p className="whitespace-pre-wrap leading-relaxed">

                    {query ? highlightText(msg.text, query) : msg.text}

                  </p>

                </div>

                <span className="text-[10px] text-zinc-400 mt-1 px-2">

                  {msg.sender === 'human' ? 'You' : 'Assistant'} • {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}

                </span>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  );

}
