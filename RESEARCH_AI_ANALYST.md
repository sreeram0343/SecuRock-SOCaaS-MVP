# Research: AI Analyst (NLP to SQL)

## Executive Summary
This research explores the feasibility of implementing an "AI Analyst" feature in SecuRock. The goal is to allow users to query their security data using natural language (e.g., "Show me all critical alerts from the last 24 hours"), thereby reducing the need for complex SQL knowledge or manual filtering.

## Technical Architecture
We propose using **LangChain's SQL Agent** capabilities to bridge the gap between natural language and our PostgreSQL database.

### Components
1.  **LangChain SQLDatabase**: Connects to the database and retrieves schema information.
2.  **OpenAI GPT-4**: The LLM responsible for understanding the user's intent and generating SQL queries.
3.  **SQL Agent**: Orchestrates the interaction, executing the generated SQL and interpreting the results back to the user.

## Proof of Concept (POC)
We developed a script (`backend/ai_analyst_poc.py`) to demonstrate this capability.

### Methodology
1.  **Setup**: Connect to the `securock` database (with SQLite fallback for isolated testing).
2.  **Schema**: The agent inspects the `alerts` table (id, title, severity, status, description).
3.  **Query**: We tested with the question: "How many critical alerts verify in the last 24 hours?"

## Expected Findings
-   **Accuracy**: GPT-4 is generally highly accurate at generating SQL for well-structured schemas.
-   **Security**: Read-only permissions should be enforced for the DB user to prevent SQL injection or accidental data modification.
-   **Latency**: Queries may take 2-5 seconds depending on complexity and LLM response time.

## Recommendations
1.  **Implement**: Proceed with integrating this into the main backend API (`/api/analyst/query`).
2.  **Guardrails**: Use `SQLDatabaseToolkit` with a read-only database user.
3.  **Caching**: Cache common queries to improve performance.
