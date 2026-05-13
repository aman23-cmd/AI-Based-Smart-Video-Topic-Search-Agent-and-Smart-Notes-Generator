"""
User model — CRUD operations for the users table.
Passwords are hashed with bcrypt before storage.
"""

import bcrypt
from app.utils.db import execute_query


class UserModel:
    """Data-access layer for the users table."""

    @staticmethod
    def create(username, email, password):
        """
        Register a new user.

        Args:
            username: Unique display name
            email:    Unique email address
            password: Plain-text password (will be hashed)

        Returns:
            int — newly created user ID
        """
        password_hash = bcrypt.hashpw(
            password.encode("utf-8"), bcrypt.gensalt()
        ).decode("utf-8")

        user_id = execute_query(
            "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)",
            (username, email, password_hash),
            commit=True,
        )
        return user_id

    @staticmethod
    def find_by_email(email):
        """Return the user row matching *email*, or None."""
        return execute_query(
            "SELECT id, username, email, password_hash, created_at FROM users WHERE email = %s",
            (email,),
            fetch_one=True,
        )

    @staticmethod
    def find_by_id(user_id):
        """Return the user row matching *user_id*, or None."""
        return execute_query(
            "SELECT id, username, email, created_at FROM users WHERE id = %s",
            (user_id,),
            fetch_one=True,
        )

    @staticmethod
    def find_by_username(username):
        """Return the user row matching *username*, or None."""
        return execute_query(
            "SELECT id, username, email, created_at FROM users WHERE username = %s",
            (username,),
            fetch_one=True,
        )

    @staticmethod
    def verify_password(plain_password, hashed_password):
        """Return True if *plain_password* matches *hashed_password*."""
        return bcrypt.checkpw(
            plain_password.encode("utf-8"),
            hashed_password.encode("utf-8"),
        )
