from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
import search
import os

app = FastAPI(title="clio API")

DEFAULT_FILE = "conversations.json"
EXAMPLE_FILE = "conversations-example.json"

def get_data_file(requested_file: str) -> str:
    """Determine which data file to use, with fallback to example."""
    if os.path.exists(requested_file):
        return requested_file
    if requested_file == DEFAULT_FILE and os.path.exists(EXAMPLE_FILE):
        return EXAMPLE_FILE
    return requested_file

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
    file: str = DEFAULT_FILE
):
    target_file = get_data_file(file)
    try:
        data = search.load_conversations(target_file)
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

@app.get("/archive/stats")
def get_archive_stats(file: str = DEFAULT_FILE):
    target_file = get_data_file(file)
    try:
        data = search.load_conversations(target_file)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="File not found")
        
    if not data:
        return {"total_count": 0, "start_date": None, "end_date": None}
        
    # Get sorted dates to find range
    dates = sorted([conv.get("created_at") for conv in data if conv.get("created_at")])
    
    return {
        "total_count": len(data),
        "start_date": dates[0] if dates else None,
        "end_date": dates[-1] if dates else None
    }

@app.get("/conversations/{uuid}")
def get_conversation(uuid: str, file: str = DEFAULT_FILE):
    target_file = get_data_file(file)
    try:
        data = search.load_conversations(target_file)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="File not found")
        
    conversation = search.get_conversation_by_uuid(data, uuid)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
        
    return conversation
