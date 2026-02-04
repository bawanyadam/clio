# Specification: Enhanced Search and Contextual Navigation

## Overview
This track enhances the existing search functionality to support multiple keyword occurrences within a single conversation, provide direct "jump-to" navigation to specific messages, and refine the filter UI for a cleaner initial state.

## Functional Requirements
- **Deep Search API:**
    - Update the `/search` endpoint to return specific message UUIDs and context snippets for every occurrence of the keyword.
    - Logic should group matches by conversation but preserve individual message metadata.
- **Enhanced Result UI:**
    - Conversation result cards will now indicate the total number of matches found.
    - Cards will be expandable to show a list of context snippets for each occurrence.
- **Contextual Navigation:**
    - Clicking a match snippet will open the conversation and automatically scroll the specific message into view.
    - The target message will feature a temporary visual highlight (e.g., a background pulse) to orient the user.
- **Refined Filter UI:**
    - Move the date range pickers into a \"Filter\" popover/dropdown menu to declutter the main search interface.
    - Ensure the UI reflects a \"neutral\" state on load, rather than appearing pre-filtered.

## Non-Functional Requirements
- **Performance:** Navigation and scrolling should be smooth and immediate.
- **UI Consistency:** Maintain the \"shadcn/ui\" minimalist aesthetic with clean transitions.

## Acceptance Criteria
- User can see multiple results for the same chat if the keyword appears multiple times.
- Clicking a specific occurrence scrolls the chat detail view directly to that message.
- The target message is visually distinct upon navigation.
- The date range filter is hidden behind a toggle button.

## Out of Scope
- Global search across non-conversation JSON files (memories, projects).
