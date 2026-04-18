from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from app.core.database import get_database
from app.dependencies.auth_dependency import get_current_user_document
from app.models.resume_model import build_resume_document, serialize_resume
from app.schemas.resume_schema import ResumeResponse
from app.services.resume_service import (
    remove_file_if_exists,
    save_resume_file,
    validate_pdf_upload,
)
from app.utils.pdf_parser import extract_text_from_pdf
from app.dependencies.rate_limit import rate_limit

router = APIRouter()


@router.post(
    "/upload",
    response_model=ResumeResponse,
    dependencies=[Depends(rate_limit("resume_upload", 10, 3600))],
)
async def upload_resume(
    file: UploadFile = File(...),
    current_user_doc=Depends(get_current_user_document),
):
    db = get_database()
    user_id = current_user_doc["_id"]

    file_bytes = await file.read()
    validate_pdf_upload(file.filename or "", file_bytes)

    existing_resume = db.resumes.find_one({"user_id": user_id})

    stored_filename, file_path = save_resume_file(
        user_id=str(user_id),
        original_filename=file.filename or "resume.pdf",
        file_bytes=file_bytes,
    )

    try:
        extracted_text, page_count = extract_text_from_pdf(file_path)
    except Exception:
        remove_file_if_exists(file_path)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to parse PDF file",
        )

    resume_doc = build_resume_document(
        user_id=user_id,
        original_filename=file.filename or "resume.pdf",
        stored_filename=stored_filename,
        file_path=file_path,
        content_type=file.content_type or "application/pdf",
        size_bytes=len(file_bytes),
        page_count=page_count,
        extracted_text=extracted_text,
    )

    db.resumes.update_one(
        {"user_id": user_id},
        {"$set": resume_doc},
        upsert=True,
    )

    updated_resume = db.resumes.find_one({"user_id": user_id})

    if existing_resume:
        remove_file_if_exists(existing_resume.get("file_path"))

    return serialize_resume(updated_resume)


@router.get("/my-resume", response_model=ResumeResponse)
def get_my_resume(current_user_doc=Depends(get_current_user_document)):
    db = get_database()
    resume_doc = db.resumes.find_one({"user_id": current_user_doc["_id"]})

    if not resume_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No resume uploaded yet",
        )

    return serialize_resume(resume_doc)