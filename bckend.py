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

def create_student():
    """[C]REATE: Register a new student."""
    print("\n========== REGISTER NEW STUDENT ==========")
    idNumber = input("Enter ID Number: ").strip()
    studentName = input("Enter Student Name: ").strip()
    program = input("Enter Program / Course: ").strip()

    if not idNumber or not studentName or not program:
        print("Error: All fields are required.")
        return

    connection = connect_db()
    cursor = connection.cursor()
    created_at = datetime.now().strftime("%Y-%m-%d %I:%M:%S %p")

    try:
        cursor.execute("""
            INSERT INTO students (idNumber, studentName, program, created_at)
            VALUES (?, ?, ?, ?)
        """, (idNumber, studentName, program, created_at))
        
        connection.commit()
        print(f"\nSuccess: Student '{studentName}' successfully registered!")
    except sqlite3.IntegrityError:
        print("\nError: ID Number already exists in the system.")
    finally:
        connection.close()

def read_all_students():
    """[R]EAD: Display all registered students."""
    print("\n========== ALL REGISTERED STUDENTS ==========")
    connection = connect_db()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM students ORDER BY idNumber")
    students = cursor.fetchall()
    connection.close()

    if not students:
        print("No student records found.")
        return

    for s in students:
        print("----------------------------------------")
        print(f"ID Number:  {s['idNumber']}")
        print(f"Name:       {s['studentName']}")
        print(f"Program:    {s['program']}")
    print("----------------------------------------")

def search_students():
    """[R]EAD: Search for a specific student."""
    print("\n========== SEARCH STUDENTS ==========")
    keyword = input("Enter name, program, or ID keyword: ").strip()

    if not keyword:
        print("Error: Search keyword is required.")
        return

    connection = connect_db()
    cursor = connection.cursor()
    cursor.execute("""
        SELECT * FROM students
        WHERE idNumber LIKE ? OR studentName LIKE ? OR program LIKE ?
        ORDER BY idNumber
    """, (f"%{keyword}%", f"%{keyword}%", f"%{keyword}%"))
    
    students = cursor.fetchall()
    connection.close()

    if not students:
        print("No matching students found.")
        return

    print("\nSearch Results:")
    for s in students:
        print(f"ID: {s['idNumber']} | Name: {s['studentName']} | Program: {s['program']}")
