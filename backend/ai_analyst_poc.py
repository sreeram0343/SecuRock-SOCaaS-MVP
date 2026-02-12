import os
import sys
from dotenv import load_dotenv

# Try to load environment variables from .env
load_dotenv()

# Add project root to path if needed (though running from root it should be fine)
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from langchain_community.utilities import SQLDatabase
from langchain_community.agent_toolkits import create_sql_agent
from langchain_openai import ChatOpenAI

# Configuration
# For local development, assume default credentials unless env var is set
DB_URL = os.getenv("DATABASE_URL", "postgresql://securock:supersecretpassword@localhost:5432/securock")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    print("Warning: OPENAI_API_KEY not found. Please set it in .env or environment.")
    # For POC purposes, we might just fail here or use a dummy if we had a local LLM
    # sys.exit(1)

def run_ai_analyst_poc():
    print(f"Connecting to database...")
    db = None
    
    # Try Postgres
    try:
        db = SQLDatabase.from_uri(DB_URL)
        # Simple check
        db.run("SELECT 1")
        print(f"Connected to PostgreSQL: {DB_URL}")
    except Exception as e:
        print(f"PostgreSQL connection failed: {e}")
        
    # Try SQLite Fallback
    if not db:
        sqlite_path = "sqlite:///securock_poc.db"
        if os.path.exists("securock_poc.db"):
            print(f"Falling back to SQLite: {sqlite_path}")
            try:
                db = SQLDatabase.from_uri(sqlite_path)
                print("Connected to SQLite.")
            except Exception as e:
                print(f"SQLite connection failed: {e}")
                return
        else:
            print("No SQLite database found. Please run ai_analyst_setup.py first.")
            return

    # Initialize LLM
    llm = ChatOpenAI(model="gpt-4", temperature=0)

    # Create SQL Agent
    print("Initializing LangChain SQL Agent with GPT-4...")
    try:
        agent_executor = create_sql_agent(llm, db=db, agent_type="openai-tools", verbose=True)
    except Exception as e:
        print(f"Failed to create SQL Agent: {e}")
        return

    # Example Query
    query = "How many critical alerts verify in the last 24 hours?"
    print(f"\n--- AI Analyst Query: '{query}' ---")
    print("Thinking...")
    
    try:
        response = agent_executor.invoke(query)
        print(f"\n[AI Analyst Result]: {response['output']}")
    except Exception as e:
        print(f"Error executing agent: {e}")
        print("Note: Ensure OPENAI_API_KEY is set correctly.")

if __name__ == "__main__":
    run_ai_analyst_poc()
