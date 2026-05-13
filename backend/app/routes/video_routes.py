"""
Video routes — /api/video/* endpoints.
"""

from flask import Blueprint
from flask_jwt_extended import jwt_required
from app.controllers import video_controller

video_bp = Blueprint("video", __name__, url_prefix="/api/video")


@video_bp.route("/transcript", methods=["POST"])
@jwt_required()
def transcript():
    return video_controller.extract_transcript()


@video_bp.route("/search", methods=["POST"])
@jwt_required()
def search():
    return video_controller.search_topic()


@video_bp.route("/history", methods=["GET"])
@jwt_required()
def history():
    return video_controller.get_history()
