import os
import sys
import sqlite3
from sqlalchemy import create_engine, text

# Configuration
PG_URL = os.getenv("DATABASE_URL", "postgresql://securock:supersecretpassword@localhost:5432/securock")
SQLITE_DB = "securock_poc.db"

def setup_sqlite():
    print(f"Setting up SQLite database: {SQLITE_DB}...")
    conn = sqlite3.connect(SQLITE_DB)
    cursor = conn.cursor()
    
    # Create Alerts table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        severity TEXT NOT NULL,
        status TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # Insert sample data
    sample_alerts = [
        ("Brute Force Attack", "critical", "open", "Multiple failed login attempts detected from IP 192.168.1.50"),
        ("Malware Detected", "high", "open", "Ransomware signature found on endpoint WORKSTATION-01"),
        ("Policy Violation", "medium", "closed", "User accessed restricted site during work hours"),
        ("System Update Failed", "low", "acknowledged", "Routine patch management failed on server SRV-DB-02"),
        ("SQL Injection Attempt", "critical", "open", "Suspicious SQL syntax detected in web request parameter 'id'"),
    ]
    
    cursor.executemany('INSERT INTO alerts (title, severity, status, description) VALUES (?, ?, ?, ?)', sample_alerts)
    conn.commit()
    conn.close()
    print("SQLite database setup complete with sample data.")

def check_postgres():
    print(f"Attempting to connect to PostgreSQL at {PG_URL}...")
    try:
        engine = create_engine(PG_URL)
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("PostgreSQL connection successful!")
            return True
    except Exception as e:
        print(f"PostgreSQL connection failed: {e}")
        return False

if __name__ == "__main__":
    if check_postgres():
        print("Using existing PostgreSQL database.")
    else:
        print("PostgreSQL unavailable. Falling back to SQLite for POC.")
        setup_sqlite()
