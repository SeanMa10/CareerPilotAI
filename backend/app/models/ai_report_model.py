def serialize_ai_report(report_doc: dict) -> dict:
    return {
        "id": str(report_doc["_id"]),
        "user_id": str(report_doc["user_id"]),
        "resume_id": str(report_doc["resume_id"]),
        "report_type": report_doc.get("report_type", "resume_review"),
        "content": report_doc.get("content", {}),
        "created_at": report_doc.get("created_at"),
        "updated_at": report_doc.get("updated_at"),
    }