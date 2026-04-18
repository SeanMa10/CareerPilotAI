from datetime import datetime

from pydantic import BaseModel, Field


class InterviewOpeningContent(BaseModel):
    intro_message: str = Field(min_length=10)
    first_question: str = Field(min_length=5)


class InterviewFeedbackContent(BaseModel):
    feedback_summary: str = Field(min_length=10)
    strengths: list[str]
    improvements: list[str]
    answer_score: int = Field(ge=0, le=100)
    next_question: str = Field(min_length=5)


class InterviewStartRequest(BaseModel):
    role: str | None = Field(default=None, max_length=100)


class InterviewReplyRequest(BaseModel):
    session_id: str
    answer: str = Field(min_length=2, max_length=4000)


class InterviewMessage(BaseModel):
    sender: str
    type: str
    text: str
    score: int | None = None
    strengths: list[str] = Field(default_factory=list)
    improvements: list[str] = Field(default_factory=list)
    created_at: datetime | None = None


class InterviewSessionResponse(BaseModel):
    id: str
    user_id: str
    role: str
    status: str
    messages: list[InterviewMessage]
    created_at: datetime | None = None
    updated_at: datetime | None = None


class InterviewSessionSummary(BaseModel):
    id: str
    user_id: str
    role: str
    status: str
    message_count: int
    created_at: datetime | None = None
    updated_at: datetime | None = None