# Specification: Web Search Interface for ClaudeJSON

## Overview
A modern, minimalist web application to search and view AI interaction history. This replaces the need for the CLI tool with a "shadcn/ui" inspired interface, built using Next.js and FastAPI.

## Functional Requirements
- **Command Palette Search:** A central search bar for keyword input.
- **Live Filtering:** Search results update dynamically as the user types (keyword) or selects a range (date).
- **Date Range Picker:** UI component to filter results within specific timeframes.
- **Interactive Result Cards:**
    - Display conversation title, date, and summary.
    - **Click-to-View:** Clicking a card navigates to or expands that specific conversation to show the full message history.
- **Quick Actions:** Button to copy the conversation UUID or summary to the clipboard.
- **Backend API:** A FastAPI wrapper around the existing `search.py` logic to serve data to the frontend.

## Non-Functional Requirements
- **Aesthetic:** "Slick and minimal" (shadcn/ui style, clean typography, generous whitespace).
- **Privacy:** Strictly local execution. The web server and API must run only on localhost.
- **Performance:** Optimized for speed; minimal latency between typing and result updates.

## Acceptance Criteria
- User can search by keyword and date range in a browser.
- Search results are displayed as interactive cards.
- Clicking a card reveals the full message log for that conversation.
- No data is transmitted to external servers.

## Out of Scope
- User authentication (stays local-only).
- Data modification/deletion through the UI (read-only for now).
