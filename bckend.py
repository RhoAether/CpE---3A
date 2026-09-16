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


def update_student():
    """[U]PDATE: Modify a student's profile."""
    print("\n========== UPDATE STUDENT INFO ==========")
    idNumber = input("Enter ID Number to update: ").strip()

    connection = connect_db()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM students WHERE idNumber = ?", (idNumber,))
    student = cursor.fetchone()

    if not student:
        print("Error: Student not found.")
        connection.close()
        return

    print("\nCurrent Information:")
    print(f"Name:    {student['studentName']}")
    print(f"Program: {student['program']}")
    print("\nEnter new information (leave blank to keep current value):")

    new_name = input(f"Name [{student['studentName']}]: ").strip()
    new_program = input(f"Program [{student['program']}]: ").strip()

    new_name = new_name if new_name else student['studentName']
    new_program = new_program if new_program else student['program']

    cursor.execute("""
        UPDATE students
        SET studentName = ?, program = ?
        WHERE idNumber = ?
    """, (new_name, new_program, idNumber))

    connection.commit()
    connection.close()
    print("\nSuccess: Student profile updated!")

def delete_student():
    """[D]ELETE: Remove a student and their attendance history."""
    print("\n========== DELETE STUDENT ==========")
    idNumber = input("Enter ID Number to delete: ").strip()

    connection = connect_db()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM students WHERE idNumber = ?", (idNumber,))
    student = cursor.fetchone()

    if not student:
        print("Error: Student not found.")
        connection.close()
        return

    print(f"\nFound: {student['studentName']} ({student['program']})")
    print("WARNING: Deleting this student will also delete all their attendance records!")
    confirm = input("Are you sure you want to delete? (y/n): ").strip().lower()

    if confirm == 'y':
        cursor.execute("DELETE FROM students WHERE idNumber = ?", (idNumber,))
        connection.commit()
        print("\nSuccess: Student and related logs deleted.")
    else:
        print("\nDeletion cancelled.")
    
    connection.close()

def record_time_in():
    """Log a student entering."""
    print("\n========== RECORD TIME IN ==========")
    idNumber = input("Enter ID Number: ").strip()

    connection = connect_db()
    cursor = connection.cursor()

    cursor.execute("SELECT studentName FROM students WHERE idNumber = ?", (idNumber,))
    student = cursor.fetchone()

    if not student:
        print("Error: ID not found. Please register the student first (Option 1).")
        connection.close()
        return

    cursor.execute("SELECT log_id FROM attendance WHERE idNumber = ? AND timeOut IS NULL", (idNumber,))
    if cursor.fetchone():
        print(f"Error: {student['studentName']} is already timed in.")
        connection.close()
        return

    current_time = datetime.now().strftime("%Y-%m-%d %I:%M:%S %p")
    cursor.execute("INSERT INTO attendance (idNumber, timeIn) VALUES (?, ?)", (idNumber, current_time))
    connection.commit()
    connection.close()
    
    print(f"\nSuccess: {student['studentName']} timed in at {current_time}.")

def record_time_out():
    """Log a student leaving."""
    print("\n========== RECORD TIME OUT ==========")
    idNumber = input("Enter ID Number: ").strip()

    connection = connect_db()
    cursor = connection.cursor()

    cursor.execute("SELECT log_id FROM attendance WHERE idNumber = ? AND timeOut IS NULL", (idNumber,))
    active_log = cursor.fetchone()

    if not active_log:
        print("Error: No active 'Time In' record found for this ID.")
        connection.close()
        return

    current_time = datetime.now().strftime("%Y-%m-%d %I:%M:%S %p")
    cursor.execute("UPDATE attendance SET timeOut = ? WHERE log_id = ?", (current_time, active_log['log_id']))
    connection.commit()
    connection.close()

    print(f"\nSuccess: Student timed out at {current_time}.")

def view_attendance_logs():
    """View all time in/out records."""
    print("\n========== ATTENDANCE LOGS ==========")
    connection = connect_db()
    cursor = connection.cursor()
    cursor.execute("""
        SELECT a.log_id, s.studentName, a.timeIn, a.timeOut
        FROM attendance a
        JOIN students s ON a.idNumber = s.idNumber
        ORDER BY a.log_id DESC
    """)
    logs = cursor.fetchall()
    connection.close()

    if not logs:
        print("No attendance records found.")
        return

    for log in logs:
        time_out_display = log['timeOut'] if log['timeOut'] else "--- Active ---"
        print("----------------------------------------")
        print(f"Name:     {log['studentName']}")
        print(f"Time In:  {log['timeIn']}")
        print(f"Time Out: {time_out_display}")
    print("----------------------------------------")
