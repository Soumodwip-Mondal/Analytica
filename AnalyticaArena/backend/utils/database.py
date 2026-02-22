from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure
import os
from dotenv import load_dotenv

load_dotenv()

class Database:
    client: AsyncIOMotorClient = None
    db = None

database = Database()

async def connect_to_mongo():
    """Connect to MongoDB"""
    try:
        database.client = AsyncIOMotorClient(os.getenv("MONGODB_URI"), serverSelectionTimeoutMS=5000)
        database.db = database.client[os.getenv("DATABASE_NAME")]
        
        # Test connection
        await database.client.admin.command('ping')
        print("✅ Connected to MongoDB successfully!")
        
    except Exception as e:
        print(f"⚠️  MongoDB not available: {e}")
        print("⚠️  Server will start but database features won't work")
        database.client = None
        database.db = None

async def close_mongo_connection():
    """Close MongoDB connection"""
    if database.client:
        database.client.close()
        print("🔌 MongoDB connection closed")

def get_database():
    """Get database instance"""
    return database.db
