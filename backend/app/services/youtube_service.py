"""
YouTube service — extracts transcripts from YouTube videos
using the youtube-transcript-api library.
"""

import re
from youtube_transcript_api import YouTubeTranscriptApi


def extract_video_id(url):
    """
    Parse a YouTube URL and return the 11-char video ID.
    Supports: youtube.com/watch?v=, youtu.be/, youtube.com/embed/, etc.
    """
    patterns = [
        r"(?:v=|\/v\/|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})",
        r"^([a-zA-Z0-9_-]{11})$",  # bare ID
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None


def get_transcript(video_url):
    """
    Fetch the transcript for a YouTube video.

    Args:
        video_url: YouTube URL or video ID

    Returns:
        dict with keys:
            video_id  (str)
            video_url (str)
            segments  (list of {text, start, duration})
            full_text (str) — all segments joined
    """
    video_id = extract_video_id(video_url)
    if not video_id:
        raise ValueError(f"Could not extract video ID from: {video_url}")

    try:
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)

        # Prefer manually created transcripts, fall back to auto-generated
        transcript = None
        try:
            transcript = transcript_list.find_manually_created_transcript(["en"])
        except Exception:
            try:
                transcript = transcript_list.find_generated_transcript(["en"])
            except Exception:
                # Try any available language
                for t in transcript_list:
                    transcript = t
                    break

        if transcript is None:
            raise ValueError("No transcript available for this video.")

        segments = transcript.fetch()

        # Normalise segment format
        normalised = []
        for seg in segments:
            normalised.append({
                "text": seg.get("text", seg.text if hasattr(seg, "text") else str(seg)),
                "start": float(seg.get("start", seg.start if hasattr(seg, "start") else 0)),
                "duration": float(seg.get("duration", seg.duration if hasattr(seg, "duration") else 0)),
            })

        full_text = " ".join(s["text"] for s in normalised)

        return {
            "video_id": video_id,
            "video_url": f"https://www.youtube.com/watch?v={video_id}",
            "segments": normalised,
            "full_text": full_text,
        }

    except Exception as e:
        raise ValueError(f"Transcript extraction failed: {str(e)}")
