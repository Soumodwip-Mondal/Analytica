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
        database.client = AsyncIOMotorClient(os.getenv("MONGODB_URI"))
        database.db = database.client[os.getenv("DATABASE_NAME")]
        
        # Test connection
        await database.client.admin.command('ping')
        print("✅ Connected to MongoDB successfully!")
        
    except ConnectionFailure as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        raise

async def close_mongo_connection():
    """Close MongoDB connection"""
    if database.client:
        database.client.close()
        print("🔌 MongoDB connection closed")

def get_database():
    """Get database instance"""
    return database.db
