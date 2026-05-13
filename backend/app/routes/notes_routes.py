"""
Notes routes — /api/notes/* endpoints.
"""

from flask import Blueprint
from flask_jwt_extended import jwt_required
from app.controllers import notes_controller

notes_bp = Blueprint("notes", __name__, url_prefix="/api/notes")


@notes_bp.route("/generate", methods=["POST"])
@jwt_required()
def generate():
    return notes_controller.generate()


@notes_bp.route("/list", methods=["GET"])
@jwt_required()
def list_notes():
    return notes_controller.list_notes()


@notes_bp.route("/<int:note_id>", methods=["GET"])
@jwt_required()
def get_note(note_id):
    return notes_controller.get_note(note_id)


@notes_bp.route("/<int:note_id>", methods=["DELETE"])
@jwt_required()
def delete_note(note_id):
    return notes_controller.delete_note(note_id)
