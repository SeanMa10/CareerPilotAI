from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.database import get_database
from app.dependencies.auth_dependency import get_current_user_document
from app.models.ai_report_model import serialize_ai_report
from app.schemas.ai_schema import ResumeReviewResponse, RoadmapResponse, SkillGapResponse
from app.services.ai_service import (
    generate_resume_review,
    generate_roadmap,
    generate_skill_gap_analysis,
)
from app.dependencies.rate_limit import rate_limit
from app.services.access_service import mark_feature_use, require_feature_access

router = APIRouter()


@router.post(
    "/resume-review",
    response_model=ResumeReviewResponse,
    dependencies=[Depends(rate_limit("ai_resume_review", 5, 600))],
)
def analyze_resume(current_user_doc=Depends(get_current_user_document)):
    db = get_database()
    user_id = current_user_doc["_id"]

    require_feature_access(current_user_doc, "resume_review")
    resume_doc = db.resumes.find_one({"user_id": user_id})

    if not resume_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No resume uploaded yet",
        )

    extracted_text = resume_doc.get("extracted_text", "").strip()

    if not extracted_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resume text is empty, cannot analyze",
        )

    review_content = generate_resume_review(
        user_doc=current_user_doc,
        resume_text=extracted_text,
    )

    now = datetime.now(timezone.utc)

    db.ai_reports.update_one(
        {
            "user_id": user_id,
            "report_type": "resume_review",
        },
        {
            "$set": {
                "user_id": user_id,
                "resume_id": resume_doc["_id"],
                "report_type": "resume_review",
                "content": review_content,
                "updated_at": now,
            },
            "$setOnInsert": {
                "created_at": now,
            },
        },
        upsert=True,
    )

    saved_report = db.ai_reports.find_one(
        {
            "user_id": user_id,
            "report_type": "resume_review",
        }
    )
    mark_feature_use(db, user_id, "resume_review")
    return serialize_ai_report(saved_report)


@router.get("/resume-review/latest", response_model=ResumeReviewResponse)
def get_latest_resume_review(current_user_doc=Depends(get_current_user_document)):
    db = get_database()

    report_doc = db.ai_reports.find_one(
        {
            "user_id": current_user_doc["_id"],
            "report_type": "resume_review",
        }
    )

    if not report_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No AI resume review found yet",
        )

    return serialize_ai_report(report_doc)


@router.post(
    "/skill-gap",
    response_model=SkillGapResponse,
    dependencies=[Depends(rate_limit("ai_skill_gap", 5, 600))],
)
def analyze_skill_gap(current_user_doc=Depends(get_current_user_document)):
    db = get_database()
    user_id = current_user_doc["_id"]
    require_feature_access(current_user_doc, "skill_gap")
    target_role = (current_user_doc.get("target_role") or "").strip()

    if not target_role:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please set a target role in your profile before running skill gap analysis",
        )

    resume_doc = db.resumes.find_one({"user_id": user_id})

    if not resume_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No resume uploaded yet",
        )

    extracted_text = resume_doc.get("extracted_text", "").strip()

    if not extracted_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resume text is empty, cannot analyze",
        )

    skill_gap_content = generate_skill_gap_analysis(
        user_doc=current_user_doc,
        resume_text=extracted_text,
    )

    now = datetime.now(timezone.utc)

    db.ai_reports.update_one(
        {
            "user_id": user_id,
            "report_type": "skill_gap",
        },
        {
            "$set": {
                "user_id": user_id,
                "resume_id": resume_doc["_id"],
                "report_type": "skill_gap",
                "content": skill_gap_content,
                "updated_at": now,
            },
            "$setOnInsert": {
                "created_at": now,
            },
        },
        upsert=True,
    )

    saved_report = db.ai_reports.find_one(
        {
            "user_id": user_id,
            "report_type": "skill_gap",
        }
    )
    mark_feature_use(db, user_id, "skill_gap")
    return serialize_ai_report(saved_report)


@router.get("/skill-gap/latest", response_model=SkillGapResponse)
def get_latest_skill_gap(current_user_doc=Depends(get_current_user_document)):
    db = get_database()

    report_doc = db.ai_reports.find_one(
        {
            "user_id": current_user_doc["_id"],
            "report_type": "skill_gap",
        }
    )

    if not report_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No AI skill gap analysis found yet",
        )

    return serialize_ai_report(report_doc)


@router.post(
    "/generate-roadmap",
    response_model=RoadmapResponse,
    dependencies=[Depends(rate_limit("ai_roadmap", 5, 600))],
)
def create_roadmap(current_user_doc=Depends(get_current_user_document)):
    db = get_database()
    user_id = current_user_doc["_id"]
    require_feature_access(current_user_doc, "roadmap")
    target_role = (current_user_doc.get("target_role") or "").strip()

    if not target_role:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please set a target role in your profile before generating a roadmap",
        )

    resume_doc = db.resumes.find_one({"user_id": user_id})

    if not resume_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No resume uploaded yet",
        )

    extracted_text = resume_doc.get("extracted_text", "").strip()

    if not extracted_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resume text is empty, cannot generate roadmap",
        )

    skill_gap_doc = db.ai_reports.find_one(
        {
            "user_id": user_id,
            "report_type": "skill_gap",
        }
    )

    skill_gap_content = skill_gap_doc.get("content") if skill_gap_doc else None

    roadmap_content = generate_roadmap(
        user_doc=current_user_doc,
        resume_text=extracted_text,
        skill_gap_content=skill_gap_content,
    )

    now = datetime.now(timezone.utc)

    db.ai_reports.update_one(
        {
            "user_id": user_id,
            "report_type": "roadmap",
        },
        {
            "$set": {
                "user_id": user_id,
                "resume_id": resume_doc["_id"],
                "report_type": "roadmap",
                "content": roadmap_content,
                "updated_at": now,
            },
            "$setOnInsert": {
                "created_at": now,
            },
        },
        upsert=True,
    )

    saved_report = db.ai_reports.find_one(
        {
            "user_id": user_id,
            "report_type": "roadmap",
        }
    )
    mark_feature_use(db, user_id, "roadmap")
    return serialize_ai_report(saved_report)


@router.get("/roadmap/latest", response_model=RoadmapResponse)
def get_latest_roadmap(current_user_doc=Depends(get_current_user_document)):
    db = get_database()

    report_doc = db.ai_reports.find_one(
        {
            "user_id": current_user_doc["_id"],
            "report_type": "roadmap",
        }
    )

    if not report_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No AI roadmap found yet",
        )

    return serialize_ai_report(report_doc)