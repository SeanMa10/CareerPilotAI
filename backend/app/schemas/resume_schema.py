from datetime import datetime

from pydantic import BaseModel


class ResumeResponse(BaseModel):
    id: str
    user_id: str
    original_filename: str
    content_type: str
    size_bytes: int
    page_count: int
    extracted_text: str
    preview_text: str
    uploaded_at: datetime | None = None
    updated_at: datetime | None = None