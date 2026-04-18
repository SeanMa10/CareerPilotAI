from datetime import datetime

from pydantic import BaseModel, Field


class UserPublic(BaseModel):
    id: str
    full_name: str
    email: str
    experience_level: str | None = None
    target_role: str | None = None
    skills: list[str] = []
    bio: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None


class UpdateProfileRequest(BaseModel):
    full_name: str | None = Field(default=None, min_length=2, max_length=100)
    experience_level: str | None = Field(default=None, max_length=50)
    target_role: str | None = Field(default=None, max_length=100)
    skills: list[str] | None = None
    bio: str | None = Field(default=None, max_length=1000)