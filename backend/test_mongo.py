from pymongo import MongoClient
from pymongo.server_api import ServerApi
from app.core.config import settings

uri = settings.MONGO_URI

client = MongoClient(
    uri,
    server_api=ServerApi(version="1", strict=True, deprecation_errors=True),
)

try:
    client.admin.command({"ping": 1})
    print("Connected successfully to MongoDB Atlas")
finally:
    client.close()