#!/usr/bin/env python3
import json
import os
import argparse
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any

def parse_args():
    """Parse CLI arguments."""
    parser = argparse.ArgumentParser(description="Search through conversations.json")
    parser.add_argument("--query", "-q", help="Keyword to search for")
    parser.add_argument("--start", help="Start date (YYYY-MM-DD)")
    parser.add_argument("--end", help="End date (YYYY-MM-DD)")
    parser.add_argument("--file", default="conversations.json", help="Path to conversations.json")
    return parser.parse_args()

def load_conversations(file_path: str) -> List[Dict[str, Any]]:
    """Load conversations from a JSON file."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def search_keyword(data: List[Dict[str, Any]], query: str) -> List[Dict[str, Any]]:
    """Search for a keyword in conversation names, summaries, and messages."""
    query = query.lower()
    results = []
    
    for conv in data:
        # Check name
        if query in conv.get("name", "").lower():
            results.append(conv)
            continue
            
        # Check summary
        if query in conv.get("summary", "").lower():
            results.append(conv)
            continue
            
        # Check messages
        found_in_messages = False
        for msg in conv.get("chat_messages", []):
            if query in msg.get("text", "").lower():
                found_in_messages = True
                break
        
        if found_in_messages:
            results.append(conv)
            
    return results

def get_snippet(text: str, query: str, context_chars: int = 40) -> str:
    """Create a snippet of text around the query."""
    lower_text = text.lower()
    start_idx = lower_text.find(query.lower())
    if start_idx == -1:
        return text[:context_chars * 2] + "..."
    
    snippet_start = max(0, start_idx - context_chars)
    snippet_end = min(len(text), start_idx + len(query) + context_chars)
    
    prefix = "..." if snippet_start > 0 else ""
    suffix = "..." if snippet_end < len(text) else ""
    
    return prefix + text[snippet_start:snippet_end] + suffix

def search_keyword_enhanced(data: List[Dict[str, Any]], query: str) -> List[Dict[str, Any]]:
    """
    Search for a keyword and return results grouped by conversation,
    including specific message matches and snippets.
    """
    query_lower = query.lower()
    results = []
    
    for conv in data:
        matches = []
        
        # Check messages for occurrences
        for msg in conv.get("chat_messages", []):
            text = msg.get("text", "")
            if query_lower in text.lower():
                matches.append({
                    "message_uuid": msg.get("uuid"),
                    "text": text,
                    "context": get_snippet(text, query),
                    "created_at": msg.get("created_at")
                })
        
        # If matches found in messages, or if the keyword is in the title/summary
        # (even if no specific message matches, though usually there will be)
        if matches or query_lower in conv.get("name", "").lower() or query_lower in conv.get("summary", "").lower():
            # Add conversation data plus matches
            result_conv = conv.copy()
            # Remove chat_messages from results to keep it lean? 
            # Actually, the API might need them, but for the search result list, matches are enough.
            # But the spec says "Update the /search endpoint to return specific message UUIDs and context snippets"
            # We'll include 'matches' field.
            result_conv["matches"] = matches
            results.append(result_conv)
            
    return results

def get_conversation_by_uuid(data: List[Dict[str, Any]], uuid: str) -> Optional[Dict[str, Any]]:
    """Retrieve a single conversation by its UUID."""
    for conv in data:
        if conv.get("uuid") == uuid:
            return conv
    return None

def parse_date(date_str: Optional[str]) -> Optional[datetime]:
    """Parse a date string into a datetime object."""
    if not date_str:
        return None
    try:
        # Support YYYY-MM-DD
        if len(date_str) == 10:
            return datetime.strptime(date_str, "%Y-%m-%d").replace(tzinfo=timezone.utc)
        # Support ISO format from JSON
        return datetime.fromisoformat(date_str.replace('Z', '+00:00'))
    except ValueError:
        return None

def filter_by_date(data: List[Dict[str, Any]], start_date: Optional[str] = None, end_date: Optional[str] = None) -> List[Dict[str, Any]]:
    """Filter conversations by date range."""
    start = parse_date(start_date)
    # If end_date is YYYY-MM-DD, make it end of day
    end = parse_date(end_date)
    if end and end_date and len(end_date) == 10:
        end = end.replace(hour=23, minute=59, second=59)
        
    results = []
    for conv in data:
        conv_date_str = conv.get("created_at")
        if not conv_date_str:
            continue
            
        conv_date = parse_date(conv_date_str)
        if not conv_date:
            continue
            
        if start and conv_date < start:
            continue
        if end and conv_date > end:
            continue
            
        results.append(conv)
        
    return results

def display_results(results: List[Dict[str, Any]]) -> None:
    """Format and display search results."""
    if not results:
        print("No results found.")
        return

    print(f"Found {len(results)} results:\n")
    for conv in results:
        print(f"--- {conv.get('name', 'Unnamed')} ---")
        print(f"UUID: {conv.get('uuid')}")
        print(f"Date: {conv.get('created_at')}")
        print(f"Summary: {conv.get('summary', 'No summary available.')}")
        print("-" * (len(conv.get('name', 'Unnamed')) + 8))
        print()

def main():
    args = parse_args()
    
    try:
        data = load_conversations(args.file)
    except FileNotFoundError as e:
        print(f"Error: {e}")
        return
    except json.JSONDecodeError:
        print(f"Error: Failed to parse JSON in {args.file}")
        return

    results = data
    
    if args.query:
        results = search_keyword(results, args.query)
        
    if args.start or args.end:
        results = filter_by_date(results, args.start, args.end)
        
    display_results(results)

if __name__ == "__main__":
    main()
