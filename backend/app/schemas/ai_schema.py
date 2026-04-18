from datetime import datetime

from pydantic import BaseModel, Field


class ResumeReviewContent(BaseModel):
    summary: str = Field(min_length=10)
    strengths: list[str]
    weaknesses: list[str]
    suggestions: list[str]
    score: int = Field(ge=0, le=100)


class ResumeReviewResponse(BaseModel):
    id: str
    user_id: str
    resume_id: str
    report_type: str
    content: ResumeReviewContent
    created_at: datetime | None = None
    updated_at: datetime | None = None


class SkillGapContent(BaseModel):
    target_role: str = Field(min_length=2)
    summary: str = Field(min_length=10)
    matched_skills: list[str]
    missing_skills: list[str]
    priority_skills: list[str]
    next_steps: list[str]
    readiness_score: int = Field(ge=0, le=100)


class SkillGapResponse(BaseModel):
    id: str
    user_id: str
    resume_id: str
    report_type: str
    content: SkillGapContent
    created_at: datetime | None = None
    updated_at: datetime | None = None


class RoadmapWeek(BaseModel):
    week_number: int = Field(ge=1, le=8)
    title: str = Field(min_length=2)
    goals: list[str]
    tasks: list[str]
    project_suggestion: str = Field(min_length=2)


class RoadmapContent(BaseModel):
    target_role: str = Field(min_length=2)
    summary: str = Field(min_length=10)
    duration_weeks: int = Field(ge=1, le=52)
    weeks: list[RoadmapWeek]


class RoadmapResponse(BaseModel):
    id: str
    user_id: str
    resume_id: str
    report_type: str
    content: RoadmapContent
    created_at: datetime | None = None
    updated_at: datetime | None = None