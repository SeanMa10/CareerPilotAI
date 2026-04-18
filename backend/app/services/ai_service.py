import json

from fastapi import HTTPException, status
from openai import OpenAI

from app.core.config import settings
from app.schemas.ai_schema import ResumeReviewContent, RoadmapContent, SkillGapContent


def _get_openai_client() -> OpenAI:
    if not settings.OPENAI_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="OPENAI_API_KEY is missing in backend environment variables",
        )

    return OpenAI(api_key=settings.OPENAI_API_KEY)


def build_resume_review_prompt(user_doc: dict, resume_text: str) -> str:
    full_name = user_doc.get("full_name", "")
    experience_level = user_doc.get("experience_level", "")
    target_role = user_doc.get("target_role", "")
    skills = ", ".join(user_doc.get("skills", []))
    bio = user_doc.get("bio", "")

    return f"""
You are an expert software engineering career coach and resume reviewer.

Analyze the following resume and return ONLY valid JSON with this exact shape:
{{
  "summary": "short paragraph",
  "strengths": ["point 1", "point 2", "point 3"],
  "weaknesses": ["point 1", "point 2", "point 3"],
  "suggestions": ["point 1", "point 2", "point 3"],
  "score": 82
}}

Rules:
- score must be an integer between 0 and 100
- strengths, weaknesses, suggestions must each contain 3 to 6 concise items
- be practical and specific
- focus on software engineering internships / junior roles
- mention resume clarity, impact, missing details, and portfolio strength where relevant
- do not include markdown
- do not include any text outside the JSON

User profile:
Full name: {full_name}
Experience level: {experience_level}
Target role: {target_role}
Skills: {skills}
Bio: {bio}

Resume text:
{resume_text}
""".strip()


def build_skill_gap_prompt(user_doc: dict, resume_text: str) -> str:
    full_name = user_doc.get("full_name", "")
    experience_level = user_doc.get("experience_level", "")
    target_role = user_doc.get("target_role", "")
    skills = ", ".join(user_doc.get("skills", []))
    bio = user_doc.get("bio", "")

    return f"""
You are an expert software engineering career coach.

Analyze the user's current profile and resume against the target role and return ONLY valid JSON with this exact shape:
{{
  "target_role": "{target_role}",
  "summary": "short paragraph",
  "matched_skills": ["skill 1", "skill 2", "skill 3"],
  "missing_skills": ["skill 1", "skill 2", "skill 3"],
  "priority_skills": ["skill 1", "skill 2", "skill 3"],
  "next_steps": ["step 1", "step 2", "step 3"],
  "readiness_score": 72
}}

Rules:
- readiness_score must be an integer between 0 and 100
- matched_skills, missing_skills, priority_skills, next_steps should each contain 3 to 6 concise items
- focus on the target role and the user's current level
- prioritize practical hiring-relevant skills for internships / junior roles
- missing_skills should only include skills not clearly demonstrated already
- priority_skills should be the most important subset of the missing skills
- do not include markdown
- do not include any text outside the JSON

User profile:
Full name: {full_name}
Experience level: {experience_level}
Target role: {target_role}
Skills from profile: {skills}
Bio: {bio}

Resume text:
{resume_text}
""".strip()


def build_roadmap_prompt(user_doc: dict, resume_text: str, skill_gap_content: dict | None) -> str:
    full_name = user_doc.get("full_name", "")
    experience_level = user_doc.get("experience_level", "")
    target_role = user_doc.get("target_role", "")
    skills = ", ".join(user_doc.get("skills", []))
    bio = user_doc.get("bio", "")

    skill_gap_summary = skill_gap_content.get("summary", "") if skill_gap_content else ""
    matched_skills = ", ".join(skill_gap_content.get("matched_skills", [])) if skill_gap_content else ""
    missing_skills = ", ".join(skill_gap_content.get("missing_skills", [])) if skill_gap_content else ""
    priority_skills = ", ".join(skill_gap_content.get("priority_skills", [])) if skill_gap_content else ""

    return f"""
You are an expert software engineering career coach.

Create a practical 8-week roadmap for a student / junior candidate targeting a software role.

Return ONLY valid JSON with this exact shape:
{{
  "target_role": "{target_role}",
  "summary": "short paragraph",
  "duration_weeks": 8,
  "weeks": [
    {{
      "week_number": 1,
      "title": "week title",
      "goals": ["goal 1", "goal 2"],
      "tasks": ["task 1", "task 2", "task 3"],
      "project_suggestion": "small practical project suggestion"
    }}
  ]
}}

Rules:
- return exactly 8 weeks
- week_number must go from 1 to 8
- goals should have 2 to 4 concise items
- tasks should have 3 to 6 concise practical items
- project_suggestion must be specific and realistic
- adapt the roadmap to the user's target role and current level
- prioritize the most important missing skills first
- focus on internship / junior readiness
- include learning, building, and resume/portfolio improvement
- do not include markdown
- do not include any text outside the JSON

User profile:
Full name: {full_name}
Experience level: {experience_level}
Target role: {target_role}
Skills from profile: {skills}
Bio: {bio}

Skill gap summary:
{skill_gap_summary}

Matched skills:
{matched_skills}

Missing skills:
{missing_skills}

Priority skills:
{priority_skills}

Resume text:
{resume_text}
""".strip()


def generate_resume_review(user_doc: dict, resume_text: str) -> dict:
    client = _get_openai_client()

    try:
        response = client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            response_format={"type": "json_object"},
            temperature=0.2,
            messages=[
                {
                    "role": "system",
                    "content": "You are a precise resume reviewer. Return only valid JSON.",
                },
                {
                    "role": "user",
                    "content": build_resume_review_prompt(user_doc, resume_text),
                },
            ],
        )

        raw_content = response.choices[0].message.content or "{}"
        parsed = json.loads(raw_content)
        validated = ResumeReviewContent.model_validate(parsed)

        return validated.model_dump()

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate AI resume review: {str(exc)}",
        )


def generate_skill_gap_analysis(user_doc: dict, resume_text: str) -> dict:
    client = _get_openai_client()

    try:
        response = client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            response_format={"type": "json_object"},
            temperature=0.2,
            messages=[
                {
                    "role": "system",
                    "content": "You are a precise software engineering career coach. Return only valid JSON.",
                },
                {
                    "role": "user",
                    "content": build_skill_gap_prompt(user_doc, resume_text),
                },
            ],
        )

        raw_content = response.choices[0].message.content or "{}"
        parsed = json.loads(raw_content)
        validated = SkillGapContent.model_validate(parsed)

        return validated.model_dump()

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate AI skill gap analysis: {str(exc)}",
        )


def generate_roadmap(user_doc: dict, resume_text: str, skill_gap_content: dict | None) -> dict:
    client = _get_openai_client()

    try:
        response = client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            response_format={"type": "json_object"},
            temperature=0.25,
            messages=[
                {
                    "role": "system",
                    "content": "You are a precise software engineering career coach. Return only valid JSON.",
                },
                {
                    "role": "user",
                    "content": build_roadmap_prompt(user_doc, resume_text, skill_gap_content),
                },
            ],
        )

        raw_content = response.choices[0].message.content or "{}"
        parsed = json.loads(raw_content)
        validated = RoadmapContent.model_validate(parsed)

        return validated.model_dump()

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate AI roadmap: {str(exc)}",
        )