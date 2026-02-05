# clio

**clio** is a modern, minimalist, and strictly local web interface for searching through your archived AI conversations. It acts as a "second brain," allowing you to quickly retrieve past insights and decisions from your `conversations.json` files without sacrificing privacy.

## Features

- **Instant Search:** Dynamic, debounced search across conversation names, summaries, and message history.
- **Deep Context:** See every occurrence of a keyword within a chat, with snippets showing the surrounding text.
- **Contextual Navigation:** Click a search result to jump directly to that specific message in the full conversation thread.
- **Visual Highlighting:** The target keyword is automatically highlighted when you jump to a message.
- **Privacy First:** Strictly local execution. Your data never leaves your machine.
- **Date Filtering:** Hide or show conversations within specific date ranges.

## Prerequisites

- **Python 3.9+**
- **Node.js 18+** and **npm**

## Quick Start

1. **Clone the repository:**
   ```bash
   git clone git@github.com:bawanyadam/clio.git
   cd clio
   ```

2. **Add your data:**
   Place your `conversations.json` file in the root directory of this project.

3. **Run the app:**
   Simply run the start script:
   ```bash
   chmod +x start.sh
   ./start.sh
   ```
   This will set up your environments, start the backend and frontend servers, and open your browser to `http://localhost:3000`.

## Manual Setup

If you prefer to run the components separately:

### Backend (FastAPI)
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn api:app --reload
```

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

## Tech Stack

- **Backend:** FastAPI (Python)
- **Frontend:** Next.js, Tailwind CSS, shadcn/ui patterns
- **Data:** Local JSON files

## Screenshots

![Search results view](screenshots/1.png?v=1)
![Conversation detail view](screenshots/2.png?v=1)
![Date filter view](screenshots/3.png?v=1)
