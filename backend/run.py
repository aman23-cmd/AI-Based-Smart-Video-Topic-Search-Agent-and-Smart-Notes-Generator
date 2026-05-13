"""
Entry point — run the Flask development server.

Usage:
    python run.py
"""

from app import create_app

app = create_app()

if __name__ == "__main__":
    print("\n" + "=" * 55)
    print("  AI Video Search Agent — Backend API")
    print("  http://localhost:5000")
    print("  Health: http://localhost:5000/api/health")
    print("=" * 55 + "\n")
    app.run(host="0.0.0.0", port=5000, debug=True)
