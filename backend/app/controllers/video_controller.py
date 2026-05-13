"""
Video controller — handles transcript extraction and topic search.
"""

from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity
from app.services.youtube_service import get_transcript
from app.services.transcript_service import search_transcript
from app.models.transcript_model import TranscriptModel
from app.models.notes_model import SearchHistoryModel


def extract_transcript():
    """POST /api/video/transcript — Fetch and store a YouTube transcript."""
    data = request.get_json(silent=True) or {}
    video_url = data.get("video_url", "").strip()

    if not video_url:
        return jsonify(error="video_url is required."), 400

    try:
        result = get_transcript(video_url)
    except ValueError as e:
        return jsonify(error=str(e)), 400

    # Persist to DB (upsert by video_id)
    transcript_id = TranscriptModel.create(
        video_id=result["video_id"],
        video_url=result["video_url"],
        video_title="",  # title fetching can be added later
        transcript_text=result["full_text"],
        segments=result["segments"],
    )

    # If upsert returned 0 (existing row), look up the real ID
    if not transcript_id:
        existing = TranscriptModel.find_by_video_id(result["video_id"])
        transcript_id = existing["id"] if existing else None

    return jsonify(
        id=transcript_id,
        video_id=result["video_id"],
        video_url=result["video_url"],
        video_title="",
        segment_count=len(result["segments"]),
        transcript_text=result["full_text"][:500] + "...",
        transcript_segments=result["segments"][:5],  # preview
    ), 200


def search_topic():
    """POST /api/video/search — Semantic search within a transcript."""
    data = request.get_json(silent=True) or {}
    query = data.get("query", "").strip()
    video_url = data.get("video_url", "").strip()

    if not query:
        return jsonify(error="query is required."), 400
    if not video_url:
        return jsonify(error="video_url is required."), 400

    user_id = int(get_jwt_identity())

    # Get or fetch transcript
    from app.services.youtube_service import extract_video_id
    video_id = extract_video_id(video_url)

    if not video_id:
        return jsonify(error="Invalid YouTube URL."), 400

    transcript = TranscriptModel.find_by_video_id(video_id)
    if not transcript:
        # Auto-fetch if not cached
        try:
            result = get_transcript(video_url)
            TranscriptModel.create(
                video_id=result["video_id"],
                video_url=result["video_url"],
                video_title="",
                transcript_text=result["full_text"],
                segments=result["segments"],
            )
            transcript = TranscriptModel.find_by_video_id(video_id)
        except ValueError as e:
            return jsonify(error=str(e)), 400

    segments = transcript.get("transcript_segments", [])
    if isinstance(segments, str):
        import json
        segments = json.loads(segments)

    # Run semantic search
    results = search_transcript(query, segments, top_k=10)

    # Save to search history
    SearchHistoryModel.create(
        user_id=user_id,
        query=query,
        video_url=video_url,
        video_title=transcript.get("video_title", ""),
        transcript_id=transcript.get("id"),
        results=results,
    )

    return jsonify(
        query=query,
        video_id=transcript.get("video_id"),
        transcript_id=transcript.get("id"),
        result_count=len(results),
        results=results,
    ), 200


def get_history():
    """GET /api/video/history — Return the user's search history."""
    user_id = int(get_jwt_identity())
    history = SearchHistoryModel.find_by_user(user_id)

    # Serialise datetimes
    for item in history:
        if item.get("created_at"):
            item["created_at"] = item["created_at"].isoformat()

    return jsonify(history=history), 200
