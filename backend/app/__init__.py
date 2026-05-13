"""
Flask application factory.
Creates and configures the Flask app, registers extensions, blueprints,
and initialises the database tables on first startup.
"""

from flask import Flask
from flask_cors import CORS
from app.config import Config
from app.utils.jwt_helper import init_jwt
from app.utils.db import init_tables


def create_app():
    """Build and return a configured Flask application instance."""
    app = Flask(__name__)

    # ── Load config ───────────────────────────────────────────
    app.config.from_object(Config)

    # ── CORS — allow the React frontend origin ────────────────
    CORS(
        app,
        resources={r"/api/*": {"origins": "*"}},
        supports_credentials=True,
    )

    # ── JWT ───────────────────────────────────────────────────
    init_jwt(app)

    # ── Register blueprints ───────────────────────────────────
    from app.routes.auth_routes import auth_bp
    from app.routes.video_routes import video_bp
    from app.routes.notes_routes import notes_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(video_bp)
    app.register_blueprint(notes_bp)

    # ── Health check endpoint ─────────────────────────────────
    @app.route("/api/health", methods=["GET"])
    def health():
        return {"status": "ok", "message": "AI Video Search API is running"}, 200

    # ── Initialise DB tables on first request ─────────────────
    with app.app_context():
        try:
            init_tables()
        except Exception as e:
            print(f"[App] DB init warning: {e}")

    return app
