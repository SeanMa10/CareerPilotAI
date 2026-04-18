from datetime import datetime
from html import escape
from io import BytesIO

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

REPORT_TYPE_TITLES = {
    "resume_review": "Resume Review Report",
    "skill_gap": "Skill Gap Analysis Report",
    "roadmap": "Career Roadmap Report",
}


def _build_styles():
    styles = getSampleStyleSheet()

    styles.add(
        ParagraphStyle(
            name="ReportTitle",
            parent=styles["Title"],
            fontName="Helvetica-Bold",
            fontSize=24,
            leading=30,
            textColor=colors.HexColor("#0f172a"),
            alignment=TA_CENTER,
            spaceAfter=18,
        )
    )

    styles.add(
        ParagraphStyle(
            name="SectionTitle",
            parent=styles["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=15,
            leading=20,
            textColor=colors.HexColor("#0f172a"),
            spaceBefore=10,
            spaceAfter=8,
        )
    )

    styles.add(
        ParagraphStyle(
            name="BodyTextCustom",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=10.5,
            leading=16,
            textColor=colors.HexColor("#1e293b"),
            spaceAfter=6,
        )
    )

    styles.add(
        ParagraphStyle(
            name="SmallMuted",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=9,
            leading=13,
            textColor=colors.HexColor("#475569"),
            alignment=TA_CENTER,
            spaceAfter=10,
        )
    )

    styles.add(
        ParagraphStyle(
            name="CardTitle",
            parent=styles["Heading3"],
            fontName="Helvetica-Bold",
            fontSize=12,
            leading=16,
            textColor=colors.HexColor("#0f172a"),
            spaceAfter=6,
        )
    )

    return styles


def _paragraph(text: str, style):
    safe_text = escape(text or "")
    return Paragraph(safe_text.replace("\n", "<br/>"), style)


def _bullets(items: list[str], style):
    elements = []

    for item in items or []:
        elements.append(Paragraph(f"• {escape(item)}", style))

    if not elements:
        elements.append(Paragraph("• No data available", style))

    return elements


def _meta_table(user_doc: dict, report_doc: dict):
    created_at = report_doc.get("updated_at") or report_doc.get("created_at")
    created_label = created_at.strftime("%Y-%m-%d %H:%M") if isinstance(created_at, datetime) else "—"

    data = [
        ["Candidate", user_doc.get("full_name", "—")],
        ["Email", user_doc.get("email", "—")],
        ["Target Role", user_doc.get("target_role", "—") or "—"],
        ["Generated At", created_label],
    ]

    table = Table(data, colWidths=[3.2 * cm, 12.6 * cm])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#e2e8f0")),
                ("BACKGROUND", (1, 0), (1, -1), colors.white),
                ("TEXTCOLOR", (0, 0), (-1, -1), colors.HexColor("#0f172a")),
                ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                ("FONTNAME", (1, 0), (1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 10),
                ("LEADING", (0, 0), (-1, -1), 14),
                ("BOX", (0, 0), (-1, -1), 0.7, colors.HexColor("#cbd5e1")),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    return table


def _score_table(label: str, value: str):
    table = Table([[label, value]], colWidths=[8 * cm, 7.8 * cm])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#e0f2fe")),
                ("TEXTCOLOR", (0, 0), (-1, -1), colors.HexColor("#0f172a")),
                ("FONTNAME", (0, 0), (0, 0), "Helvetica-Bold"),
                ("FONTNAME", (1, 0), (1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 12),
                ("BOX", (0, 0), (-1, -1), 0.7, colors.HexColor("#7dd3fc")),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 12),
                ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                ("TOPPADDING", (0, 0), (-1, -1), 12),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
            ]
        )
    )
    return table


def _section_box(title: str, items: list[str], styles):
    story = [_paragraph(title, styles["CardTitle"])]
    story.extend(_bullets(items, styles["BodyTextCustom"]))

    table = Table([[story]], colWidths=[16 * cm])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
                ("BOX", (0, 0), (-1, -1), 0.7, colors.HexColor("#cbd5e1")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 12),
                ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                ("TOPPADDING", (0, 0), (-1, -1), 12),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
            ]
        )
    )
    return table


def _build_resume_review_story(user_doc: dict, report_doc: dict, styles):
    content = report_doc.get("content", {})
    story = []

    story.append(_score_table("Resume Score", f'{content.get("score", "—")}/100'))
    story.append(Spacer(1, 0.4 * cm))

    story.append(_paragraph("Summary", styles["SectionTitle"]))
    story.append(_paragraph(content.get("summary", "No summary available"), styles["BodyTextCustom"]))
    story.append(Spacer(1, 0.2 * cm))

    story.append(_section_box("Strengths", content.get("strengths", []), styles))
    story.append(Spacer(1, 0.3 * cm))
    story.append(_section_box("Weaknesses", content.get("weaknesses", []), styles))
    story.append(Spacer(1, 0.3 * cm))
    story.append(_section_box("Suggestions", content.get("suggestions", []), styles))

    return story


def _build_skill_gap_story(user_doc: dict, report_doc: dict, styles):
    content = report_doc.get("content", {})
    story = []

    story.append(_score_table("Readiness Score", f'{content.get("readiness_score", "—")}/100'))
    story.append(Spacer(1, 0.4 * cm))

    story.append(_paragraph("Summary", styles["SectionTitle"]))
    story.append(_paragraph(content.get("summary", "No summary available"), styles["BodyTextCustom"]))
    story.append(Spacer(1, 0.2 * cm))

    story.append(_section_box("Matched Skills", content.get("matched_skills", []), styles))
    story.append(Spacer(1, 0.3 * cm))
    story.append(_section_box("Missing Skills", content.get("missing_skills", []), styles))
    story.append(Spacer(1, 0.3 * cm))
    story.append(_section_box("Priority Skills", content.get("priority_skills", []), styles))
    story.append(Spacer(1, 0.3 * cm))
    story.append(_section_box("Next Steps", content.get("next_steps", []), styles))

    return story


def _build_roadmap_story(user_doc: dict, report_doc: dict, styles):
    content = report_doc.get("content", {})
    weeks = content.get("weeks", [])
    story = []

    story.append(_score_table("Roadmap Duration", f'{content.get("duration_weeks", "—")} weeks'))
    story.append(Spacer(1, 0.4 * cm))

    story.append(_paragraph("Summary", styles["SectionTitle"]))
    story.append(_paragraph(content.get("summary", "No summary available"), styles["BodyTextCustom"]))
    story.append(Spacer(1, 0.3 * cm))

    for week in weeks:
        week_title = f'Week {week.get("week_number", "—")} - {week.get("title", "")}'
        block = [
            _paragraph(week_title, styles["CardTitle"]),
            _paragraph("Goals", styles["BodyTextCustom"]),
            *_bullets(week.get("goals", []), styles["BodyTextCustom"]),
            Spacer(1, 0.12 * cm),
            _paragraph("Tasks", styles["BodyTextCustom"]),
            *_bullets(week.get("tasks", []), styles["BodyTextCustom"]),
            Spacer(1, 0.12 * cm),
            _paragraph("Project Suggestion", styles["BodyTextCustom"]),
            _paragraph(week.get("project_suggestion", "No suggestion available"), styles["BodyTextCustom"]),
        ]

        table = Table([[block]], colWidths=[16 * cm])
        table.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
                    ("BOX", (0, 0), (-1, -1), 0.7, colors.HexColor("#cbd5e1")),
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 12),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                    ("TOPPADDING", (0, 0), (-1, -1), 12),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
                ]
            )
        )

        story.append(table)
        story.append(Spacer(1, 0.3 * cm))

    return story


def build_pdf_filename(report_type: str) -> str:
    return f"{report_type}_report.pdf"


def generate_ai_report_pdf(user_doc: dict, report_doc: dict) -> bytes:
    report_type = report_doc.get("report_type", "")
    title = REPORT_TYPE_TITLES.get(report_type, "CareerPilot Report")

    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=1.7 * cm,
        rightMargin=1.7 * cm,
        topMargin=1.5 * cm,
        bottomMargin=1.5 * cm,
        title=title,
        author="CareerPilot AI",
    )

    styles = _build_styles()
    story = []

    story.append(_paragraph(title, styles["ReportTitle"]))
    story.append(_paragraph("Generated by CareerPilot AI", styles["SmallMuted"]))
    story.append(_meta_table(user_doc, report_doc))
    story.append(Spacer(1, 0.55 * cm))

    if report_type == "resume_review":
        story.extend(_build_resume_review_story(user_doc, report_doc, styles))
    elif report_type == "skill_gap":
        story.extend(_build_skill_gap_story(user_doc, report_doc, styles))
    elif report_type == "roadmap":
        story.extend(_build_roadmap_story(user_doc, report_doc, styles))
    else:
        story.append(_paragraph("Unsupported report type", styles["BodyTextCustom"]))

    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()

    return pdf_bytes