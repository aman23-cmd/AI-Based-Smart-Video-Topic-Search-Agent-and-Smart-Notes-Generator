"""
Notes controller — handles AI note generation and notes CRUD.
"""

from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity
from app.services.ai_service import generate_notes as ai_generate_notes
from app.models.transcript_model import TranscriptModel
from app.models.notes_model import NotesModel


def generate():
    """POST /api/notes/generate — Generate AI notes from a transcript."""
    data = request.get_json(silent=True) or {}
    transcript_id = data.get("transcript_id")
    topic = data.get("topic", "").strip()
    note_type = data.get("note_type", "bullet").strip()

    if not transcript_id:
        return jsonify(error="transcript_id is required."), 400
    if not topic:
        return jsonify(error="topic is required."), 400

    user_id = int(get_jwt_identity())

    # Look up transcript
    transcript = TranscriptModel.find_by_id(int(transcript_id))
    if not transcript:
        return jsonify(error="Transcript not found."), 404

    transcript_text = transcript.get("transcript_text", "")
    if not transcript_text:
        return jsonify(error="Transcript is empty."), 400

    try:
        result = ai_generate_notes(transcript_text, topic, note_type)
    except Exception as e:
        return jsonify(error=f"AI note generation failed: {str(e)}"), 500

    # Save to database
    note_id = NotesModel.create(
        user_id=user_id,
        transcript_id=int(transcript_id),
        topic=topic,
        notes_content=result["notes_content"],
        notes_type=note_type,
        key_concepts=result.get("key_concepts", []),
        questions=result.get("questions", []),
    )

    return jsonify(
        id=note_id,
        topic=topic,
        notes_type=note_type,
        notes_content=result["notes_content"],
        key_concepts=result.get("key_concepts", []),
        questions=result.get("questions", []),
    ), 201


def list_notes():
    """GET /api/notes/list — Return all notes for the current user."""
    user_id = int(get_jwt_identity())
    notes = NotesModel.find_by_user(user_id)

    for note in notes:
        if note.get("created_at"):
            note["created_at"] = note["created_at"].isoformat()

    return jsonify(notes=notes), 200


def get_note(note_id):
    """GET /api/notes/<id> — Return a single note."""
    note = NotesModel.find_by_id(note_id)
    if not note:
        return jsonify(error="Note not found."), 404

    user_id = int(get_jwt_identity())
    if note["user_id"] != user_id:
        return jsonify(error="Access denied."), 403

    if note.get("created_at"):
        note["created_at"] = note["created_at"].isoformat()

    return jsonify(note=note), 200


def delete_note(note_id):
    """DELETE /api/notes/<id> — Delete a note."""
    user_id = int(get_jwt_identity())
    note = NotesModel.find_by_id(note_id)

    if not note:
        return jsonify(error="Note not found."), 404
    if note["user_id"] != user_id:
        return jsonify(error="Access denied."), 403

    NotesModel.delete(note_id, user_id)
    return jsonify(message="Note deleted successfully."), 200
