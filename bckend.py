import sqlite3
from datetime import datetime

DATABASE_NAME = "studentTracker.db"

def connect_db():
    """Connect to the SQLite database and enable foreign keys."""
    connection = sqlite3.connect(DATABASE_NAME)
    connection.execute("PRAGMA foreign_keys = ON")
    connection.row_factory = sqlite3.Row
    return connection

def create_tables():
    """Create separate tables for Students (CRUD) and Attendance."""
    connection = connect_db()
    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS students (
            idNumber TEXT PRIMARY KEY,
            studentName TEXT NOT NULL,
            program TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS attendance (
            log_id INTEGER PRIMARY KEY AUTOINCREMENT,
            idNumber TEXT NOT NULL,
            timeIn TEXT NOT NULL,
            timeOut TEXT,
            FOREIGN KEY (idNumber) REFERENCES students (idNumber) ON DELETE CASCADE
        )
    """)

    connection.commit()
    connection.close()
