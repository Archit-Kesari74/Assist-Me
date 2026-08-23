import sqlite3
import os
from contextlib import contextmanager

DB_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(DB_DIR, "assist_me.db")


@contextmanager
def get_db():
    """Context manager for SQLite connections that ensures commit and proper closing."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def get_db_connection():
    """Alias/wrapper returning a managed context connection."""
    return get_db()


def init_db():
    """Initialize database tables and seed default users/sample data if empty."""
    with get_db() as conn:
        cursor = conn.cursor()

        # Create Requests Table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS requests (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                category TEXT NOT NULL CHECK (category IN ('groceries', 'home', 'ride', 'medicine', 'other')),
                status TEXT NOT NULL CHECK (status IN ('pending_family', 'approved', 'accepted', 'on_the_way', 'picked_up', 'completed', 'rejected')),
                elder TEXT NOT NULL DEFAULT 'Mary',
                family TEXT NOT NULL DEFAULT 'Sarah',
                helper TEXT NOT NULL DEFAULT 'Alex',
                estimated_cost REAL NOT NULL DEFAULT 0.0,
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL,
                reject_reason TEXT,
                location TEXT DEFAULT "Mary's home",
                is_active INTEGER NOT NULL DEFAULT 1
            )
        """)

        # Create Users Table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                role TEXT NOT NULL CHECK (role IN ('elder', 'family', 'helper')),
                relation TEXT,
                phone TEXT,
                avatar TEXT
            )
        """)

        # Create Activity Log Table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS activity_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                request_id TEXT NOT NULL,
                action TEXT NOT NULL,
                performed_by TEXT NOT NULL,
                timestamp INTEGER NOT NULL,
                details TEXT,
                FOREIGN KEY (request_id) REFERENCES requests (id) ON DELETE CASCADE
            )
        """)

        # Seed Users if not present
        cursor.execute("SELECT COUNT(*) FROM users")
        if cursor.fetchone()[0] == 0:
            cursor.executemany("""
                INSERT INTO users (id, name, role, relation, phone, avatar)
                VALUES (?, ?, ?, ?, ?, ?)
            """, [
                ("user_elder_1", "Mary", "elder", "Self", "+1-555-0101", "👵"),
                ("user_family_1", "Sarah", "family", "Daughter", "+1-555-0102", "👩"),
                ("user_helper_1", "Alex", "helper", "Trusted Neighbor", "+1-555-0103", "🚴"),
            ])


def row_to_dict(row):
    """Convert a sqlite3.Row to standard dictionary with camelCase fields for frontend."""
    if not row:
        return None
    d = dict(row)
    return {
        "id": d.get("id"),
        "title": d.get("title"),
        "description": d.get("description"),
        "category": d.get("category"),
        "status": d.get("status"),
        "elder": d.get("elder"),
        "family": d.get("family"),
        "helper": d.get("helper"),
        "estimatedCost": d.get("estimated_cost", 0.0),
        "createdAt": d.get("created_at"),
        "updatedAt": d.get("updated_at"),
        "rejectReason": d.get("reject_reason"),
        "location": d.get("location"),
        "isActive": bool(d.get("is_active", 1)),
    }
