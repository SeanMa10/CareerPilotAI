from fastapi import APIRouter, Depends, HTTPException, Response, status

from app.core.database import get_database
from app.dependencies.auth_dependency import get_current_user_document
from app.services.export_service import build_pdf_filename, generate_ai_report_pdf

router = APIRouter()

ALLOWED_REPORT_TYPES = {"resume_review", "skill_gap", "roadmap"}


@router.get("/report/{report_type}")
def download_ai_report(
    report_type: str,
    current_user_doc=Depends(get_current_user_document),
):
    if report_type not in ALLOWED_REPORT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported report type",
        )

    db = get_database()

    report_doc = db.ai_reports.find_one(
        {
            "user_id": current_user_doc["_id"],
            "report_type": report_type,
        }
    )

    if not report_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found",
        )

    pdf_bytes = generate_ai_report_pdf(
        user_doc=current_user_doc,
        report_doc=report_doc,
    )

    filename = build_pdf_filename(report_type)

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        },
    )