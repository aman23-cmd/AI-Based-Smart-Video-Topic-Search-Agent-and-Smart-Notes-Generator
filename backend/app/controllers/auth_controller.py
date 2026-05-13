"""
Auth controller — business logic for registration, login, logout, and profile.
"""

from flask import request, jsonify
from flask_jwt_extended import (
    create_access_token, get_jwt_identity, get_jwt,
)
from app.models.user_model import UserModel
from app.utils.jwt_helper import blacklist_token


def register():
    """POST /api/auth/register — Create a new user account."""
    data = request.get_json(silent=True) or {}

    username = data.get("username", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    # Validation
    if not username or not email or not password:
        return jsonify(error="Username, email, and password are required."), 400

    if len(password) < 6:
        return jsonify(error="Password must be at least 6 characters."), 400

    if UserModel.find_by_email(email):
        return jsonify(error="Email is already registered."), 409

    if UserModel.find_by_username(username):
        return jsonify(error="Username is already taken."), 409

    try:
        user_id = UserModel.create(username, email, password)
        return jsonify(message="Account created successfully.", user_id=user_id), 201
    except Exception as e:
        return jsonify(error=f"Registration failed: {str(e)}"), 500


def login():
    """POST /api/auth/login — Authenticate and return JWT."""
    data = request.get_json(silent=True) or {}

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify(error="Email and password are required."), 400

    user = UserModel.find_by_email(email)
    if not user or not UserModel.verify_password(password, user["password_hash"]):
        return jsonify(error="Invalid email or password."), 401

    access_token = create_access_token(
        identity=str(user["id"]),
        additional_claims={"username": user["username"]},
    )

    return jsonify(
        access_token=access_token,
        user={
            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
        },
    ), 200


def logout():
    """POST /api/auth/logout — Blacklist the current JWT."""
    jti = get_jwt()["jti"]
    blacklist_token(jti)
    return jsonify(message="Logged out successfully."), 200


def get_me():
    """GET /api/auth/me — Return the authenticated user's profile."""
    user_id = int(get_jwt_identity())
    user = UserModel.find_by_id(user_id)
    if not user:
        return jsonify(error="User not found."), 404

    # Serialise datetime for JSON
    user_data = dict(user)
    if user_data.get("created_at"):
        user_data["created_at"] = user_data["created_at"].isoformat()

    return jsonify(user=user_data), 200
