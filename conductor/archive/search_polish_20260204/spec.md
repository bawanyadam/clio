# Specification: Search UI Polish and Initial Load State

## Overview
This track addresses feedback on the initial user experience and search result visibility. It ensures that users are greeted with their full conversation archive on load and that search results are immediately informative by being auto-expanded.

## Functional Requirements
- **Default Load State:**
    - On initial load (no active query or filters), the app now displays all conversations in chronological order (newest first).
    - Implement basic pagination (e.g., load first 25) to maintain performance.
- **Auto-Expanded Search Results:**
    - When a keyword search is active, all resulting `ConversationCard` components must start in an **expanded state** to show the individual message matches by default.
- **Archive Metadata Header:**
    - Display global archive stats at the top of the result list:
        - Total conversation count.
        - Date range of the entire archive (e.g., "Jan 2025 - Feb 2026").
- **Enhanced Filter State:**
    - Refine the "Clear" logic to return the user to the default "All Conversations" view with a single click.
    - Explicitly show "Filtered Results" or "All Conversations" based on state.

## Non-Functional Requirements
- **Performance:** Initial load must remain fast even when displaying the first page of conversations.
- **UX:** Clear visual distinction between "Search Results" and the default "All Conversations" view.

## Acceptance Criteria
- App index page shows most recent conversations without requiring a search.
- Keyword search results appear with all matches expanded.
- Archive stats (total count, date range) are visible.
- "Clear all" button resets view to the default list.
