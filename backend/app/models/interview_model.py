from datetime import datetime, timezone


def build_interview_message(
    sender: str,
    message_type: str,
    text: str,
    score: int | None = None,
    strengths: list[str] | None = None,
    improvements: list[str] | None = None,
) -> dict:
    return {
        "sender": sender,
        "type": message_type,
        "text": text,
        "score": score,
        "strengths": strengths or [],
        "improvements": improvements or [],
        "created_at": datetime.now(timezone.utc),
    }


def build_interview_session(user_id, role: str, messages: list[dict]) -> dict:
    now = datetime.now(timezone.utc)

    return {
        "user_id": user_id,
        "role": role,
        "status": "active",
        "messages": messages,
        "created_at": now,
        "updated_at": now,
    }


def serialize_interview_message(message: dict) -> dict:
    return {
        "sender": message.get("sender", ""),
        "type": message.get("type", ""),
        "text": message.get("text", ""),
        "score": message.get("score"),
        "strengths": message.get("strengths", []),
        "improvements": message.get("improvements", []),
        "created_at": message.get("created_at"),
    }


def serialize_interview_session(session_doc: dict) -> dict:
    return {
        "id": str(session_doc["_id"]),
        "user_id": str(session_doc["user_id"]),
        "role": session_doc.get("role", ""),
        "status": session_doc.get("status", "active"),
        "messages": [
            serialize_interview_message(message)
            for message in session_doc.get("messages", [])
        ],
        "created_at": session_doc.get("created_at"),
        "updated_at": session_doc.get("updated_at"),
    }


def serialize_interview_summary(session_doc: dict) -> dict:
    return {
        "id": str(session_doc["_id"]),
        "user_id": str(session_doc["user_id"]),
        "role": session_doc.get("role", ""),
        "status": session_doc.get("status", "active"),
        "message_count": len(session_doc.get("messages", [])),
        "created_at": session_doc.get("created_at"),
        "updated_at": session_doc.get("updated_at"),
    }