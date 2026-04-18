from fastapi import APIRouter, Depends

from app.dependencies.auth_dependency import get_current_user_document
from app.schemas.access_schema import AccessStatusResponse
from app.services.access_service import get_access_status_payload

router = APIRouter()


@router.get("/status", response_model=AccessStatusResponse)
def get_access_status(current_user_doc=Depends(get_current_user_document)):
    return get_access_status_payload(current_user_doc)