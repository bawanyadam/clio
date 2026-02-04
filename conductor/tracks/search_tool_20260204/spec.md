# Specification: Conversation Search CLI

## Overview
A lightweight Python CLI tool to allow the user to search through their locally stored `conversations.json` file using keywords and date ranges.

## Functional Requirements
- Load and parse `conversations.json`.
- Search by keyword (case-insensitive) in conversation names, summaries, and message text.
- Filter by date range (created_at/updated_at).
- Display results in a concise, readable format in the terminal.

## Non-Functional Requirements
- **Privacy:** Strictly local execution; no data transmission.
- **Performance:** Search should be nearly instantaneous for the current file size.

## Acceptance Criteria
- User can run a command like `python search.py --query "3 body" --start "2026-02-01"`.
- Results show relevant conversation names and summaries.

