# Database connection and session management
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import MONGO_URI

client = AsyncIOMotorClient(MONGO_URI)
db = client["formatai"]

users_collections = db["users"]
generations_collections = db["generations"]
