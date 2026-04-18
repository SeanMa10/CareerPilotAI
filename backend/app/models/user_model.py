from datetime import datetime, timezone


def build_user_document(
    full_name: str,
    email: str,
    password_hash: str,
    legal_acceptance: dict,
) -> dict:
    now = datetime.now(timezone.utc)

    return {
        "full_name": full_name,
        "email": email,
        "password_hash": password_hash,
        "experience_level": "student",
        "target_role": "",
        "skills": [],
        "bio": "",
        "feature_usage": {},
        "legal": legal_acceptance,
        "created_at": now,
        "updated_at": now,
    }


def serialize_user(user_doc: dict) -> dict:
    return {
        "id": str(user_doc["_id"]),
        "full_name": user_doc.get("full_name", ""),
        "email": user_doc.get("email", ""),
        "experience_level": user_doc.get("experience_level"),
        "target_role": user_doc.get("target_role"),
        "skills": user_doc.get("skills", []),
        "bio": user_doc.get("bio", ""),
        "created_at": user_doc.get("created_at"),
        "updated_at": user_doc.get("updated_at"),
    }