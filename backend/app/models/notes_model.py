"""
Notes model — CRUD for the generated_notes table.
Stores AI-generated notes linked to users and transcripts.
"""

import json
from app.utils.db import execute_query


class NotesModel:
    """Data-access layer for the generated_notes table."""

    @staticmethod
    def create(user_id, transcript_id, topic, notes_content,
               notes_type="bullet", key_concepts=None, questions=None):
        """
        Save a new set of AI-generated notes.

        Returns:
            int — new note row ID
        """
        return execute_query(
            """INSERT INTO generated_notes
               (user_id, transcript_id, topic, notes_content,
                notes_type, key_concepts, questions)
               VALUES (%s, %s, %s, %s, %s, %s, %s)""",
            (
                user_id,
                transcript_id,
                topic,
                notes_content,
                notes_type,
                json.dumps(key_concepts or [], ensure_ascii=False),
                json.dumps(questions or [], ensure_ascii=False),
            ),
            commit=True,
        )

    @staticmethod
    def find_by_user(user_id, limit=50):
        """Return all notes for *user_id*, newest first."""
        rows = execute_query(
            """SELECT id, user_id, transcript_id, topic, notes_type,
                      key_concepts, questions, created_at
               FROM generated_notes
               WHERE user_id = %s
               ORDER BY created_at DESC
               LIMIT %s""",
            (user_id, limit),
            fetch_all=True,
        )
        for row in rows:
            if isinstance(row.get("key_concepts"), str):
                row["key_concepts"] = json.loads(row["key_concepts"])
            if isinstance(row.get("questions"), str):
                row["questions"] = json.loads(row["questions"])
        return rows

    @staticmethod
    def find_by_id(note_id):
        """Return a single note row."""
        row = execute_query(
            "SELECT * FROM generated_notes WHERE id = %s",
            (note_id,),
            fetch_one=True,
        )
        if row:
            if isinstance(row.get("key_concepts"), str):
                row["key_concepts"] = json.loads(row["key_concepts"])
            if isinstance(row.get("questions"), str):
                row["questions"] = json.loads(row["questions"])
        return row

    @staticmethod
    def delete(note_id, user_id):
        """Delete a note (only if owned by *user_id*)."""
        execute_query(
            "DELETE FROM generated_notes WHERE id = %s AND user_id = %s",
            (note_id, user_id),
            commit=True,
        )


class SearchHistoryModel:
    """Data-access layer for the searches table."""

    @staticmethod
    def create(user_id, query, video_url, video_title="",
               transcript_id=None, results=None):
        """Save a search record."""
        return execute_query(
            """INSERT INTO searches
               (user_id, query, video_url, video_title, transcript_id, results)
               VALUES (%s, %s, %s, %s, %s, %s)""",
            (
                user_id, query, video_url, video_title,
                transcript_id,
                json.dumps(results or [], ensure_ascii=False),
            ),
            commit=True,
        )

    @staticmethod
    def find_by_user(user_id, limit=30):
        """Return search history for *user_id*, newest first."""
        rows = execute_query(
            """SELECT id, query, video_url, video_title, created_at
               FROM searches
               WHERE user_id = %s
               ORDER BY created_at DESC
               LIMIT %s""",
            (user_id, limit),
            fetch_all=True,
        )
        return rows
