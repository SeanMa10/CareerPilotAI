from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, status

from app.core.config import settings
from app.core.database import get_database
from app.core.security import create_access_token
from app.dependencies.auth_dependency import get_current_user
from app.dependencies.rate_limit import rate_limit
from app.models.user_model import serialize_user
from app.schemas.auth_schema import AuthResponse, LoginRequest, RegisterRequest
from app.services.auth_service import authenticate_user, create_user, get_user_by_email

router = APIRouter()


@router.post(
    "/register",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(rate_limit("auth_register", 5, 600))],
)
def register(payload: RegisterRequest, request: Request):
    db = get_database()

    existing_user = get_user_by_email(db, payload.email)

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    forwarded_for = request.headers.get("x-forwarded-for", "").strip()
    if forwarded_for:
        ip_address = forwarded_for.split(",")[0].strip()
    else:
        ip_address = request.client.host if request.client else ""

    legal_acceptance = {
        "terms_version": settings.TERMS_VERSION,
        "privacy_version": settings.PRIVACY_VERSION,
        "accepted_at": datetime.now(timezone.utc),
        "ip_address": ip_address,
        "user_agent": (request.headers.get("user-agent", "") or "")[:500],
    }

    user_doc = create_user(
        db=db,
        full_name=payload.full_name,
        email=payload.email,
        password=payload.password,
        legal_acceptance=legal_acceptance,
    )

    token = create_access_token({"sub": str(user_doc["_id"])})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": serialize_user(user_doc),
    }


@router.post(
    "/login",
    response_model=AuthResponse,
    dependencies=[Depends(rate_limit("auth_login", 10, 600))],
)
def login(payload: LoginRequest):
    db = get_database()

    user_doc = authenticate_user(
        db=db,
        email=payload.email,
        password=payload.password,
    )

    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token({"sub": str(user_doc["_id"])})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": serialize_user(user_doc),
    }


@router.get("/me")
def me(current_user=Depends(get_current_user)):
    return {"user": current_user}