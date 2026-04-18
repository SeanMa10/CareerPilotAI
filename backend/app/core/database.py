from pymongo import MongoClient
from pymongo.server_api import ServerApi

from app.core.config import settings

client = MongoClient(
    settings.MONGO_URI,
    server_api=ServerApi(version="1", strict=True, deprecation_errors=True),
)

db = client[settings.DATABASE_NAME]


def get_database():
    return db