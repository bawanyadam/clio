# Implementation Plan: Enhanced Search and Contextual Navigation

## Phase 1: Backend API Enhancements [checkpoint: 1ea367c]
- [x] Task: Update `search.py` logic to return individual message matches [87d64a8]
    - [x] Write Tests
    - [x] Implement occurrence tracking and context snippets
- [x] Task: Enhance `/search` endpoint schema [8753ac0]
    - [x] Write Tests
    - [x] Update FastAPI response model to group results by conversation with message metadata
- [x] Task: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md) [1ea367c]

## Phase 2: Filter UI Refinement [checkpoint: d0919fc]
- [x] Task: Implement Filter Button and Popover component [d0919fc]
    - [x] Create the UI component using shadcn/ui patterns
    - [x] Migrate date range pickers into the popover state
- [x] Task: Refactor search page state for "Neutral" initial load [d0919fc]
    - [x] Ensure filters are hidden and inactive by default
- [x] Task: Conductor - User Manual Verification 'Phase 2' (Protocol in workflow.md) [d0919fc]

## Phase 3: Deep Search Result Cards [checkpoint: 2422fbf]
- [x] Task: Enhance `ConversationCard` with expansion logic [2422fbf]
    - [x] Implement toggle state for viewing multiple matches
- [x] Task: Render occurrence list within `ConversationCard` [2422fbf]
    - [x] Display snippets and match counts
- [x] Task: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md) [2422fbf]

## Phase 4: Contextual Navigation & Highlighting [checkpoint: 950bd13]
- [x] Task: Implement deep-link scrolling in `ConversationDetail` [950bd13]
    - [x] Add `ref` tracking for individual messages
    - [x] Implement smooth scroll-into-view logic when a match is selected
- [x] Task: Add visual highlight pulse [950bd13]
    - [x] Create a temporary CSS animation for the target message background
- [x] Task: Conductor - User Manual Verification 'Phase 4' (Protocol in workflow.md) [950bd13]
