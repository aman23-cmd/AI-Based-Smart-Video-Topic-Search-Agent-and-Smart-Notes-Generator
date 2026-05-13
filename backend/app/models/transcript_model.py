"""
Transcript model — CRUD for the transcripts table.
Stores YouTube video transcripts with their segments (timestamps + text).
"""

import json
from app.utils.db import execute_query


class TranscriptModel:
    """Data-access layer for the transcripts table."""

    @staticmethod
    def create(video_id, video_url, video_title, transcript_text, segments):
        """
        Store a new transcript.

        Args:
            video_id:        YouTube video ID (e.g. 'dQw4w9WgXcQ')
            video_url:       Full YouTube URL
            video_title:     Video title string
            transcript_text: Full concatenated transcript text
            segments:        List of {text, start, duration} dicts

        Returns:
            int — new transcript row ID
        """
        segments_json = json.dumps(segments, ensure_ascii=False)
        return execute_query(
            """INSERT INTO transcripts
               (video_id, video_url, video_title, transcript_text, transcript_segments)
               VALUES (%s, %s, %s, %s, %s)
               ON DUPLICATE KEY UPDATE
                 transcript_text = VALUES(transcript_text),
                 transcript_segments = VALUES(transcript_segments),
                 video_title = VALUES(video_title)""",
            (video_id, video_url, video_title, transcript_text, segments_json),
            commit=True,
        )

    @staticmethod
    def find_by_video_id(video_id):
        """Return the transcript row for *video_id*, or None."""
        row = execute_query(
            "SELECT * FROM transcripts WHERE video_id = %s",
            (video_id,),
            fetch_one=True,
        )
        if row and isinstance(row.get("transcript_segments"), str):
            row["transcript_segments"] = json.loads(row["transcript_segments"])
        return row

    @staticmethod
    def find_by_id(transcript_id):
        """Return the transcript row matching *transcript_id*."""
        row = execute_query(
            "SELECT * FROM transcripts WHERE id = %s",
            (transcript_id,),
            fetch_one=True,
        )
        if row and isinstance(row.get("transcript_segments"), str):
            row["transcript_segments"] = json.loads(row["transcript_segments"])
        return row
