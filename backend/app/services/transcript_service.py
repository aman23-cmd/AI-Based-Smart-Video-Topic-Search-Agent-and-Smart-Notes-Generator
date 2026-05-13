"""
Transcript service — semantic search within video transcripts.
Uses sentence-transformers to encode segments and the query,
then ranks by cosine similarity.
"""

import numpy as np
from app.config import Config

# Lazy-loaded model to avoid import-time download
_model = None


def _get_model():
    """Load the sentence-transformer model once."""
    global _model
    if _model is None:
        try:
            from sentence_transformers import SentenceTransformer
            _model = SentenceTransformer(Config.EMBEDDING_MODEL)
            print(f"[Semantic] Loaded model: {Config.EMBEDDING_MODEL}")
        except Exception as e:
            print(f"[Semantic] Model load failed: {e} — falling back to keyword search")
            _model = "FALLBACK"
    return _model


def _cosine_similarity(a, b):
    """Compute cosine similarity between two vectors."""
    dot = np.dot(a, b)
    norm = np.linalg.norm(a) * np.linalg.norm(b)
    return float(dot / norm) if norm > 0 else 0.0


def _keyword_search(query, segments, top_k=10):
    """Simple keyword-based fallback search."""
    query_lower = query.lower()
    query_words = set(query_lower.split())

    scored = []
    for seg in segments:
        text_lower = seg["text"].lower()
        # Count how many query words appear in the segment
        hits = sum(1 for w in query_words if w in text_lower)
        if hits > 0:
            score = hits / len(query_words)
            scored.append({
                "text": seg["text"],
                "start": seg["start"],
                "duration": seg.get("duration", 0),
                "end": seg["start"] + seg.get("duration", 0),
                "similarity": round(score, 4),
            })

    scored.sort(key=lambda x: x["similarity"], reverse=True)
    return scored[:top_k]


def search_transcript(query, segments, top_k=10):
    """
    Search transcript segments for a topic.

    Uses semantic similarity when the embedding model is available,
    falls back to keyword matching otherwise.

    Args:
        query:    User search string (e.g. "Binary Search")
        segments: List of {text, start, duration} dicts
        top_k:    Number of results to return

    Returns:
        list of {text, start, end, duration, similarity}
    """
    model = _get_model()

    # Fallback to keyword search if model didn't load
    if model == "FALLBACK" or model is None:
        return _keyword_search(query, segments, top_k)

    try:
        # Group nearby segments for better context (chunks of ~3 segments)
        chunk_size = 3
        chunks = []
        for i in range(0, len(segments), chunk_size):
            group = segments[i : i + chunk_size]
            combined_text = " ".join(s["text"] for s in group)
            chunks.append({
                "text": combined_text,
                "start": group[0]["start"],
                "end": group[-1]["start"] + group[-1].get("duration", 0),
                "duration": sum(s.get("duration", 0) for s in group),
            })

        # Encode
        texts = [c["text"] for c in chunks]
        query_embedding = model.encode(query, convert_to_numpy=True)
        segment_embeddings = model.encode(texts, convert_to_numpy=True)

        # Compute similarities
        results = []
        for idx, emb in enumerate(segment_embeddings):
            sim = _cosine_similarity(query_embedding, emb)
            results.append({
                "text": chunks[idx]["text"],
                "start": chunks[idx]["start"],
                "end": chunks[idx]["end"],
                "duration": chunks[idx]["duration"],
                "similarity": round(sim, 4),
            })

        results.sort(key=lambda x: x["similarity"], reverse=True)
        return results[:top_k]

    except Exception as e:
        print(f"[Semantic] Search error: {e} — falling back to keyword search")
        return _keyword_search(query, segments, top_k)
