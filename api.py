from fastapi import FastAPI, Query
from typing import Optional, List
import search

app = FastAPI(title="ClaudeJSON API")

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/search")
def search_conversations(
    query: Optional[str] = None,
    start: Optional[str] = None,
    end: Optional[str] = None,
    file: str = "conversations.json"
):
    try:
        data = search.load_conversations(file)
    except FileNotFoundError:
        return {"error": "File not found"}

    results = data
    if query:
        results = search.search_keyword(results, query)
    if start or end:
        results = search.filter_by_date(results, start, end)
        
    return results
