# GEMINI.md

## Directory Overview
This directory, `ClaudeJSON`, functions as a structured data repository for AI interaction history, user profiles, project definitions, and long-term memory. It appears to be a local storage format for a system that mirrors or manages Claude-like interactions, organizing them into machine-readable JSON files.

## Key Files
- **`conversations.json`**: Contains a history of detailed AI conversations. Each entry includes a UUID, a descriptive name, and a comprehensive summary of the topics discussed (e.g., science fiction analysis, personal health data tracking, business compliance).
- **`memories.json`**: Acts as a long-term memory store. It aggregates key facts about the user (Adam Goehrig-Bawany), including professional background (Ode startup, 1099 income), personal life (family, interests in Sci-Fi), and ongoing health/fitness tracking goals.
- **`projects.json`**: Defines high-level projects or workspaces. It includes metadata such as project descriptions, creation dates, and internal documentation (e.g., "Claude prompting guide.md") embedded as content within the JSON structure.
- **`users.json`**: Stores user profile information, including names, contact details, and unique identifiers.

## Usage
The contents of this directory are intended to provide contextual grounding for AI agents. By reading these files, an agent can:
1.  **Retrieve History**: Understand past discussions to avoid repetition and provide continuity.
2.  **Personalize Responses**: Use the facts in `memories.json` to tailor advice and information to the user's specific life and business situation.
3.  **Contextualize Tasks**: Access project-specific guidelines and documentation stored in `projects.json`.
4.  **Identify the User**: Verify user details and preferences from `users.json`.

This directory is primarily a **Non-Code Project** serving as a data and knowledge base.
