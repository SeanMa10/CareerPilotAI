from datetime import datetime, timezone

from fastapi import APIRouter, Depends

from app.core.database import get_database
from app.dependencies.auth_dependency import get_current_user, get_current_user_document
from app.models.user_model import serialize_user
from app.schemas.user_schema import UpdateProfileRequest, UserPublic

router = APIRouter()


@router.get("/profile", response_model=UserPublic)
def get_profile(current_user=Depends(get_current_user)):
    return current_user


@router.put("/profile", response_model=UserPublic)
def update_profile(
    payload: UpdateProfileRequest,
    current_user_doc=Depends(get_current_user_document),
):
    db = get_database()

    update_data = payload.model_dump(exclude_unset=True)

    if "skills" in update_data and update_data["skills"] is not None:
        update_data["skills"] = [
            skill.strip().lower()
            for skill in update_data["skills"]
            if skill.strip()
        ]

    if not update_data:
        return serialize_user(current_user_doc)

    update_data["updated_at"] = datetime.now(timezone.utc)

    db.users.update_one(
        {"_id": current_user_doc["_id"]},
        {"$set": update_data},
    )

    updated_user = db.users.find_one({"_id": current_user_doc["_id"]})

    return serialize_user(updated_user)