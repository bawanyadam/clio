# Tech Stack - clio

## Data Storage & Format
- **Format:** Structured JSON (JavaScript Object Notation).
- **Storage:** Local filesystem-based flat files.
- **Key Files:
    - `conversations.json`: AI interaction history.
    - `memories.json`: Personal long-term memory store.
    - `users.json`: User profile data.
    - `projects.json`: Project definitions and documentation.

## Operating Environment
- **OS:** Darwin (MacOS).
- **Environment:** Local CLI and filesystem.

## Application Logic
- **Backend:** Python 3.9+ with FastAPI
- **Frontend:** Next.js (TypeScript, React, Tailwind CSS)
- **Key Libraries:** 
    - **Backend:** `uvicorn`, `pydantic`
    - **Frontend:** `shadcn/ui` (patterns)
