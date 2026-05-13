"""
JWT helper utilities.
Configures Flask-JWT-Extended and provides a token-blacklist check
so that logged-out tokens are rejected.
"""

from flask_jwt_extended import JWTManager
from app.utils.db import execute_query

jwt = JWTManager()


def init_jwt(app):
    """Bind JWTManager to the Flask app and register callbacks."""
    jwt.init_app(app)

    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(_jwt_header, jwt_payload):
        """Return True if the token's JTI is in the blacklist table."""
        jti = jwt_payload["jti"]
        row = execute_query(
            "SELECT id FROM jwt_blacklist WHERE jti = %s",
            (jti,),
            fetch_one=True,
        )
        return row is not None

    @jwt.revoked_token_loader
    def revoked_token_callback(_jwt_header, _jwt_payload):
        return {"error": "Token has been revoked. Please log in again."}, 401

    @jwt.expired_token_loader
    def expired_token_callback(_jwt_header, _jwt_payload):
        return {"error": "Token has expired. Please log in again."}, 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error_string):
        return {"error": f"Invalid token: {error_string}"}, 401

    @jwt.unauthorized_loader
    def missing_token_callback(error_string):
        return {"error": "Authorization token is missing."}, 401


def blacklist_token(jti):
    """Add a JTI to the blacklist so it cannot be reused."""
    execute_query(
        "INSERT IGNORE INTO jwt_blacklist (jti) VALUES (%s)",
        (jti,),
        commit=True,
    )
