"""
AI service — unified interface for OpenAI and Ollama.
Handles note generation, topic extraction, and summarization.
"""

import json
import requests
from app.config import Config

# ---------------------------------------------------------------------------
# Provider: OpenAI
# ---------------------------------------------------------------------------

def _openai_chat(system_prompt, user_prompt, max_tokens=2000):
    """Call OpenAI Chat Completions API."""
    from openai import OpenAI

    client = OpenAI(api_key=Config.OPENAI_API_KEY)
    response = client.chat.completions.create(
        model=Config.OPENAI_MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        max_tokens=max_tokens,
        temperature=0.4,
    )
    return response.choices[0].message.content.strip()


# ---------------------------------------------------------------------------
# Provider: Ollama (local LLM)
# ---------------------------------------------------------------------------

def _ollama_chat(system_prompt, user_prompt, max_tokens=2000):
    """Call Ollama's local API."""
    url = f"{Config.OLLAMA_BASE_URL}/api/generate"
    payload = {
        "model": Config.OLLAMA_MODEL,
        "prompt": f"System: {system_prompt}\n\nUser: {user_prompt}",
        "stream": False,
        "options": {"num_predict": max_tokens, "temperature": 0.4},
    }
    resp = requests.post(url, json=payload, timeout=120)
    resp.raise_for_status()
    return resp.json().get("response", "").strip()


# ---------------------------------------------------------------------------
# Dispatcher
# ---------------------------------------------------------------------------

def _chat(system_prompt, user_prompt, max_tokens=2000):
    """Route to the configured AI provider."""
    if Config.AI_PROVIDER == "ollama":
        return _ollama_chat(system_prompt, user_prompt, max_tokens)
    return _openai_chat(system_prompt, user_prompt, max_tokens)


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def generate_notes(transcript_text, topic, note_type="bullet"):
    """
    Generate study notes from a transcript.

    Args:
        transcript_text: Full transcript string
        topic:           Topic to focus notes on
        note_type:       "bullet" | "short" | "exam" | "concepts" | "questions"

    Returns:
        dict with keys: notes_content, key_concepts, questions
    """
    type_instructions = {
        "bullet": "Create well-structured bullet-point notes.",
        "short": "Write a concise 200-word summary.",
        "exam": "Prepare exam-revision notes with key definitions and important points.",
        "concepts": "List and explain the key concepts covered.",
        "questions": "Generate 10 practice questions with brief answers.",
    }

    instruction = type_instructions.get(note_type, type_instructions["bullet"])

    system_prompt = (
        "You are an expert study-notes generator for students. "
        "You produce clear, accurate, and well-organised notes. "
        "Always use markdown formatting."
    )

    user_prompt = (
        f"Topic: {topic}\n\n"
        f"Instruction: {instruction}\n\n"
        f"Transcript:\n{transcript_text[:8000]}\n\n"
        "Also provide:\n"
        '1. A JSON array of key concepts (max 8) under the label KEY_CONCEPTS.\n'
        '2. A JSON array of 5 practice questions under the label QUESTIONS.\n'
        "Place these at the very end after a line containing only '---JSON---'."
    )

    raw = _chat(system_prompt, user_prompt, max_tokens=3000)

    # Parse structured data from the response
    notes_content = raw
    key_concepts = []
    questions = []

    if "---JSON---" in raw:
        parts = raw.split("---JSON---", 1)
        notes_content = parts[0].strip()
        json_part = parts[1].strip()

        try:
            # Try to extract JSON arrays
            import re
            concepts_match = re.search(
                r"KEY_CONCEPTS\s*[:=]\s*(\[.*?\])", json_part, re.DOTALL
            )
            questions_match = re.search(
                r"QUESTIONS\s*[:=]\s*(\[.*?\])", json_part, re.DOTALL
            )
            if concepts_match:
                key_concepts = json.loads(concepts_match.group(1))
            if questions_match:
                questions = json.loads(questions_match.group(1))
        except (json.JSONDecodeError, AttributeError):
            pass

    return {
        "notes_content": notes_content,
        "key_concepts": key_concepts,
        "questions": questions,
    }


def extract_topics(transcript_text):
    """
    Extract the main topics discussed in a transcript.

    Returns:
        list of topic strings
    """
    system_prompt = "You extract the main topics from educational transcripts."
    user_prompt = (
        "Extract the top 10 main topics from this transcript. "
        "Return them as a JSON array of strings.\n\n"
        f"Transcript:\n{transcript_text[:6000]}"
    )

    raw = _chat(system_prompt, user_prompt, max_tokens=500)

    try:
        # Find JSON array in response
        import re
        match = re.search(r"\[.*\]", raw, re.DOTALL)
        if match:
            return json.loads(match.group(0))
    except (json.JSONDecodeError, AttributeError):
        pass

    return []
