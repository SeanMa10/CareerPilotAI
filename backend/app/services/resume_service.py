from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, status

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
UPLOADS_ROOT = Path("uploads")
RESUMES_ROOT = UPLOADS_ROOT / "resumes"


def validate_pdf_upload(filename: str, file_bytes: bytes) -> None:
    if not filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing file name",
        )

    if not filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are allowed",
        )

    if not file_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty",
        )

    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File is too large. Maximum size is 5MB",
        )


def ensure_user_resume_dir(user_id: str) -> Path:
    user_dir = RESUMES_ROOT / user_id
    user_dir.mkdir(parents=True, exist_ok=True)
    return user_dir


def save_resume_file(user_id: str, original_filename: str, file_bytes: bytes) -> tuple[str, str]:
    user_dir = ensure_user_resume_dir(user_id)
    suffix = Path(original_filename).suffix.lower() or ".pdf"
    stored_filename = f"{uuid4().hex}{suffix}"
    file_path = user_dir / stored_filename

    file_path.write_bytes(file_bytes)

    return stored_filename, str(file_path)


def remove_file_if_exists(file_path: str | None) -> None:
    if not file_path:
        return

    path = Path(file_path)

    if path.exists():
        path.unlink()