"""
Auth routes — /api/auth/* endpoints.
"""

from flask import Blueprint
from flask_jwt_extended import jwt_required
from app.controllers import auth_controller

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

auth_bp.route("/register", methods=["POST"])(auth_controller.register)
auth_bp.route("/login", methods=["POST"])(auth_controller.login)

@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    return auth_controller.logout()

@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_me():
    return auth_controller.get_me()
