from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from app.core.database import get_database
from app.dependencies.auth_dependency import get_current_user_document
from app.models.interview_model import (
    build_interview_message,
    build_interview_session,
    serialize_interview_session,
    serialize_interview_summary,
)
from app.schemas.interview_schema import (
    InterviewReplyRequest,
    InterviewSessionResponse,
    InterviewSessionSummary,
    InterviewStartRequest,
)
from app.services.interview_service import (
    generate_interview_feedback,
    generate_interview_opening,
)
from app.dependencies.rate_limit import rate_limit
from app.services.access_service import mark_feature_use, require_feature_access

router = APIRouter()


def parse_object_id(value: str) -> ObjectId:
    try:
        return ObjectId(value)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid session id",
        )


@router.post(
    "/start",
    response_model=InterviewSessionResponse,
    dependencies=[Depends(rate_limit("interview_start", 8, 600))],
)
def start_interview(
    payload: InterviewStartRequest,
    current_user_doc=Depends(get_current_user_document),
):
    db = get_database()
    user_id = current_user_doc["_id"]
    require_feature_access(current_user_doc, "interview_session")
    role = (payload.role or current_user_doc.get("target_role") or "").strip()

    if not role:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please set a target role in your profile or provide a role before starting an interview",
        )

    resume_doc = db.resumes.find_one({"user_id": user_id})
    resume_text = resume_doc.get("extracted_text", "").strip() if resume_doc else ""

    opening = generate_interview_opening(
        user_doc=current_user_doc,
        role=role,
        resume_text=resume_text,
    )

    messages = [
        build_interview_message(
            sender="ai",
            message_type="intro",
            text=opening["intro_message"],
        ),
        build_interview_message(
            sender="ai",
            message_type="question",
            text=opening["first_question"],
        ),
    ]

    session_doc = build_interview_session(
        user_id=user_id,
        role=role,
        messages=messages,
    )

    result = db.interview_sessions.insert_one(session_doc)
    saved_session = db.interview_sessions.find_one({"_id": result.inserted_id})
    mark_feature_use(db, user_id, "interview_session")
    return serialize_interview_session(saved_session)


@router.post(
    "/reply",
    response_model=InterviewSessionResponse,
    dependencies=[Depends(rate_limit("interview_reply", 20, 600))],
)
def reply_interview(
    payload: InterviewReplyRequest,
    current_user_doc=Depends(get_current_user_document),
):
    db = get_database()
    session_id = parse_object_id(payload.session_id)

    session_doc = db.interview_sessions.find_one(
        {
            "_id": session_id,
            "user_id": current_user_doc["_id"],
        }
    )

    if not session_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview session not found",
        )
    
    existing_user_answers = [
        message
        for message in session_doc.get("messages", [])
        if message.get("sender") == "user" and message.get("type") == "answer"
    ]

    if len(existing_user_answers) >= 1:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail={
                "code": "FEATURE_LOCKED",
                "feature_key": "interview_session",
                "used": 1,
                "free_limit": 1,
                "message": "You already used your free interview answer. Paid plans will be available soon.",
            },
        )

    answer_text = payload.answer.strip()

    user_message = build_interview_message(
        sender="user",
        message_type="answer",
        text=answer_text,
    )

    session_doc["messages"].append(user_message)

    resume_doc = db.resumes.find_one({"user_id": current_user_doc["_id"]})
    resume_text = resume_doc.get("extracted_text", "").strip() if resume_doc else ""

    feedback = generate_interview_feedback(
        user_doc=current_user_doc,
        role=session_doc["role"],
        resume_text=resume_text,
        messages=session_doc["messages"],
        latest_answer=answer_text,
    )

    feedback_message = build_interview_message(
        sender="ai",
        message_type="feedback",
        text=feedback["feedback_summary"],
        score=feedback["answer_score"],
        strengths=feedback["strengths"],
        improvements=feedback["improvements"],
    )

    next_question_message = build_interview_message(
        sender="ai",
        message_type="question",
        text=feedback["next_question"],
    )

    session_doc["messages"].extend([feedback_message, next_question_message])

    db.interview_sessions.update_one(
        {"_id": session_doc["_id"]},
        {
            "$set": {
                "messages": session_doc["messages"],
                "updated_at": datetime.now(timezone.utc),
            }
        },
    )

    updated_session = db.interview_sessions.find_one({"_id": session_doc["_id"]})

    return serialize_interview_session(updated_session)


@router.get("/history", response_model=list[InterviewSessionSummary])
def get_interview_history(current_user_doc=Depends(get_current_user_document)):
    db = get_database()

    sessions = db.interview_sessions.find(
        {"user_id": current_user_doc["_id"]}
    ).sort("updated_at", -1)

    return [serialize_interview_summary(session) for session in sessions]


@router.get("/{session_id}", response_model=InterviewSessionResponse)
def get_interview_session(
    session_id: str,
    current_user_doc=Depends(get_current_user_document),
):
    db = get_database()
    object_id = parse_object_id(session_id)

    session_doc = db.interview_sessions.find_one(
        {
            "_id": object_id,
            "user_id": current_user_doc["_id"],
        }
    )

    if not session_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview session not found",
        )

    return serialize_interview_session(session_doc)