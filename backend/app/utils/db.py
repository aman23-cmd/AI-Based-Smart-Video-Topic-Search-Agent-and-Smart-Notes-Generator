"""
MySQL connection pool utility.
Provides get_connection() and execute_query() helpers.
Auto-creates the database and tables on first import if they don't exist.
"""

import mysql.connector
from mysql.connector import pooling, Error
from app.config import Config

# ---------------------------------------------------------------------------
# Connection pool (lazy-initialised)
# ---------------------------------------------------------------------------
_pool = None


def _get_pool():
    """Return the singleton connection pool, creating it on first call."""
    global _pool
    if _pool is None:
        # First make sure the DATABASE exists
        _ensure_database()
        _pool = pooling.MySQLConnectionPool(
            pool_name="app_pool",
            pool_size=5,
            pool_reset_session=True,
            host=Config.DB_HOST,
            port=Config.DB_PORT,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD,
            database=Config.DB_NAME,
            charset="utf8mb4",
            collation="utf8mb4_unicode_ci",
            autocommit=False,
        )
    return _pool


def _ensure_database():
    """Create the database if it doesn't exist yet."""
    cnx = mysql.connector.connect(
        host=Config.DB_HOST,
        port=Config.DB_PORT,
        user=Config.DB_USER,
        password=Config.DB_PASSWORD,
    )
    cursor = cnx.cursor()
    cursor.execute(
        f"CREATE DATABASE IF NOT EXISTS `{Config.DB_NAME}` "
        "CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
    )
    cnx.commit()
    cursor.close()
    cnx.close()


def get_connection():
    """Get a connection from the pool."""
    return _get_pool().get_connection()


def execute_query(query, params=None, fetch_one=False, fetch_all=False, commit=False):
    """
    Execute a SQL query and optionally fetch results.

    Args:
        query:     SQL string (with %s placeholders)
        params:    Tuple of parameters
        fetch_one: Return a single row dict
        fetch_all: Return list of row dicts
        commit:    Commit transaction after execute

    Returns:
        dict | list[dict] | lastrowid | None
    """
    cnx = get_connection()
    cursor = cnx.cursor(dictionary=True)
    try:
        cursor.execute(query, params or ())
        if commit:
            cnx.commit()
            return cursor.lastrowid
        if fetch_one:
            return cursor.fetchone()
        if fetch_all:
            return cursor.fetchall()
        return None
    except Error as e:
        cnx.rollback()
        raise e
    finally:
        cursor.close()
        cnx.close()


def init_tables():
    """Create all tables if they don't exist (called on app startup)."""
    import os

    schema_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
        "schema.sql",
    )
    if not os.path.exists(schema_path):
        print("[DB] schema.sql not found — skipping table init")
        return

    cnx = get_connection()
    cursor = cnx.cursor()
    try:
        with open(schema_path, "r", encoding="utf-8") as f:
            sql = f.read()
        # Execute each statement separately
        for statement in sql.split(";"):
            stmt = statement.strip()
            if stmt and not stmt.upper().startswith(("--", "CREATE DATABASE", "USE ")):
                cursor.execute(stmt)
        cnx.commit()
        print("[DB] Tables initialised successfully")
    except Error as e:
        cnx.rollback()
        print(f"[DB] Table init error: {e}")
    finally:
        cursor.close()
        cnx.close()
