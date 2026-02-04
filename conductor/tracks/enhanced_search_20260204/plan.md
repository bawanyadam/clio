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

## Phase 3: Deep Search Result Cards
- [ ] Task: Enhance `ConversationCard` with expansion logic
    - [ ] Implement toggle state for viewing multiple matches
- [ ] Task: Render occurrence list within `ConversationCard`
    - [ ] Display snippets and match counts
- [ ] Task: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md)

## Phase 4: Contextual Navigation & Highlighting
- [ ] Task: Implement deep-link scrolling in `ConversationDetail`
    - [ ] Add `ref` tracking for individual messages
    - [ ] Implement smooth scroll-into-view logic when a match is selected
- [ ] Task: Add visual highlight pulse
    - [ ] Create a temporary CSS animation for the target message background
- [ ] Task: Conductor - User Manual Verification 'Phase 4' (Protocol in workflow.md)
