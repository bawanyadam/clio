"use client";

import { useState, useRef, useEffect } from "react";

interface FilterPopoverProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onClear: () => void;
}

export default function FilterPopover({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange,
  onClear
}: FilterPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const hasActiveFilters = startDate || endDate;

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
          isOpen || hasActiveFilters
            ? "bg-zinc-100 border-zinc-300 text-zinc-900 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-50"
            : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700"
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h18a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filter
        {hasActiveFilters && (
          <span className="flex h-2 w-2 rounded-full bg-zinc-900 dark:bg-zinc-50 ml-0.5" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 p-4 bg-white border border-zinc-200 rounded-xl shadow-xl z-10 dark:bg-zinc-900 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-200">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Date Range</label>
              <div className="space-y-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-400 ml-1">From</span>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => onStartDateChange(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-lg px-2 py-1.5 text-sm dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-50 outline-none focus:border-zinc-300 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-400 ml-1">To</span>
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => onEndDateChange(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-lg px-2 py-1.5 text-sm dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-50 outline-none focus:border-zinc-300 transition-colors"
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-2 flex justify-between items-center border-t border-zinc-50 dark:border-zinc-800">
              <button 
                onClick={onClear}
                className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
              >
                Reset all
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 bg-zinc-900 text-white text-xs font-medium rounded-lg hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
