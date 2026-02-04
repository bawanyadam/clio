from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
import search

app = FastAPI(title="ClaudeJSON API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/search")
def search_conversations(
    query: Optional[str] = None,
    start: Optional[str] = None,
    end: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    file: str = "conversations.json"
):
    try:
        data = search.load_conversations(file)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="File not found")

    # Default sort: newest first
    data.sort(key=lambda x: x.get("created_at", ""), reverse=True)

    results = data
    if query:
        # Use the enhanced search logic for keyword queries
        results = search.search_keyword_enhanced(results, query)
    
    if start or end:
        results = search.filter_by_date(results, start, end)
        
    # Apply pagination
    paginated_results = results[offset : offset + limit]
    
    return paginated_results

@app.get("/conversations/{uuid}")
def get_conversation(uuid: str, file: str = "conversations.json"):
    try:
        data = search.load_conversations(file)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="File not found")
        
    conversation = search.get_conversation_by_uuid(data, uuid)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
        
    return conversation
