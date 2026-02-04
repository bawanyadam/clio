#!/usr/bin/env python3
import json
import os

def load_conversations(file_path):
    """Load conversations from a JSON file."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def main():
    print("Search tool initialized.")

if __name__ == "__main__":
    main()
