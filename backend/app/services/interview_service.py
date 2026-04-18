import json

from fastapi import HTTPException, status
from openai import OpenAI

from app.core.config import settings
from app.schemas.interview_schema import (
    InterviewFeedbackContent,
    InterviewOpeningContent,
)


def _get_openai_client() -> OpenAI:
    if not settings.OPENAI_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="OPENAI_API_KEY is missing in backend environment variables",
        )

    return OpenAI(api_key=settings.OPENAI_API_KEY)


def _messages_to_text(messages: list[dict]) -> str:
    lines: list[str] = []

    for message in messages[-12:]:
        sender = message.get("sender", "").upper()
        message_type = message.get("type", "").upper()
        text = message.get("text", "")
        lines.append(f"{sender} {message_type}: {text}")

        strengths = message.get("strengths", [])
        improvements = message.get("improvements", [])
        score = message.get("score")

        if score is not None:
            lines.append(f"SCORE: {score}")

        if strengths:
            lines.append("STRENGTHS: " + ", ".join(strengths))

        if improvements:
            lines.append("IMPROVEMENTS: " + ", ".join(improvements))

    return "\n".join(lines)


def build_interview_opening_prompt(user_doc: dict, role: str, resume_text: str) -> str:
    full_name = user_doc.get("full_name", "")
    experience_level = user_doc.get("experience_level", "")
    skills = ", ".join(user_doc.get("skills", []))
    bio = user_doc.get("bio", "")

    return f"""
You are an expert technical interviewer for internship and junior software engineering candidates.

Return ONLY valid JSON with this exact shape:
{{
  "intro_message": "short welcome message",
  "first_question": "one interview question"
}}

Rules:
- keep the intro professional and encouraging
- the first question should be appropriate for a {role} candidate
- adapt to the user's level and background
- ask exactly one question
- no markdown
- no text outside JSON

Candidate profile:
Full name: {full_name}
Experience level: {experience_level}
Target interview role: {role}
Skills: {skills}
Bio: {bio}

Resume text:
{resume_text}
""".strip()


def build_interview_feedback_prompt(
    user_doc: dict,
    role: str,
    resume_text: str,
    conversation_text: str,
    latest_answer: str,
) -> str:
    full_name = user_doc.get("full_name", "")
    experience_level = user_doc.get("experience_level", "")
    skills = ", ".join(user_doc.get("skills", []))
    bio = user_doc.get("bio", "")

    return f"""
You are an expert technical interviewer for internship and junior software engineering candidates.

You are evaluating the candidate's latest answer in an ongoing mock interview.

Return ONLY valid JSON with this exact shape:
{{
  "feedback_summary": "short paragraph",
  "strengths": ["point 1", "point 2", "point 3"],
  "improvements": ["point 1", "point 2", "point 3"],
  "answer_score": 78,
  "next_question": "one follow-up interview question"
}}

Rules:
- answer_score must be an integer between 0 and 100
- strengths should contain 2 to 4 concise items
- improvements should contain 2 to 4 concise items
- feedback should be practical and specific
- adapt to the user's level and target role
- the next question should logically continue the interview
- ask exactly one question
- do not use markdown
- do not include any text outside the JSON

Candidate profile:
Full name: {full_name}
Experience level: {experience_level}
Target interview role: {role}
Skills: {skills}
Bio: {bio}

Resume text:
{resume_text}

Interview so far:
{conversation_text}

Latest candidate answer:
{latest_answer}
""".strip()


def generate_interview_opening(user_doc: dict, role: str, resume_text: str) -> dict:
    client = _get_openai_client()

    try:
        response = client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            response_format={"type": "json_object"},
            temperature=0.3,
            messages=[
                {
                    "role": "system",
                    "content": "You are a precise technical interviewer. Return only valid JSON.",
                },
                {
                    "role": "user",
                    "content": build_interview_opening_prompt(user_doc, role, resume_text),
                },
            ],
        )

        raw_content = response.choices[0].message.content or "{}"
        parsed = json.loads(raw_content)
        validated = InterviewOpeningContent.model_validate(parsed)

        return validated.model_dump()

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate interview opening: {str(exc)}",
        )


def generate_interview_feedback(
    user_doc: dict,
    role: str,
    resume_text: str,
    messages: list[dict],
    latest_answer: str,
) -> dict:
    client = _get_openai_client()
    conversation_text = _messages_to_text(messages)

    try:
        response = client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            response_format={"type": "json_object"},
            temperature=0.3,
            messages=[
                {
                    "role": "system",
                    "content": "You are a precise technical interviewer. Return only valid JSON.",
                },
                {
                    "role": "user",
                    "content": build_interview_feedback_prompt(
                        user_doc=user_doc,
                        role=role,
                        resume_text=resume_text,
                        conversation_text=conversation_text,
                        latest_answer=latest_answer,
                    ),
                },
            ],
        )

        raw_content = response.choices[0].message.content or "{}"
        parsed = json.loads(raw_content)
        validated = InterviewFeedbackContent.model_validate(parsed)

        return validated.model_dump()

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate interview feedback: {str(exc)}",
        )