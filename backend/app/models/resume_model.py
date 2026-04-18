from datetime import datetime, timezone


def build_resume_document(
    user_id,
    original_filename: str,
    stored_filename: str,
    file_path: str,
    content_type: str,
    size_bytes: int,
    page_count: int,
    extracted_text: str,
) -> dict:
    now = datetime.now(timezone.utc)

    return {
        "user_id": user_id,
        "original_filename": original_filename,
        "stored_filename": stored_filename,
        "file_path": file_path,
        "content_type": content_type,
        "size_bytes": size_bytes,
        "page_count": page_count,
        "extracted_text": extracted_text,
        "uploaded_at": now,
        "updated_at": now,
    }


def serialize_resume(resume_doc: dict) -> dict:
    extracted_text = resume_doc.get("extracted_text", "") or ""

    return {
        "id": str(resume_doc["_id"]),
        "user_id": str(resume_doc["user_id"]),
        "original_filename": resume_doc.get("original_filename", ""),
        "content_type": resume_doc.get("content_type", "application/pdf"),
        "size_bytes": resume_doc.get("size_bytes", 0),
        "page_count": resume_doc.get("page_count", 0),
        "extracted_text": extracted_text,
        "preview_text": extracted_text[:1500],
        "uploaded_at": resume_doc.get("uploaded_at"),
        "updated_at": resume_doc.get("updated_at"),
    }