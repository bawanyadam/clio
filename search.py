#!/usr/bin/env python3
import json
import os

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

def main():
    print("Search tool initialized.")

if __name__ == "__main__":
    main()
