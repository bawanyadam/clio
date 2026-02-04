#!/usr/bin/env python3
import json
import os
import argparse
from datetime import datetime, timezone

def parse_args():
    """Parse CLI arguments."""
    parser = argparse.ArgumentParser(description="Search through conversations.json")
    parser.add_argument("--query", "-q", help="Keyword to search for")
    parser.add_argument("--start", help="Start date (YYYY-MM-DD)")
    parser.add_argument("--end", help="End date (YYYY-MM-DD)")
    parser.add_argument("--file", default="conversations.json", help="Path to conversations.json")
    return parser.parse_args()

def load_conversations(file_path):
    """Load conversations from a JSON file."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def search_keyword(data, query):
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

def parse_date(date_str):
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

def filter_by_date(data, start_date=None, end_date=None):
    """Filter conversations by date range."""
    start = parse_date(start_date)
    # If end_date is YYYY-MM-DD, make it end of day
    end = parse_date(end_date)
    if end and len(end_date) == 10:
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

def main():
    print("Search tool initialized.")

if __name__ == "__main__":
    main()
