from app.core.security import hash_password, verify_password
from app.models.user_model import build_user_document


def get_user_by_email(db, email: str):
    return db.users.find_one({"email": email.strip().lower()})


def create_user(db, full_name: str, email: str, password: str, legal_acceptance: dict):
    user_doc = build_user_document(
        full_name=full_name.strip(),
        email=email.strip().lower(),
        password_hash=hash_password(password),
        legal_acceptance=legal_acceptance,
    )

    result = db.users.insert_one(user_doc)

    return db.users.find_one({"_id": result.inserted_id})


def authenticate_user(db, email: str, password: str):
    user_doc = get_user_by_email(db, email)

    if not user_doc:
        return None

    if not verify_password(password, user_doc["password_hash"]):
        return None

    return user_doc