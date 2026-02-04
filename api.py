from fastapi import FastAPI

app = FastAPI(title="ClaudeJSON API")

@app.get("/health")
def health_check():
    return {"status": "ok"}
