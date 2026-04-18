from datetime import datetime, timezone

from fastapi import HTTPException, status

FEATURE_LABELS = {
    "resume_review": "Resume Review",
    "skill_gap": "Skill Gap Analysis",
    "roadmap": "Roadmap Generator",
    "interview_session": "Interview Coach",
}

FREE_LIMITS = {
    "resume_review": 1,
    "skill_gap": 1,
    "roadmap": 1,
    "interview_session": 1,
}


def get_feature_usage_count(user_doc: dict, feature_key: str) -> int:
    feature_usage = user_doc.get("feature_usage", {})
    feature_data = feature_usage.get(feature_key, {})
    return int(feature_data.get("count", 0) or 0)


def require_feature_access(user_doc: dict, feature_key: str) -> None:
    if feature_key not in FREE_LIMITS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unknown premium feature",
        )

    used_count = get_feature_usage_count(user_doc, feature_key)
    free_limit = FREE_LIMITS[feature_key]

    if used_count < free_limit:
        return

    raise HTTPException(
        status_code=status.HTTP_402_PAYMENT_REQUIRED,
        detail={
            "code": "FEATURE_LOCKED",
            "feature_key": feature_key,
            "used": used_count,
            "free_limit": free_limit,
            "message": f"You already used your free access for {FEATURE_LABELS[feature_key]}. Paid plans will be available soon.",
        },
    )


def mark_feature_use(db, user_id, feature_key: str) -> None:
    now = datetime.now(timezone.utc)

    db.users.update_one(
        {"_id": user_id},
        {
            "$inc": {
                f"feature_usage.{feature_key}.count": 1,
            },
            "$set": {
                f"feature_usage.{feature_key}.last_used_at": now,
            },
        },
    )


def get_access_status_payload(user_doc: dict) -> dict:
    features = {}

    for feature_key, free_limit in FREE_LIMITS.items():
        used = get_feature_usage_count(user_doc, feature_key)
        remaining = max(free_limit - used, 0)

        features[feature_key] = {
            "used": used,
            "free_limit": free_limit,
            "remaining_free_uses": remaining,
            "locked": used >= free_limit,
        }

    return {
        "payments_enabled": False,
        "future_plan_price_usd": 1,
        "features": features,
    }